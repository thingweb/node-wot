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

import * as WoT from 'wot-typescript-definitions';

export default class ThingPropertyInitImpl implements WoT.ThingPropertyInit {
  name: string
  configurable: boolean; // = false;
  enumerable: boolean; // = true;
  writable: boolean; // = true;
  semanticTypes: [WoT.SemanticType];
  description: WoT.ThingDescription;
  value: any;

  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
    this.configurable = false;
    this.enumerable = true;
    this.writable = true;
  }

  public setWritable(writable: boolean) : void {
    this.writable = writable;
  }
}