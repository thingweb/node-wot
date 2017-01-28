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
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { JsonMember, JsonObject} from 'typedjson';

/** structured type representing a TD for internal usage */
export default class ThingDescription {

    @JsonMember({name : "@context",  elements: String }) /** @context information of the TD */
    private context : Array<string> = ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"]

    @JsonMember({isRequired:true, type: String}) /** Human readable name identifier of the Thing  */
    public name : string

    @JsonMember({type: String}) /** base uri of the interaction resources */
    public base : string

    @JsonMember({isRequired:true,  elements: Object })  /** interactions of this thing */
    public interactions : Array<Interaction>;

}

/**
 * Internal data structure for an interaction
 */
export class Interaction {

    @JsonMember({isRequired:true, name : "@type",  elements: String }) /** @ type information of the interaction */
    public  rdfType : Array<string>

    @JsonMember({isRequired:true, type: String})  /** name/identifier of the interaction */
    public name : string

    /** type of the interaction (action, property, event) */
    public interactionType : interactionTypeEnum

    @JsonMember({isRequired:true,  elements: Object})  /** link information of the interaction resources */
    public links : Array<InteractionLink>;

    @JsonMember({type: Boolean}) /* writable flag for the property*/
    public writable : boolean;

    //TODO: how to handle types internally?
    @JsonMember({type: String}) // json schema objects
    public inputData : any

    @JsonMember({type: String})
    public outputDate : any
}

/**
* Internal links information of an interaction
*/
export class InteractionLink {
  @JsonMember({isRequired:true, type: String})   /* relativ or absulut URI path of the interaction resource */
  public href : string

  @JsonMember({isRequired:true, type: String})   /* used mediaType of the interacion resources */
  public mediaType : mediaTypeEnum
}

/* media type selection */
export enum mediaTypeEnum {
    "application/json",
    "application/xml",
    "application/exi"
    /* TODO: add more media types here */
}

/* interaction type selection */
export enum interactionTypeEnum {
    property,
    action,
    event
}
/* simple type selection */
export enum dataTypePrimitiveEnum {
    string,
    boolean,
    number,
    array,
    object,
    null
}
