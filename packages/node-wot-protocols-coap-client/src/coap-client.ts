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
 * CoAP client based on coap by mcollina
 */
import { ProtocolClient, Content } from 'node-wot-protocols'

let coap = require('coap');
import * as url from 'url';

export default class CoapClient implements ProtocolClient {

  // FIXME coap Agent closes socket when no messages in flight -> new socket with every request
  private readonly agent: any = new coap.Agent();

  constructor() {
    // Intentionally blank.
  }

  public toString(): string {
    return '[CoapClient]';
  }

  public readResource(uri: string): Promise<Content> {
    return new Promise<Content>((resolve, reject) => {
      let options: CoapRequestConfig = this.uriToOptions(uri);

      // TODO get explicit binding from TD
      options.method = 'GET';

      console.info(`CoapClient sending GET to ${uri}`);
      let req = this.agent.request(options);
      req.on('response', (res: any) => {
        console.info(`CoapClient received ${res.code} from ${uri}`);
        console.log(`CoapClient received Content-Format: ${res.headers['Content-Format']}`);
        console.log(`CoapClient received headers: ${JSON.stringify(res.headers)}`);
        let mediaType = res.headers['Content-Format'];
        resolve({ mediaType: mediaType, body: res.payload });
      });
      req.on('error', (err: Error) => reject(err));
      req.end();
    });
  }

  public writeResource(uri: string, content: Content): Promise<any> {
    return new Promise<void>((resolve, reject) => {

      let options: CoapRequestConfig = this.uriToOptions(uri);

      // TODO get explicit binding from TD
      options.method = 'PUT';

      console.info(`CoapClient sending PUT to ${uri}`);
      let req = this.agent.request(options);
      req.on('response', (res: any) => {
        console.info(`CoapClient received ${res.code} from ${uri}`);
        console.log(`CoapClient received headers: ${JSON.stringify(res.headers)}`);
        resolve();
      });
      req.on('error', (err: Error) => reject(err));
      req.setOption('Content-Format', content.mediaType);
      req.write(content.body);
      req.end();
    });
  }

  public invokeResource(uri: string, content?: Content): Promise<Content> {
    return new Promise<Content>((resolve, reject) => {

      let options: CoapRequestConfig = this.uriToOptions(uri);

      // TODO get explicit binding from TD
      options.method = 'POST';

      console.info(`CoapClient sending GET to ${uri}`);
      let req = this.agent.request(options);
      req.on('response', (res: any) => {
        console.info(`CoapClient received ${res.code} from ${uri}`);
        console.log(`CoapClient received Content-Format: ${res.headers['Content-Format']}`);
        console.log(`CoapClient received headers: ${JSON.stringify(res.headers)}`);
        let mediaType = res.headers['Content-Format'];
        resolve({ mediaType: mediaType, body: res.payload });
      });
      req.on('error', (err: Error) => reject(err));
      if (content) {
        req.setOption('Content-Format', content.mediaType);
        req.write(content.body);
      }
      req.end();
    });
  }

  public unlinkResource(uri: string): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      let options: CoapRequestConfig = this.uriToOptions(uri);

      // TODO get explicit binding from TD
      options.method = 'DELETE';

      console.info(`CoapClient sending DELETE to ${uri}`);
      let req = this.agent.request(options);
      req.on('response', (res: any) => {
        console.info(`CoapClient received ${res.code} from ${uri}`);
        console.log(`CoapClient received headers: ${JSON.stringify(res.headers)}`);
        resolve();
      });
      req.on('error', (err: Error) => reject(err));
      req.end();
    });
  }

  public start(): boolean {
    return true;
  }

  public stop(): boolean {
    // FIXME coap does not provide proper API to close Agent
    return true;
  }

  private uriToOptions(uri: string): CoapRequestConfig {
    let requestUri = url.parse(uri);
    let options: CoapRequestConfig = {
      agent: this.agent,
      hostname: requestUri.hostname,
      port: parseInt(requestUri.port, 10),
      pathname: requestUri.pathname,
      query: requestUri.query,
      observe: false,
      multicast: false,
      confirmable: true
    };

    // TODO auth

    return options;
  }


}

declare interface CoapRequestConfig {
  agent?: Object,
  hostname?: string,
  port?: number,
  pathname?: string,
  query?: string,
  observe?: boolean,
  multicast?: boolean,
  confirmable?: boolean,
  method?: string
}
