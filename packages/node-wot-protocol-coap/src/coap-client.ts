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
 * CoAP client based on coap by mcollina
 */
import { ProtocolClient, Content } from 'node-wot'

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
  public setSecurity = (metadata : any) => true;

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
