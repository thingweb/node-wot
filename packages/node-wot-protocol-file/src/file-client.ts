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
 * File protocol binding
 */
import { ProtocolClientFactory, ProtocolClient, Content } from 'node-wot'

import fs = require('fs');

export class FileClientFactory implements ProtocolClientFactory {
  public static readonly schemes: Array<string> = ['file'];

  constructor(proxy? : string) { }

  public getClient(): ProtocolClient {
    return new FileClient();
  }

  public init(): boolean {
    return true;
  }

  public destroy(): boolean {
    return true;
  }

  public getSchemes(): Array<string> {
    return FileClientFactory.schemes;
  }
}

class FileClient implements ProtocolClient {

  constructor() {
    // console.log("File: new client created");
  }

  public readResource(uri: string): Promise<Content> {
    return new Promise<Content>((resolve, reject) => {
      let filepath = uri.split('//');
      let resource = fs.readFileSync(filepath[1], 'utf8');
      resolve({ mediaType: 'application/json', body: new Buffer(resource) });
    });
  }

  public writeResource(uri: string, content: Content): Promise<any> {
    return;
  }

  public invokeResource(uri: String, payload: Object): Promise<any> {
    return new Promise<Object>((resolve, reject) => {
      resolve('POST_' + uri + '_' + new Date())
    })
  }

  public unlinkResource(uri: string): Promise<any> {
    return new Promise<Object>((resolve, reject) => {
      resolve('DELETE_' + uri + '_' + new Date())
    })
  }

  public start(): boolean {
    return true;
  }

  public stop(): boolean {
    return true;
  }

  public setSecurity = (metadata : any) => false;
}
