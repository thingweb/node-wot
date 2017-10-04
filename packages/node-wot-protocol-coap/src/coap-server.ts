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
 * CoAP Server based on coap by mcollina
 */

import * as url from 'url';
import {ContentSerdes} from 'node-wot';
import { ProtocolServer, ResourceListener, Content } from 'node-wot'

const coap = require('coap');
const deasync = require('deasync'); // to convert async calls to blocking calls

export default class CoapServer implements ProtocolServer {

  private readonly port: number = 5683;
  private readonly address: string = undefined;
  private readonly server: any = coap.createServer((req: any, res: any) => { this.handleRequest(req, res); });
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

    this.server.on('error', (err: Error) => {
      console.error(`CoapServer for port ${this.port} failed: ${err.message}`); this.failed = true;
    });
  }

  public getScheme(): string {
    return 'coap';
  }

  public addResource(path: string, res: ResourceListener): boolean {
    if (this.resources[path] !== undefined) {
      console.warn(`CoapServer on port ${this.getPort()} already has ResourceListener '${path}' - skipping`);
      return false;
    } else {
      console.log(`CoapServer on port ${this.getPort()} addeding resource '${path}'`);
      this.resources[path] = res;
      return true;
    }
  }

  public removeResource(path: string): boolean {
    console.log(`CoapServer on port ${this.getPort()} removing resource '${path}'`);
    return delete this.resources[path];
  }

  public start(): boolean {
    console.info(`CoapServer starting on ${(this.address !== undefined ? this.address + ' ' : '')}port ${this.port}`);

    if (this.socketFree()) {
      this.server.listen(this.port, this.address, () => { this.running = true; });
      // converting async listen API to sync start function
      setTimeout(() => {
        // put something in the event loop, since .listen() sometimes finishes immediately and deasync blocks
      }, 0);
      while (!this.running && !this.failed) {
        deasync.runLoopOnce();
      }
      return this.running;
    } else {
      this.server.emit('error', new Error('listen EADDRINUSE ' + this.port));
      return false;
    }
  }

  public stop(): boolean {
    console.info(`CoapServer stopping on port ${this.getPort()} (running=${this.running})`);
    let closed = this.running;
    this.server.close(() => { closed = true; });

    while (!closed && !this.failed) {
      deasync.runLoopOnce();
    }

    this.running = false;
    return closed;
  }

  public getPort(): number {
    if (this.running) {
      return this.server._sock.address().port;
    } else {
      return -1;
    }
  }

  private socketFree(): boolean {

    if (this.port === 0) {
      return true;
    }
    let dgram = require('dgram');

    let free: boolean = undefined;
    let tester = dgram.createSocket('udp4')
      .once('error', (err: any) => {
        if (err.code !== 'EADDRINUSE') {
          throw err;
        }
        free = false;
      })
      .once('listening', () => {
        tester.once('close', () => { free = true; }).close();
      })
      .bind(this.port);

    while (free === undefined) {
      deasync.runLoopOnce();
    }
    return free;
  }

  private handleRequest(req: any, res: any) {
    console.log(`CoapServer on port ${this.getPort()} received ${req.method} ${req.url}`
      + ` from ${req.rsinfo.address} port ${req.rsinfo.port}`);
    res.on('finish', () => {
      console.log(`CoapServer replied with ${res.code} to ${req.rsinfo.address} port ${req.rsinfo.port}`);
      // FIXME res.options is undefined, no other useful property to get Content-Format
      //logger.warn(`CoapServer sent Content-Format: '${res.options['Content-Format']}'`);
    });

    let requestUri = url.parse(req.url);
    let requestHandler = this.resources[requestUri.pathname];
    // TODO must be rejected with 4.15 Unsupported Content-Format, guessing not allowed
    let mediaType = req.options['Content-Format'] ? req.options['Content-Format'] : 'application/json'; // ContentSerdes.DEFAULT;

    if (requestHandler === undefined) {
      res.code = '4.04';
      res.end('Not Found');
    } else {
      if (req.method === 'GET') {
        requestHandler.onRead()
          .then(content => {
            res.code = '2.05';
            if (!content.mediaType) {
              console.warn(`CoapServer got no Media Type from '${requestUri.pathname}'`);
            } else {
              res.setOption('Content-Format', content.mediaType);
            }
            // finish
            res.end(content.body);
          })
          .catch(err => {
            console.error(`CoapServer on port ${this.getPort()}`
              + ` got internal error on read '${requestUri.pathname}': ${err.message}`);
            res.code = '5.00'; res.end(err.message);
          });
      } else if (req.method === 'PUT') {
        requestHandler.onWrite({ mediaType: mediaType, body: req.payload })
          .then(() => {
            res.code = '2.04';
            // finish with diagnostic payload
            res.end('Changed');
          })
          .catch(err => {
            console.error(`CoapServer on port ${this.getPort()}`
              + ` got internal error on write '${requestUri.pathname}': ${err.message}`);
            res.code = '5.00'; res.end(err.message);
          });
      } else if (req.method === 'POST') {
        requestHandler.onInvoke({ mediaType: mediaType, body: req.payload })
          .then(content => {
            // Actions may have a void return (no outputData)
            if (content.body === null) {
              res.code = '2.04';
            } else {
              res.code = '2.05';
              if (!content.mediaType) {
                console.warn(`CoapServer got no Media Type from '${requestUri.pathname}'`);
              } else {
                res.setOption('Content-Format', content.mediaType);
              }
            }
            // finish with whatever
            res.end(content.body);
          })
          .catch(err => {
            console.error(`CoapServer on port ${this.getPort()}`
              + ` got internal error on invoke '${requestUri.pathname}': ${err.message}`);
            res.code = '5.00'; res.end(err.message);
          });
      } else if (req.method === 'DELETE') {
        requestHandler.onUnlink()
          .then(() => {
            res.code = '2.02';
            // finish with diagnostic payload
            res.end('Deleted');
          })
          .catch(err => {
            console.error(`CoapServer on port ${this.getPort()}`
              + ` got internal error on unlink '${requestUri.pathname}': ${err.message}`);
            res.code = '5.00'; res.end(err.message);
          });
      } else {
        res.code = '4.05';
        res.end('Method Not Allowed');
      }
    }
  }
}

