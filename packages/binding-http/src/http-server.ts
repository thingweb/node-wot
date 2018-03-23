/*
 * W3C Software License
 *
 * Copyright (c) 2018 the thingweb community
 *
 * THIS WORK IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR
 * WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF
 * MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE
 * SOFTWARE OR DOCUMENT WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS,
 * TRADEMARKS OR OTHER RIGHTS.
 *
 * COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR
 * CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENT.
 *
 * The name and trademarks of copyright holders may NOT be used in advertising or
 * publicity pertaining to the work without specific, written prior permission. Title
 * to copyright in this work will at all times remain with copyright holders.
 */

/**
 * HTTP Server based on http
 */

import * as http from "http";
import * as url from "url";

import TDResourceListener, { ProtocolServer, ResourceListener, ContentSerdes } from "@node-wot/core";
import { PropertyResourceListener, ActionResourceListener, EventResourceListener } from "@node-wot/core";

export default class HttpServer implements ProtocolServer {

  public readonly scheme: string = "http";
  private readonly port: number = 8080;
  private readonly address: string = undefined;
  private readonly server: http.Server = http.createServer((req, res) => { this.handleRequest(req, res) });
  private running: boolean = false;
  private failed: boolean = false;

  private readonly resources: { [key: string]: ResourceListener } = {};

  constructor(port?: number, address?: string) {
    if (port !== undefined) {
      this.port = port;
    }
    if (address !== undefined) {
      this.address = address;
    }
  }

  public addResource(path: string, res: ResourceListener): boolean {
    if (this.resources[path] !== undefined) {
      console.warn(`HttpServer on port ${this.getPort()} already has ResourceListener '${path}' - skipping`);
      return false;
    } else {
      // TODO debug-level
      console.log(`HttpServer on port ${this.getPort()} adding resource '${path}'`);
      this.resources[path] = res;
      return true;
    }
  }

  public removeResource(path: string): boolean {
    // TODO debug-level
    console.log(`HttpServer on port ${this.getPort()} removing resource '${path}'`);
    return delete this.resources[path];
  }

  public start(): Promise<void> {
    console.info(`HttpServer starting on ${(this.address !== undefined ? this.address + ' ' : '')}port ${this.port}`);
    return new Promise<void>((resolve, reject) => {

      // start promise handles all errors until successful start
      this.server.once('error', (err: Error) => { reject(err); });
      this.server.once('listening', () => {
        // once started, console "handles" errors
        this.server.on('error', (err: Error) => {
          console.error(`HttpServer on port ${this.port} failed: ${err.message}`);
        });
        resolve();
      });
      this.server.listen(this.port, this.address);
    });
  }

  public stop(): Promise<void> {
    console.info(`HttpServer stopping on port ${this.getPort()}`);
    return new Promise<void>((resolve, reject) => {

      // stop promise handles all errors from now on
      this.server.once('error', (err: Error) => { reject(err); });
      this.server.once('close', () => { resolve(); });
      this.server.close();
    });
  }

  public getPort(): number {
    if (this.server.address()) {
      return this.server.address().port;
    } else {
      return -1;
    }
  }

  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {

    res.on('finish', () => {
      console.log(`HttpServer on port ${this.getPort()} replied with ${res.statusCode} to ${req.socket.remoteAddress} port ${req.socket.remotePort}`);
    });

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization, *');
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    let requestUri = url.parse(req.url);
    let requestHandler = this.resources[requestUri.pathname];
    let contentTypeHeader: string | string[] = req.headers["content-type"];
    let mediaType: string = Array.isArray(contentTypeHeader) ? contentTypeHeader[0] : contentTypeHeader;

    console.log(`HttpServer on port ${this.getPort()} received ${req.method} ${requestUri.pathname} from ${req.socket.remoteAddress} port ${req.socket.remotePort}`);
    
    // FIXME must be rejected with 415 Unsupported Media Type, guessing not allowed -> debug/testing flag
    if ((req.method === "PUT" || req.method === "POST") && (!mediaType || mediaType.length == 0)) {
      console.warn(`HttpServer on port ${this.getPort()} got no Media Type for ${req.method}`);
      mediaType = ContentSerdes.DEFAULT;
    }

    if (requestHandler === undefined) {
      res.writeHead(404);
      res.end("Not Found");

    } else if ( (req.method === "PUT" || req.method === "POST")
              && ContentSerdes.get().getSupportedMediaTypes().indexOf(ContentSerdes.get().isolateMediaType(mediaType))<0) {
      res.writeHead(415);
      res.end("Unsupported Media Type");

    } else {
      if (req.method === "GET" && (requestHandler.getType()==="Property" || requestHandler.getType()==="Asset" ||(requestHandler.getType()==="TD"))) {
        requestHandler.onRead()
          .then(content => {
            if (!content.mediaType) {
              console.warn(`HttpServer on port ${this.getPort()} got no Media Type from ${req.socket.remoteAddress} port ${req.socket.remotePort}`);
            } else {
              res.setHeader("Content-Type", content.mediaType);
            }
            res.writeHead(200);
            res.end(content.body);
          })
          .catch(err => {
            console.error(`HttpServer on port ${this.getPort()} got internal error on read '${requestUri.pathname}': ${err.message}`);
            res.writeHead(500);
            res.end(err.message);
          });

      } else if (req.method === "PUT" && requestHandler.getType()==="Property" || requestHandler.getType()==="Asset") {
        let body: Array<any> = [];
        req.on("data", (data) => { body.push(data) });
        req.on("end", () => {
          console.debug(`HttpServer on port ${this.getPort()} completed body '${body}'`);
          requestHandler.onWrite({ mediaType: mediaType, body: Buffer.concat(body) })
            .then(() => {
              res.writeHead(204);
              res.end("Changed");
            })
            .catch(err => {
              console.error(`HttpServer on port ${this.getPort()} got internal error on write '${requestUri.pathname}': ${err.message}`);
              res.writeHead(500);
              res.end(err.message);
            });
        });

      } else if (req.method === "POST" && requestHandler.getType()==="Action") {
        let body: Array<any> = [];
        req.on("data", (data) => { body.push(data) });
        req.on("end", () => {
          console.debug(`HttpServer on port ${this.getPort()} completed body '${body}'`);
          requestHandler.onInvoke({ mediaType: mediaType, body: Buffer.concat(body) })
            .then(content => {
              // Actions may have a void return (no output)
              if (content.body === null) {
                res.writeHead(204);
                res.end("Changed");
              } else {
                if (!content.mediaType) {
                  console.warn(`HttpServer on port ${this.getPort()} got no Media Type from '${requestUri.pathname}'`);
                } else {
                  res.setHeader('Content-Type', content.mediaType);
                }
                res.writeHead(200);
                res.end(content.body);
              }
            })
            .catch((err) => {
              console.error(`HttpServer on port ${this.getPort()} got internal error on invoke '${requestUri.pathname}': ${err.message}`);
              res.writeHead(500);
              res.end(err.message);
            });
        });

      } else if (requestHandler instanceof EventResourceListener) {
        res.setHeader("Connection", "Keep-Alive");
        // FIXME get supported content types from EventResourceListener
        res.setHeader("Content-Type", ContentSerdes.DEFAULT);
        res.writeHead(200);
        let subscription = requestHandler.subscribe({
          next: (content) => res.end(content.body),
          complete: () => res.end()
        });
        res.on("close", () => {
          console.warn(`HttpServer on port ${this.getPort()} lost Event connection`);
          subscription.unsubscribe();
        });
        res.on("finish", () => {
          console.warn(`HttpServer on port ${this.getPort()} closed Event connection`);
          subscription.unsubscribe();
        });
        res.setTimeout(60*60*1000, () => subscription.unsubscribe());

      } else if (req.method === "DELETE") {
        requestHandler.onUnlink()
          .then(() => {
            res.writeHead(204);
            res.end("Deleted");
          })
          .catch(err => {
            console.error(`HttpServer on port ${this.getPort()} got internal error on unlink '${requestUri.pathname}': ${err.message}`);
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
