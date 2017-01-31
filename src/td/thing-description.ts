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

import { JsonMember, JsonObject } from "typedjson";

/** Internet Media Types */
export enum MediaType {
    JSON = <any>"application/json",
    XML = <any>"application/xml",
    EXI = <any>"application/exi"
    /* TODO: add more media types here */
}

/** Interaction pattern */
export enum InteractionPattern {
    Property = <any>"Property",
    Action = <any>"Action",
    Event = <any>"Event"
}

/**
 * Internal links information of an Interaction
 * NOTE must be declared before Interaction for TypedJSON
 */
@JsonObject()
export class InteractionLink {

    /** relativ or absulut URI path of the Interaction resource */
    @JsonMember({ isRequired: true, type: String })
    public href : string;

    /** used mediaType of the interacion resources */
    @JsonMember({ isRequired: true, type: String })
    public mediaType : MediaType;
}

/**
 * Internal data structure for an Interaction
 * NOTE must be declared before ThingDescription for TypedJSON
 */
@JsonObject({ knownTypes: [InteractionLink] })
export class Interaction {
    /** @ type information of the Interaction */
    @JsonMember({ name: "@type", isRequired: true, elements: String })
    public semanticTypes : Array<string>;

    /** name/identifier of the Interaction */
    @JsonMember({ isRequired: true, type: String })
    public name : string;

    /** type of the Interaction (action, property, event) */
    public pattern : InteractionPattern;

    /** link information of the Interaction resources */
    @JsonMember({ isRequired: true,  elements: InteractionLink })
    public links : Array<InteractionLink>;

    /** writable flag for the Property */
    @JsonMember({ type: Boolean })
    public writable : boolean;

    //TODO: how to handle types internally?
    /** JSON Schema for input */
    @JsonMember({ type: Object })
    public inputData : any;

    /** JSON Schema for output */
    @JsonMember({ type: Object })
    public outputData : any;

    constructor() {
        this.semanticTypes = [];
        this.links = [];
    }
}

/**
 * structured type representing a TD for internal usage
 * NOTE must be defined after Interaction and InteractionLink
 */
@JsonObject({ knownTypes: [Interaction] })
export default class ThingDescription {

    /** @context information of the TD */
    @JsonMember({ name: "@context", elements: String })
    private context : Array<string>;

    /** @ type information, usually 'Thing' */
    @JsonMember({ name: "@type", type: String })
    public semanticType : string;

    /** human-readable name of the Thing */
    @JsonMember({ isRequired: true, type: String })
    public name : string;

    /** base URI of the Interaction resources */
    @JsonMember({ type: String })
    public base : string;

    /** Interactions of this Thing */
    @JsonMember({ isRequired: true, elements: Interaction })
    public interactions : Array<Interaction>;

    constructor() {
        this.context = ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"];
        this.semanticType = "Thing";
        this.interactions = [];
    }
}
