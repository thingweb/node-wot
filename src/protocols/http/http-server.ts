/**
 * HTTP Server based on http
 */

import {logger} from '../../logger'
import * as http from 'http'
import * as url from 'url'

export default class HttpServer implements ProtocolServer {

    private readonly port : number = 8080;
    private readonly address : string = undefined;
    private readonly server : http.Server = http.createServer( (req, res) => {this.handleRequest(req, res)} );

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
        logger.info("Starting HTTP server on " + (this.address!==undefined ? this.address+" " : "") + "port " + this.port);
        this.server.listen(this.port, this.address);
        return this.server.listening;
    }

    public stop(): boolean {
        this.server.close();
        return this.server.listening;
    }

    private handleRequest(req : http.IncomingMessage, res : http.ServerResponse) {
        logger.info("Received request for " + req.url);
        
        let requestUri = url.parse(req.url);
        let requestHandler = this.resources[requestUri.pathname];

        if (requestHandler===undefined) {
            res.writeHead(404);
            res.end("Not Found");
        } else {
            if (req.method==="GET") {
                res.writeHead(200);
                res.end(requestHandler.onRead());
            } else if (req.method==="PUT") {
                let body : Array<any> = [];
                req.on("data", (data) => {body.push(data)} );
                req.on("end", () => {requestHandler.onWrite(Buffer.concat(body))})
                res.writeHead(204);
                res.end("Changed");
            } else if (req.method==="POST") {
                let body : Array<any> = [];
                req.on("data", (data) => {body.push(data)} );
                req.on("end", () => {
                    res.writeHead(200);
                    res.end( requestHandler.onInvoke(Buffer.concat(body)) );
                });
            } else if (req.method==="DELETE") {
                res.writeHead(204);
                requestHandler.onUnlink();
                res.end("Deleted");
            } else {
                res.writeHead(405);
                res.end("Method Not Allowed");
            }
        }
    }

}