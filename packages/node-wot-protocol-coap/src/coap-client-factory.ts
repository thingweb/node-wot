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
 * CoAP client Factory
 */

import { ProtocolClientFactory, ProtocolClient } from 'node-wot'
import CoapClient from './coap-client';

export default class CoapClientFactory implements ProtocolClientFactory {

  public static readonly schemes: Array<string> = ['coap'];

  constructor(proxy? : string) { }

  public getClient(): ProtocolClient {
    console.log(`CoapClientFactory creating client for '${this.getSchemes()}'`);
    return new CoapClient();
  }

  public init(): boolean {
    console.info(`CoapClientFactory for '${this.getSchemes()}' initializing`);
    return true;
  }

  public destroy(): boolean {
    console.info(`CoapClientFactory for '${this.getSchemes()}' destroyed`);
    return true;
  }

  public getSchemes(): Array<string> {
    return CoapClientFactory.schemes;
  }
}
