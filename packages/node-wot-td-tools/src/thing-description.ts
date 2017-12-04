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

// import { JsonMember, JsonObject } from 'typedjson-npm';
import {Type, Expose, Exclude} from "class-transformer";
import "reflect-metadata";

/** Internet Media Types */
/*export enum MediaType {
    JSON = <any>"application/json",
    XML = <any>"application/xml",
    EXI = <any>"application/exi"

} */

/** Interaction pattern */
export enum InteractionPattern {
  Property = 'Property' as any,
  Action = 'Action' as any,
  Event = 'Event' as any
}

/**
 * Internal links information of an Interaction
 * NOTE must be declared before Interaction for TypedJSON
 */
export class ThingSecurity {
  public mode: string;

  public proxy: string;
}

/**
 * Internal links information of an Interaction
 * NOTE must be declared before Interaction for TypedJSON
 */
export class InteractionLink {

  /** relativ or absulut URI path of the Interaction resource */
  public href: string;

  /** used mediaType of the interacion resources */
  public mediaType: string;
}

/**
 * Internal data structure for an Interaction
 * NOTE must be declared before ThingDescription for TypedJSON
 */
export class Interaction {
  /** @ type information of the Interaction */
  @Expose({ name: "@type" })
  public semanticTypes: Array<string>;

  /** name/identifier of the Interaction */
  public name: string;

  /** type of the Interaction (action, property, event) */
  @Exclude()
  public pattern: InteractionPattern;

  /** link information of the Interaction resources */
  public link: Array<InteractionLink>;

  /** writable flag for the Property */
  public writable: boolean;

  // TODO: how to handle types internally?
  /** JSON Schema for input */
  public inputData: any;

  /** JSON Schema for output */
  public outputData: any;

  constructor() {
    this.semanticTypes = [];
    this.link = [];
  }
}

export class PrefixedContext {
  public prefix: string;
  public context: string;

  constructor(prefix: string, context: string) {
    this.prefix = prefix;
    this.context = context;
  }

}

/**
 * structured type representing a TD for internal usage
 * NOTE must be defined after Interaction and InteractionLink
 */
export default class ThingDescription {

  /** @ type information, usually 'Thing' */
  @Expose({ name: "@type" })
  public semanticType: Array<string>;

  /** human-readable name of the Thing */
  public name: string;

  /** security metadata */
  public security: Object;

  /** base URI of the Interaction resources */
  public base: string;

  /** Interactions of this Thing */
  @Type(() => Interaction)
  public interaction: Array<Interaction>;

  /** @context information of the TD */
  @Expose({ name: "@context" })
  private context: Array<string | object>;

  public getSimpleContexts() :  Array<string> {
    // @DAPE: Shall we cache created list?
    let contexts : Array<string> = [];
    if(this.context != null) {
      for(let cnt of this.context) {
        if(typeof cnt == "string") {
          let c : string = cnt as string;
          contexts.push(c);
        }
      }
    }
    return contexts;
  } 

  public getPrefixedContexts() :  Array<PrefixedContext> {
    // @DAPE: Shall we cache created list?
    let contexts : Array<PrefixedContext> = [];
    if(this.context != null) {
      for(let cnt of this.context) {
        if(typeof cnt == "object") {
          let c : any = cnt as any;
          let keys = Object.keys(c);
          for(let pfx of keys) {
            let v = c[pfx];
            contexts.push(new PrefixedContext(pfx, v));
          }
        }
      }
    }
    return contexts;
  } 

  constructor() {
    this.context = ['http://w3c.github.io/wot/w3c-wot-td-context.jsonld'];
    this.semanticType = ['Thing'];
    this.interaction = [];
  }
}
