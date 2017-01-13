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
                res.writeHead(2.05);
                res.end(requestHandler.onRead());
            } else if (req.method==="PUT") {
                requestHandler.onWrite(req.payload)
                res.writeHead(2.04);
                res.end("Changed");
            } else if (req.method==="POST") {
                res.writeHead(2.05);
                res.end( requestHandler.onInvoke(req.payload) );
            } else if (req.method==="DELETE") {
                res.writeHead(2.02);
                requestHandler.onUnlink();
                res.end("Deleted");
            } else {
                res.writeHead(4.05);
                res.end("Method Not Allowed");
            }
        }
    }

}