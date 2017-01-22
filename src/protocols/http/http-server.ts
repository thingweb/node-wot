/**
 * HTTP Server based on http
 */

import {logger} from "../../logger";
import * as http from "http";
import * as url from "url";

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

        this.server.on("error", (err) => logger.error(`HttpServer for port ${this.port} failed: ${err.message}`) );
    }

    public addResource(path: string, res: ResourceListener) : boolean {
        if (this.resources[path]!==undefined) {
            logger.warn(`HttpServer on port ${this.getPort()} already has ResourceListener ${path}`)
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
        logger.info("HttpServer starting on " + (this.address!==undefined ? this.address+" " : "") + "port " + this.port);
        this.server.listen(this.port, this.address);
        // FIXME .listen() is async
        return this.server.listening;
    }

    public stop() : boolean {
        this.server.close();
        return !this.server.listening;
    }

    public getPort() : number {
        if (this.server.listening) {
            return this.server.address().port;
        } else {
            return -1;
        }
    }

    private handleRequest(req : http.IncomingMessage, res : http.ServerResponse) {
        logger.info(`HttpServer on port ${this.getPort()} received ${req.method} ${req.url} from ${req.socket.remoteAddress} port ${req.socket.remotePort}`);
        res.on("finish", () => { logger.info(`CoapServer replied with ${res.statusCode} to ${req.socket.remoteAddress} port ${req.socket.remotePort}`); } );
        
        let requestUri = url.parse(req.url);
        let requestHandler = this.resources[requestUri.pathname];

        if (requestHandler===undefined) {
            res.writeHead(404);
            res.end("Not Found");
        } else {
            if (req.method==="GET") {
                requestHandler.onRead()
                    .then( buffer => { res.writeHead(200); res.end(buffer); })
                    .catch( err => { res.writeHead(500); res.end(err.message); });
            } else if (req.method==="PUT") {
                let body : Array<any> = [];
                req.on("data", (data) => { body.push(data) } );
                req.on("end", () => {
                    logger.verbose(`HttpServer on port ${this.getPort()} completed body '${body}'`);
                    requestHandler.onWrite(Buffer.concat(body))
                        .then( () => { res.writeHead(204); res.end(""); } )
                        .catch( err => { res.writeHead(500); res.end(err.message); } );
                });
            } else if (req.method==="POST") {
                let body : Array<any> = [];
                req.on("data", (data) => {body.push(data)} );
                req.on("end", () => {
                    logger.verbose(`HttpServer on port ${this.getPort()} completed body '${body}'`);
                    requestHandler.onInvoke(Buffer.concat(body))
                        .then( buffer => { res.writeHead(200); res.end(buffer); })
                        .catch( (err) => { res.writeHead(500); res.end(err.message); });
                });
            } else if (req.method==="DELETE") {
                requestHandler.onUnlink()
                    .then( () => { res.writeHead(204); res.end(""); })
                    .catch( err => { res.writeHead(500); res.end(err.message); });
            } else {
                res.writeHead(405);
                res.end("Method Not Allowed");
            }
        }
    }

}