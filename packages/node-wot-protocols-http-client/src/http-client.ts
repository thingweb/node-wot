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
 * HTTP client based on http
 */
import logger from 'node-wot-logger';
import { ProtocolClient, Content } from 'node-wot-protocols'

import * as http from 'http';
import * as https from 'https';
import * as url from 'url';

export default class HttpClient implements ProtocolClient {

  private readonly agent: http.Agent;

  constructor(secure = false) {
    this.agent = secure ? new https.Agent({ keepAlive: true }) : new http.Agent({ keepAlive: true });
  }

  private getContentType(res : http.ClientResponse) : string {
    let header : string | string[] = res.headers['content-type']; // note: node http uses lower case here
    if(Array.isArray(header)) {
      // this should never be the case as only cookie headers are returned as array
      // but anyways...
      return (header.length > 0) ? header[0] : ""; 
    } else
    return header;
  }

  public toString(): string {
    return `[HttpClient]`;
  }

  public readResource(uri: string): Promise<Content> {
    return new Promise<Content>((resolve, reject) => {
      let options: http.RequestOptions = this.uriToOptions(uri);

      // TODO get explicit binding from TD
      options.method = 'GET';

      logger.verbose(`HttpClient sending GET to ${uri}`);
      let req = http.request(options, (res) => {
        logger.verbose(`HttpClient received ${res.statusCode} from ${uri}`);
        let mediaType: string = this.getContentType(res);
        logger.debug(`HttpClient received Content-Type: ${mediaType}`);
        logger.silly(`HttpClient received headers: ${JSON.stringify(res.headers)}`);
        let body: Array<any> = [];
        res.on('data', (data) => { body.push(data) });
        res.on('end', () => {
          resolve({ mediaType: mediaType, body: Buffer.concat(body) });
        });
      });
      req.on('error', err => reject(err));
      req.end();
    });
  }

  public writeResource(uri: string, content: Content): Promise<any> {
    return new Promise<void>((resolve, reject) => {

      let options: http.RequestOptions = this.uriToOptions(uri);

      // TODO get explicit binding from TD
      options.method = 'PUT';
      options.headers = { 'Content-Type': content.mediaType, 'Content-Length': content.body.byteLength };

      logger.verbose(`HttpClient sending PUT to ${uri}`);
      let req = http.request(options, (res) => {
        logger.verbose(`HttpClient received ${res.statusCode} from ${uri}`);
        logger.silly(`HttpClient received headers: ${JSON.stringify(res.headers)}`);
        // Although 204 without payload is expected, data must be read 
        // to complete request (http blocks socket otherwise)
        // TODO might have response on write for future HATEOAS concept
        let body: Array<any> = [];
        res.on('data', (data) => { body.push(data) });
        res.on('end', () => {
          resolve();
        });
      });
      req.on('error', err => reject(err));
      req.write(content.body);
      req.end();
    });
  }

  public invokeResource(uri: string, content?: Content): Promise<Content> {
    return new Promise<Content>((resolve, reject) => {

      let options: http.RequestOptions = this.uriToOptions(uri);

      // TODO get explicit binding from TD
      options.method = 'POST';
      if (content) {
        options.headers = { 'Content-Type': content.mediaType, 'Content-Length': content.body.byteLength };
      }
      logger.verbose(`HttpClient sending POST to ${uri}`);
      let req = http.request(options, (res) => {
        logger.verbose(`HttpClient received ${res.statusCode} from ${uri}`);
        let mediaType: string = this.getContentType(res);        
        logger.debug(`HttpClient received Content-Type: ${mediaType}`);
        logger.silly(`HttpClient received headers: ${JSON.stringify(res.headers)}`);
        let body: Array<any> = [];
        res.on('data', (data) => { body.push(data) });
        res.on('end', () => {
          resolve({ mediaType: mediaType, body: Buffer.concat(body) });
        });
      });
      req.on('error', err => reject(err));
      if (content) {
        req.write(content.body);
      }
      req.end();
    });
  }

  public unlinkResource(uri: string): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      let options: http.RequestOptions = this.uriToOptions(uri);

      // TODO get explicit binding from TD
      options.method = 'DELETE';

      logger.verbose(`HttpClient sending DELETE to ${uri}`);
      let req = http.request(options, (res) => {
        logger.verbose(`HttpClient received ${res.statusCode} from ${uri}`);
        logger.silly(`HttpClient received headers: ${JSON.stringify(res.headers)}`);
        // Although 204 without payload is expected, data must be read
        //  to complete request (http blocks socket otherwise)
        // TODO might have response on unlink for future HATEOAS concept
        let body: Array<any> = [];
        res.on('data', (data) => { body.push(data) });
        res.on('end', () => {
          resolve();
        });
      });
      req.on('error', err => reject(err));
      req.end();
    });
  }

  public start(): boolean {
    return true;
  }

  public stop(): boolean {
    this.agent.destroy();
    return true;
  }

  private uriToOptions(uri: string): http.RequestOptions {
    let requestUri = url.parse(uri);
    let options: http.RequestOptions = {};
    options.agent = this.agent;
    options.hostname = requestUri.hostname;
    options.port = parseInt(requestUri.port, 10);
    options.path = requestUri.path

    // TODO auth and headers

    return options;
  }

}
