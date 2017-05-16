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
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/**
 * CoAP Server based on coap by mcollina
 */

import logger from 'node-wot-logger';
import * as url from 'url';
import ContentSerdes from 'node-wot-content-serdes';
import { ProtocolServer, ResourceListener, Content } from 'node-wot-protocols'

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
      logger.error(`CoapServer for port ${this.port} failed: ${err.message}`); this.failed = true;
    });
  }

  public getScheme(): string {
    return 'coap';
  }

  public addResource(path: string, res: ResourceListener): boolean {
    if (this.resources[path] !== undefined) {
      logger.warn(`CoapServer on port ${this.getPort()} already has ResourceListener '${path}' - skipping`);
      return false;
    } else {
      logger.debug(`CoapServer on port ${this.getPort()} addeding resource '${path}'`);
      this.resources[path] = res;
      return true;
    }
  }

  public removeResource(path: string): boolean {
    logger.debug(`CoapServer on port ${this.getPort()} removing resource '${path}'`);
    return delete this.resources[path];
  }

  public start(): boolean {
    logger.info(`CoapServer starting on ${(this.address !== undefined ? this.address + ' ' : '')}port ${this.port}`);

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
    logger.info(`CoapServer stopping on port ${this.getPort()} (running=${this.running})`);
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
    logger.verbose(`CoapServer on port ${this.getPort()} received ${req.method} ${req.url}`
      + ` from ${req.rsinfo.address} port ${req.rsinfo.port}`);
    res.on('finish', () => {
      logger.verbose(`CoapServer replied with ${res.code} to ${req.rsinfo.address} port ${req.rsinfo.port}`);
      // FIXME res.options is undefined, no other useful property to get Content-Format
      //logger.warn(`CoapServer sent Content-Format: '${res.options['Content-Format']}'`);
    });

    let requestUri = url.parse(req.url);
    let requestHandler = this.resources[requestUri.pathname];
    // TODO must be rejected with 4.15 Unsupported Content-Format, guessing not allowed
    let mediaType = req.options['Content-Format'] ? req.options['Content-Format'] : ContentSerdes.DEFAULT;

    if (requestHandler === undefined) {
      res.code = '4.04';
      res.end('Not Found');
    } else {
      if (req.method === 'GET') {
        requestHandler.onRead()
          .then(content => {
            res.code = '2.05';
            if (!content.mediaType) {
              logger.warn(`CoapServer got no Media Type from '${requestUri.pathname}'`);
            } else {
              res.setOption('Content-Format', content.mediaType);
            }
            // finish
            res.end(content.body);
          })
          .catch(err => {
            logger.error(`CoapServer on port ${this.getPort()}`
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
            logger.error(`CoapServer on port ${this.getPort()}`
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
                logger.warn(`CoapServer got no Media Type from '${requestUri.pathname}'`);
              } else {
                res.setOption('Content-Format', content.mediaType);
              }
            }
            // finish with whatever
            res.end(content.body);
          })
          .catch(err => {
            logger.error(`CoapServer on port ${this.getPort()}`
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
            logger.error(`CoapServer on port ${this.getPort()}`
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
