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
 * HTTPS client Factory
 */

import { ProtocolClientFactory, ProtocolClient } from 'node-wot'
import HttpClient from './http-client';

export default class HttpsClientFactory implements ProtocolClientFactory {

  public static readonly schemes: Array<string> = ['https'];
  private clientSideProxy: any = null;

  constructor(proxy : any = null) {
    this.clientSideProxy = proxy;
  }

  public getClient(): ProtocolClient {
    // HTTPS over HTTP proxy requires HttpClient
    if (this.clientSideProxy && this.clientSideProxy.href && this.clientSideProxy.href.startsWith("http:")) {
      console.warn(`HttpsClientFactory creating client for 'http' due to insecure proxy configuration`);
      return new HttpClient(this.clientSideProxy);
    } else {
      console.log(`HttpsClientFactory creating client for '${this.getSchemes()}'`);
      return new HttpClient(this.clientSideProxy, true);
    }
  }

  public init(): boolean {
    console.info(`HttpsClientFactory for '${this.getSchemes()}' initializing`);
    return true;
  }

  public destroy(): boolean {
    console.info(`HttpsClientFactory for '${this.getSchemes()}' destroyed`);
    return true;
  }

  public getSchemes(): Array<string> {
    return HttpsClientFactory.schemes;
  }
}
