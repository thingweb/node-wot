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
 * CoAP Server based on coap by mcollina
 */

import logger from "../../logger";
import * as url from "url";

var coap = require("coap");

export default class CoapServer implements ProtocolServer {

    private readonly port : number = 5683;
    private readonly address : string = undefined;
    private readonly server : any = coap.createServer();
    private ready : boolean = false;

    private readonly resources : {[key : string] : ResourceListener } = { };

    constructor(port? : number, address? : string) {
        if (port!==undefined) {
            this.port = port;
        }
        if (address!==undefined) {
            this.address = address;
        }

        this.server.on("error", (err : Error) => logger.error(`CoapServer for port ${this.port} failed: ${err.message}`) );
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

    public start() : boolean {
        // FIXME when starting CoapServer on an ephemeral port, it is not possible to get the actual port in a synchronous way
        logger.info("Starting CoAP server on " + (this.address!==undefined ? this.address+" " : "") + "port " + this.port);
        this.server.listen(this.port, this.address);
        this.server._sock.on('listening', () => { /* only place to figure out ephemeral port */ });
        this.server.on('request', (req : any, res : any) => { this.handleRequest(req, res); });
        // FIXME coap always creates a socket
        // @mkovatsc: Need to figure out how http implements server.listening
        return this.server._sock!==null;
    }

    public stop() : boolean {
        this.server.close();
        return this.server._sock===null;
    }

    public getPort() : number {
        if (this.server._sock!==null) {
            // FIXME coap does not provide proper API for this
            return this.server._port;
        } else {
            return -1; //this.port;
        }
    }

    private handleRequest(req : any, res : any) {
        logger.info(`CoapServer on port ${this.getPort()} received ${req.method} ${req.url} from ${req.rsinfo.address} port ${req.rsinfo.port}`);
        res.on("finish", () => { logger.info(`CoapServer replied with ${res.code} to ${req.rsinfo.address} port ${req.rsinfo.port}`); } );

        let requestUri = url.parse(req.url);
        let requestHandler = this.resources[requestUri.pathname];

        if (requestHandler===undefined) {
            res.code = "4.04";
            res.end("Not Found");
        } else {
            if (req.method==="GET") {
                requestHandler.onRead()
                    .then( buffer => { res.code = "2.05"; res.end(buffer); })
                    .catch( err => { res.code = "5.00"; res.end(err.message); });
            } else if (req.method==="PUT") {
                requestHandler.onWrite(req.payload)
                    .then( () => { res.code = "2.04"; res.end("Changed"); } )
                    .catch( err => { res.code = "5.00"; res.end(err.message); } );
            } else if (req.method==="POST") {
                requestHandler.onInvoke(req.payload)
                    .then( buffer => { res.code = "2.05"; res.end(buffer); })
                    .catch( err => { res.code = "5.00"; res.end(err.message); });
            } else if (req.method==="DELETE") {
                requestHandler.onUnlink()
                    .then( () => { res.code = "2.02"; res.end("Deleted"); })
                    .catch( err => { res.code = "5.00"; res.end(err.message); });
            } else {
                res.code = "4.05";
                res.end("Method Not Allowed");
            }
        }
    }
}