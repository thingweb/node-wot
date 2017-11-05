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

import { JsonMember, JsonObject } from 'typedjson-npm';

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
@JsonObject()
export class ThingSecurity {
  @JsonMember({ isRequired: true, type: String })
  public mode: string;

  @JsonMember({ type: String })
  public proxy: string;
}

/**
 * Internal links information of an Interaction
 * NOTE must be declared before Interaction for TypedJSON
 */
@JsonObject()
export class InteractionLink {

  /** relativ or absulut URI path of the Interaction resource */
  @JsonMember({ isRequired: true, type: String })
  public href: string;

  /** used mediaType of the interacion resources */
  @JsonMember({ isRequired: true, type: String })
  public mediaType: string;
}

/**
 * Internal data structure for an Interaction
 * NOTE must be declared before ThingDescription for TypedJSON
 */
@JsonObject({ knownTypes: [InteractionLink] })
export class Interaction {
  /** @ type information of the Interaction */
  @JsonMember({ name: '@type', isRequired: true, elements: String })
  public semanticTypes: Array<string>;

  /** name/identifier of the Interaction */
  @JsonMember({ isRequired: true, type: String })
  public name: string;

  /** type of the Interaction (action, property, event) */
  public pattern: InteractionPattern;

  /** link information of the Interaction resources */
  @JsonMember({ isRequired: true, elements: InteractionLink })
  public link: Array<InteractionLink>;

  /** writable flag for the Property */
  @JsonMember({ type: Boolean })
  public writable: boolean;

  // TODO: how to handle types internally?
  /** JSON Schema for input */
  @JsonMember({ type: Object })
  public inputData: any;

  /** JSON Schema for output */
  @JsonMember({ type: Object })
  public outputData: any;

  constructor() {
    this.semanticTypes = [];
    this.link = [];
  }
}

/**
 * structured type representing a TD for internal usage
 * NOTE must be defined after Interaction and InteractionLink
 */
@JsonObject({ knownTypes: [Interaction] })
export default class ThingDescription {

  /** @ type information, usually 'Thing' */
  @JsonMember({ name: '@type', elements: String })
  public semanticType: Array<string>;

  /** human-readable name of the Thing */
  @JsonMember({ isRequired: true, type: String })
  public name: string;

  /** security metadata */
  @JsonMember({ type: Object })
  public security: Object;

  /** base URI of the Interaction resources */
  @JsonMember({ type: String })
  public base: string;

  /** Interactions of this Thing */
  @JsonMember({ isRequired: true, elements: Interaction })
  public interaction: Array<Interaction>;

  /** @context information of the TD */
  @JsonMember({ name: '@context', elements: String })
  private context: Array<string>;

  constructor() {
    this.context = ['http://w3c.github.io/wot/w3c-wot-td-context.jsonld'];
    this.semanticType = ['Thing'];
    this.interaction = [];
  }
}
