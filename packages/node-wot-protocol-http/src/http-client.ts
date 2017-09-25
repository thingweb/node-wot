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
 * HTTP client based on http
 */
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

      console.log(`HttpClient sending GET to ${uri}`);
      let req = http.request(options, (res) => {
        console.log(`HttpClient received ${res.statusCode} from ${uri}`);
        let mediaType: string = this.getContentType(res);
        console.log(`HttpClient received Content-Type: ${mediaType}`);
        console.log(`HttpClient received headers: ${JSON.stringify(res.headers)}`);
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

      console.log(`HttpClient sending PUT to ${uri}`);
      let req = http.request(options, (res) => {
        console.log(`HttpClient received ${res.statusCode} from ${uri}`);
        console.log(`HttpClient received headers: ${JSON.stringify(res.headers)}`);
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
      console.log(`HttpClient sending POST to ${uri}`);
      let req = http.request(options, (res) => {
        console.log(`HttpClient received ${res.statusCode} from ${uri}`);
        let mediaType: string = this.getContentType(res);        
        console.log(`HttpClient received Content-Type: ${mediaType}`);
        console.log(`HttpClient received headers: ${JSON.stringify(res.headers)}`);
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

      console.log(`HttpClient sending DELETE to ${uri}`);
      let req = http.request(options, (res) => {
        console.log(`HttpClient received ${res.statusCode} from ${uri}`);
        console.log(`HttpClient received headers: ${JSON.stringify(res.headers)}`);
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
