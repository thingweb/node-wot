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
 * HTTP Server based on http
 */

import logger from "node-wot-logger";

import * as http from "http";
import * as url from "url";
import ContentSerdes from "node-wot-content-serdes";
import {ProtocolServer,ResourceListener} from "node-wot-protocols"

const deasync = require("deasync");

export default class HttpServer implements ProtocolServer {

    private readonly port : number = 8080;
    private readonly address : string = undefined;
    private readonly server : http.Server = http.createServer( (req, res) => {this.handleRequest(req, res)} );
    private running : boolean = false;
    private failed : boolean = false;

    private readonly resources : {[key : string] : ResourceListener } = { };

    constructor(port? : number, address? : string) {
        if (port!==undefined) {
            this.port = port;
        }
        if (address!==undefined) {
            this.address = address;
        }

        this.server.on("error", (err) => { logger.error(`HttpServer for port ${this.port} failed: ${err.message}`); this.failed = true; } );
    }

    public getScheme() : string {
        return "http"
    }

    public addResource(path: string, res: ResourceListener) : boolean {
        if (this.resources[path]!==undefined) {
            logger.warn(`HttpServer on port ${this.getPort()} already has ResourceListener ${path}`);
            return false;
        } else {
            logger.debug(`HttpServer on port ${this.getPort()} addeding resource '${path}'`);
            this.resources[path] = res;
            return true;
        }
    }

    public removeResource(path: string): boolean {
        logger.debug(`HttpServer on port ${this.getPort()} removing resource '${path}'`);
        return delete this.resources[path];
    }
    
    public start() : boolean {
        logger.info(`HttpServer starting on ${(this.address!==undefined ? this.address+" " : "")}port ${this.port}`);
        this.server.listen(this.port, this.address);
        // FIXME .listen() is async, but works for http
        // this.server.listening not available on v4.2
        this.server.once('listening', () => { this.running = true; });
        while (!this.running && !this.failed) {
            deasync.runLoopOnce();
        }
        // synchronous return useless anyway due to async server API
        return this.running;
    }

    public stop() : boolean {
        logger.info(`HttpServer stopping on port ${this.getPort()} (running=${this.running})`);
        let closed = this.running;
        this.server.once("close", () => { closed = true; });
        this.server.close();

        while (!closed && !this.failed) {
            deasync.runLoopOnce();
        }

        this.running = false;
        return closed;
    }

    public getPort() : number {
        if (this.running) {
            return this.server.address().port;
        } else {
            return -1;
        }
    }

    private handleRequest(req : http.IncomingMessage, res : http.ServerResponse) {
        logger.info(`HttpServer on port ${this.getPort()} received ${req.method} ${req.url} from ${req.socket.remoteAddress} port ${req.socket.remotePort}`);

        res.on("finish", () => {
            logger.info(`HttpServer replied with ${res.statusCode} to ${req.socket.remoteAddress} port ${req.socket.remotePort}`);
            logger.debug(`HttpServer sent Content-Type: '${res.getHeader("Content-Type")}'`);
        });

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        let requestUri = url.parse(req.url);
        let requestHandler = this.resources[requestUri.pathname];
        // TODO must be rejected with 415 Unsupported Media Type, guessing not allowed
        let mediaType = req.headers["Content-Type"] ? req.headers["Content-Type"] : ContentSerdes.DEFAULT;

        if (requestHandler===undefined) {
            res.writeHead(404);
            res.end("Not Found");
        } else {
            if (req.method==="GET") {
                requestHandler.onRead()
                    .then( content => {
                        // TODO better mediaType check; more strict and throw Error?
                        if (!content.mediaType || content.mediaType=="") {
                            logger.warn(`CoapServer got no Media Type from '${requestUri.pathname}'`);
                        } else {
                            res.setHeader("Content-Type", content.mediaType);
                        }
                        res.writeHead(200);
                        res.end(content.body);
                    })
                    .catch( err => {
                        logger.verbose(`HttpServer on port ${this.getPort()} got internal error on read '${requestUri.pathname}': ${err.message}`);
                        res.writeHead(500);
                        res.end(err.message);
                    });
            } else if (req.method==="PUT") {
                let body : Array<any> = [];
                req.on("data", (data) => { body.push(data) } );
                req.on("end", () => {
                    logger.verbose(`HttpServer on port ${this.getPort()} completed body '${body}'`);
                    requestHandler.onWrite({ mediaType: mediaType, body: Buffer.concat(body)})
                        .then( () => {
                            res.writeHead(204);
                            res.end("");
                        })
                        .catch( err => {
                            logger.verbose(`HttpServer on port ${this.getPort()} got internal error on write '${requestUri.pathname}': ${err.message}`);
                            res.writeHead(500);
                            res.end(err.message);
                        });
                });
            } else if (req.method==="POST") {
                let body : Array<any> = [];
                req.on("data", (data) => {body.push(data)} );
                req.on("end", () => {
                    logger.verbose(`HttpServer on port ${this.getPort()} completed body '${body}'`);
                    requestHandler.onInvoke({ mediaType: mediaType, body: Buffer.concat(body)})
                        .then( content => {
                            // TODO better mediaType check; more strict and throw Error?
                            if (!content.mediaType || content.mediaType=="") {
                                logger.warn(`CoapServer got no Media Type from '${requestUri.pathname}'`);
                            } else {
                                res.setHeader("Content-Type", content.mediaType);
                            }
                            res.writeHead(200);
                            res.end(content.body);
                        })
                        .catch( (err) => {
                            logger.verbose(`HttpServer on port ${this.getPort()} got internal error on invoke '${requestUri.pathname}': ${err.message}`);
                            res.writeHead(500);
                            res.end(err.message);
                        });
                });
            } else if (req.method==="DELETE") {
                requestHandler.onUnlink()
                    .then( () => {
                        res.writeHead(204);
                        res.end("");
                    })
                    .catch( err => {
                        logger.verbose(`HttpServer on port ${this.getPort()} got internal error on unlink '${requestUri.pathname}': ${err.message}`);
                        res.writeHead(500);
                        res.end(err.message);
                    });
            } else {
                res.writeHead(405);
                res.end("Method Not Allowed");
            }
        }
    }

}