"use strict";
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
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typedjson_npm_1 = require("typedjson-npm");
/** Internet Media Types */
/*export enum MediaType {
    JSON = <any>"application/json",
    XML = <any>"application/xml",
    EXI = <any>"application/exi"

} */
/** Interaction pattern */
var InteractionPattern;
(function (InteractionPattern) {
    InteractionPattern[InteractionPattern["Property"] = 'Property'] = "Property";
    InteractionPattern[InteractionPattern["Action"] = 'Action'] = "Action";
    InteractionPattern[InteractionPattern["Event"] = 'Event'] = "Event";
})(InteractionPattern = exports.InteractionPattern || (exports.InteractionPattern = {}));
/**
 * Internal links information of an Interaction
 * NOTE must be declared before Interaction for TypedJSON
 */
var InteractionLink = (function () {
    function InteractionLink() {
    }
    __decorate([
        typedjson_npm_1.JsonMember({ isRequired: true, type: String })
    ], InteractionLink.prototype, "href");
    __decorate([
        typedjson_npm_1.JsonMember({ isRequired: true, type: String })
    ], InteractionLink.prototype, "mediaType");
    InteractionLink = __decorate([
        typedjson_npm_1.JsonObject()
    ], InteractionLink);
    return InteractionLink;
}());
exports.InteractionLink = InteractionLink;
/**
 * Internal data structure for an Interaction
 * NOTE must be declared before ThingDescription for TypedJSON
 */
var Interaction = (function () {
    function Interaction() {
        this.semanticTypes = [];
        this.link = [];
    }
    __decorate([
        typedjson_npm_1.JsonMember({ name: '@type', isRequired: true, elements: String })
    ], Interaction.prototype, "semanticTypes");
    __decorate([
        typedjson_npm_1.JsonMember({ isRequired: true, type: String })
    ], Interaction.prototype, "name");
    __decorate([
        typedjson_npm_1.JsonMember({ isRequired: true, elements: InteractionLink })
    ], Interaction.prototype, "link");
    __decorate([
        typedjson_npm_1.JsonMember({ type: Boolean })
    ], Interaction.prototype, "writable");
    __decorate([
        typedjson_npm_1.JsonMember({ type: Object })
    ], Interaction.prototype, "inputData");
    __decorate([
        typedjson_npm_1.JsonMember({ type: Object })
    ], Interaction.prototype, "outputData");
    Interaction = __decorate([
        typedjson_npm_1.JsonObject({ knownTypes: [InteractionLink] })
    ], Interaction);
    return Interaction;
}());
exports.Interaction = Interaction;
/**
 * structured type representing a TD for internal usage
 * NOTE must be defined after Interaction and InteractionLink
 */
var ThingDescription = (function () {
    function ThingDescription() {
        this.context = ['http://w3c.github.io/wot/w3c-wot-td-context.jsonld'];
        this.semanticType = ['Thing'];
        this.interaction = [];
    }
    __decorate([
        typedjson_npm_1.JsonMember({ name: '@type', elements: String })
    ], ThingDescription.prototype, "semanticType");
    __decorate([
        typedjson_npm_1.JsonMember({ isRequired: true, type: String })
    ], ThingDescription.prototype, "name");
    __decorate([
        typedjson_npm_1.JsonMember({ type: String })
    ], ThingDescription.prototype, "base");
    __decorate([
        typedjson_npm_1.JsonMember({ isRequired: true, elements: Interaction })
    ], ThingDescription.prototype, "interaction");
    __decorate([
        typedjson_npm_1.JsonMember({ name: '@context', elements: String })
    ], ThingDescription.prototype, "context");
    ThingDescription = __decorate([
        typedjson_npm_1.JsonObject({ knownTypes: [Interaction] })
    ], ThingDescription);
    return ThingDescription;
}());
exports["default"] = ThingDescription;
