/*
 * The MIT License (MIT)
 * Copyright (c) 2017 the thingweb community
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * CoAP Server based on coap by mcollini
 */

import {logger} from '../../logger'
import * as url from 'url'

var coap = require('coap');

export default class HttpServer implements ProtocolServer {

    private readonly port : number = 5683;
    private readonly address : string = undefined;
    private readonly server : any = coap.createServer();

    private readonly resources : {[key : string] : ResourceListener } = { };

    constructor(port? : number, address? : string) {
        if (port!==undefined) {
            this.port = port;
        }
        if (address!==undefined) {
            this.address = address;
        }
    }

    public addResource(path: string, res: ResourceListener) : boolean {
        if (this.resources[path]!==undefined) {
            logger.warn(`Resource ${path} already registered for HTTP`)
            return false;
        } else {
            this.resources[path] = res;
            return true;
        }
    }

    public removeResourceListener(path: string): boolean {
        return delete this.resources[path];
    }
    
    public start(): boolean {
        logger.info("Starting CoAP server on " + (this.address!==undefined ? this.address+" " : "") + "port " + this.port);
        this.server.listen(this.port, this.address);
        this.server.on('request', (req : any, res : any) => { this.handleRequest(req, res); });
        return this.server.listening;
    }

    public stop(): boolean {
        this.server.close();
        return this.server.listening;
    }

    private handleRequest(req : any, res : any) {
        logger.info("Received request for " + req.url);
        
        let requestUri = url.parse(req.url);
        let requestHandler = this.resources[requestUri.pathname];

        if (requestHandler===undefined) {
            res.writeHead(4.04);
            res.end("Not Found");
        } else {
            if (req.method==="GET") {
                res.code = "2.05";
                res.end(requestHandler.onRead());
            } else if (req.method==="PUT") {
                requestHandler.onWrite(req.payload)
                res.code = "2.04";
                res.end("Changed");
            } else if (req.method==="POST") {
                res.code = "2.05";
                res.end( requestHandler.onInvoke(req.payload) );
            } else if (req.method==="DELETE") {
                res.code = "2.02";
                requestHandler.onUnlink();
                res.end("Deleted");
            } else {
                res.code = "4.05";
                res.end("Method Not Allowed");
            }
        }
        logger.info("Replied with " + res.code);
    }

}