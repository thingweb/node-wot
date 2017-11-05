/*
 * W3C Software License
 *
 * Copyright (c) 2017 the thingweb community
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

import * as http from 'http';
import * as url from 'url';
// import ContentSerdes from 'node-wot-content-serdes';
import {ContentSerdes} from 'node-wot';
import { ProtocolServer, ResourceListener } from 'node-wot'

const deasync = require('deasync');

export default class HttpServer implements ProtocolServer {

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

    this.server.on('error', (err) => {
      console.error(`HttpServer for port ${this.port} failed: ${err.message}`); this.failed = true;
    });
  }

  public getScheme(): string {
    return 'http'
  }

  public addResource(path: string, res: ResourceListener): boolean {
    if (this.resources[path] !== undefined) {
      console.warn(`HttpServer on port ${this.getPort()} already has ResourceListener '${path}' - skipping`);
      return false;
    } else {
      console.log(`HttpServer on port ${this.getPort()} addeding resource '${path}'`);
      this.resources[path] = res;
      return true;
    }
  }

  public removeResource(path: string): boolean {
    console.log(`HttpServer on port ${this.getPort()} removing resource '${path}'`);
    return delete this.resources[path];
  }

  public start(): boolean {
    console.info(`HttpServer starting on ${(this.address !== undefined ? this.address + ' ' : '')}port ${this.port}`);
    this.server.listen(this.port, this.address);
    this.server.once('listening', () => { this.running = true; });
    // converting async listen API to sync start function
    setTimeout(()=>{}, 0);
    while (!this.running && !this.failed) {
      deasync.runLoopOnce();
    }
    return this.running;
  }

  public stop(): boolean {
    console.info(`HttpServer stopping on port ${this.getPort()} (running=${this.running})`);
    let closed = this.running;
    this.server.once('close', () => { closed = true; });
    this.server.close();

    while (!closed && !this.failed) {
      deasync.runLoopOnce();
    }

    this.running = false;
    return closed;
  }

  public getPort(): number {
    if (this.running) {
      return this.server.address().port;
    } else {
      return -1;
    }
  }

  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(`HttpServer on port ${this.getPort()} received ${req.method} ${req.url}`
      + ` from ${req.socket.remoteAddress} port ${req.socket.remotePort}`);

    res.on('finish', () => {
      console.log(`HttpServer replied with ${res.statusCode} to `
        + `${req.socket.remoteAddress} port ${req.socket.remotePort}`);
      console.log(`HttpServer sent Content-Type: '${res.getHeader('Content-Type')}'`);
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
    let contentTypeHeader : string | string[] = req.headers["content-type"];
    let mediaType : string = Array.isArray(contentTypeHeader) ? contentTypeHeader[0] : contentTypeHeader;
    // FIXME must be rejected with 415 Unsupported Media Type, guessing not allowed -> debug/testing flag
    if (!mediaType || mediaType.length == 0) mediaType = 'application/json'; // ContentSerdes.DEFAULT;

    if (requestHandler === undefined) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      if (req.method === 'GET') {
        requestHandler.onRead()
          .then(content => {
            if (!content.mediaType) {
              console.warn(`HttpServer got no Media Type from '${requestUri.pathname}'`);
            } else {
              res.setHeader('Content-Type', content.mediaType);
            }
            res.writeHead(200);
            res.end(content.body);
          })
          .catch(err => {
            console.error(`HttpServer on port ${this.getPort()} got internal error on read ` +
              `'${requestUri.pathname}': ${err.message}`);
            res.writeHead(500);
            res.end(err.message);
          });
      } else if (req.method === 'PUT') {
        let body: Array<any> = [];
        req.on('data', (data) => { body.push(data) });
        req.on('end', () => {
          console.log(`HttpServer on port ${this.getPort()} completed body '${body}'`);
          requestHandler.onWrite({ mediaType: mediaType, body: Buffer.concat(body) })
            .then(() => {
              res.writeHead(204);
              res.end('');
            })
            .catch(err => {
              console.error(`HttpServer on port ${this.getPort()} got internal error on `
                + `write '${requestUri.pathname}': ${err.message}`);
              res.writeHead(500);
              res.end(err.message);
            });
        });
      } else if (req.method === 'POST') {
        let body: Array<any> = [];
        req.on('data', (data) => { body.push(data) });
        req.on('end', () => {
          console.log(`HttpServer on port ${this.getPort()} completed body '${body}'`);
          requestHandler.onInvoke({ mediaType: mediaType, body: Buffer.concat(body) })
            .then(content => {
              // Actions may have a void return (no outputData)
              if (content.body === null) {
                res.writeHead(204);
              } else {
                if (!content.mediaType) {
                  console.warn(`HttpServer got no Media Type from '${requestUri.pathname}'`);
                } else {
                  res.setHeader('Content-Type', content.mediaType);
                }
                res.writeHead(200);
              }
              res.end(content.body);
            })
            .catch((err) => {
              console.error(`HttpServer on port ${this.getPort()} got internal error on `
                + `invoke '${requestUri.pathname}': ${err.message}`);
              res.writeHead(500);
              res.end(err.message);
            });
        });
      } else if (req.method === 'DELETE') {
        requestHandler.onUnlink()
          .then(() => {
            res.writeHead(204);
            res.end('');
          })
          .catch(err => {
            console.error(`HttpServer on port ${this.getPort()} got internal error on `
              + `unlink '${requestUri.pathname}': ${err.message}`);
            res.writeHead(500);
            res.end(err.message);
          });
      } else {
        res.writeHead(405);
        res.end('Method Not Allowed');
      }
    }
  }
}
