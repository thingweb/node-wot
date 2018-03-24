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
 * File protocol binding
 */
import { InteractionForm } from "@node-wot/td-tools";
import { ProtocolClient, Content } from "@node-wot/core"
import fs = require('fs');
import path = require('path');

export default class FileClient implements ProtocolClient {

  constructor() { }

  public toString() {
    return "[FileClient]";
  }

  public readResource(form: InteractionForm): Promise<Content> {
    return new Promise<Content>((resolve, reject) => {
      let filepath = form.href.split('//');
      let resource = fs.readFileSync(filepath[1], 'utf8');
      let extension = path.extname(filepath[1]);
      console.debug(`FileClient found '${extension}' extension`);
      let mediaType = "application/octet-stream";
      switch (extension) {
        case ".txt":
        case ".log":
        case ".ini":
        case ".cfg":
          mediaType = "text/plain";
          break;
        case ".json":
          mediaType = "application/json";
          break;
        case ".jsonld":
          mediaType = "application/ld+json";
          break;
        default:
          console.warn(`FileClient cannot determine media type of '${form.href}'`);
      }
      resolve({ mediaType: mediaType, body: new Buffer(resource) });
    });
  }

  public writeResource(form: InteractionForm, content: Content): Promise<any> {
    return;
  }

  public invokeResource(form: InteractionForm, payload: Object): Promise<any> {
    return new Promise<Object>((resolve, reject) => {
      resolve('FileClient POST_' + form.href + '_' + new Date())
    })
  }

  public unlinkResource(form: InteractionForm): Promise<any> {
    return new Promise<Object>((resolve, reject) => {
      resolve('FileClient DELETE_' + form.href + '_' + new Date())
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
