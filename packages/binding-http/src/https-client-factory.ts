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
 * HTTPS client Factory
 */

import { ProtocolClientFactory, ProtocolClient } from "@node-wot/core"
import HttpClient from "./http-client";

export class HttpConfig {
  public proxy?: HttpProxyConfig;
  public allowSelfSigned: boolean;
}
export class HttpProxyConfig {
  public href: USVString;
  public authorization: string;
  public token: string;
  public username: string;
  public password: string;
}

export default class HttpsClientFactory implements ProtocolClientFactory {

  public readonly scheme: string = "https";
  private config: HttpConfig = null;

  constructor(config: HttpConfig = null) {
    this.config = config;
  }

  public getClient(): ProtocolClient {
    // HTTPS over HTTP proxy requires HttpClient
    if (this.config.proxy && this.config.proxy.href && this.config.proxy.href.startsWith("http:")) {
      console.warn(`HttpsClientFactory creating client for 'http' due to insecure proxy configuration`);
      return new HttpClient(this.config);
    } else {
      console.log(`HttpsClientFactory creating client for '${this.scheme}'`);
      return new HttpClient(this.config, true);
    }
  }

  public init(): boolean {
    // console.info(`HttpsClientFactory for '${HttpsClientFactory.scheme}' initializing`);
    // TODO uncomment info if something is executed here
    return true;
  }

  public destroy(): boolean {
    // console.info(`HttpsClientFactory for '${HttpsClientFactory.scheme}' destroyed`);
    // TODO uncomment info if something is executed here
    return true;
  }
}
