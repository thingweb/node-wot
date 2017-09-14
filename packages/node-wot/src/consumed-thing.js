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
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
exports.__esModule = true;
var node_wot_logger_1 = require("node-wot-logger");
var TD = require("node-wot-td-tools");
var Helpers = require("node-wot-helpers");
var node_wot_content_serdes_1 = require("node-wot-content-serdes");
var ConsumedThing = (function () {
    function ConsumedThing(servient, td) {
        this.clients = new Map();
        this.srv = servient;
        this.name = td.name;
        this.td = td;
        node_wot_logger_1["default"].info("ConsumedThing '" + this.name + "' created");
    }
    // lazy singleton for ProtocolClient per scheme
    ConsumedThing.prototype.getClientFor = function (links) {
        var _this = this;
        if (links.length === 0) {
            throw new Error("ConsumedThing '${this.name}' has no links for this interaction");
        }
        var schemes = links.map(function (link) { return Helpers.extractScheme(link.href); });
        var cacheIdx = schemes.findIndex(function (scheme) { return _this.clients.has(scheme); });
        if (cacheIdx !== -1) {
            node_wot_logger_1["default"].debug("ConsumedThing '" + this.name + "' chose cached client for '" + schemes[cacheIdx] + "'");
            var client = this.clients.get(schemes[cacheIdx]);
            var link = links[cacheIdx];
            return { client: client, link: link };
        }
        else {
            node_wot_logger_1["default"].silly("ConsumedThing '" + this.name + "' has no client in cache (" + cacheIdx + ")");
            var srvIdx = schemes.findIndex(function (scheme) { return _this.srv.hasClientFor(scheme); });
            if (srvIdx === -1)
                throw new Error("ConsumedThing '" + this.name + "' missing ClientFactory for '" + schemes + "'");
            node_wot_logger_1["default"].silly("ConsumedThing '" + this.name + "' chose protocol '" + schemes[srvIdx] + "'");
            var client = this.srv.getClientFor(schemes[srvIdx]);
            if (client) {
                node_wot_logger_1["default"].debug("ConsumedThing '" + this.name + "' got new client for '" + schemes[srvIdx] + "'");
                this.clients.set(schemes[srvIdx], client);
                var link = links[srvIdx];
                return { client: client, link: link };
            }
            else {
                throw new Error("ConsumedThing '" + this.name + "' could not get client for '" + schemes[srvIdx] + "'");
            }
        }
    };
    ConsumedThing.prototype.findInteraction = function (name, type) {
        var res = this.td.interaction.filter(function (ia) { return ia.pattern === type && ia.name === name; });
        return (res.length > 0) ? res[0] : null;
    };
    /**
     * Read a given property
     * @param propertyName Name of the property
     */
    ConsumedThing.prototype.getProperty = function (propertyName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var property = _this.findInteraction(propertyName, TD.InteractionPattern.Property);
            if (!property) {
                reject(new Error("ConsumedThing '" + _this.name + "' cannot find Property '" + propertyName + "'"));
            }
            else {
                var _a = _this.getClientFor(property.link), client = _a.client, link_1 = _a.link;
                if (!client) {
                    reject(new Error("ConsumedThing '" + _this.name + "' did not get suitable client for " + link_1.href));
                }
                else {
                    node_wot_logger_1["default"].info("ConsumedThing '" + _this.name + "' getting " + link_1.href);
                    client.readResource(link_1.href).then(function (content) {
                        if (!content.mediaType)
                            content.mediaType = link_1.mediaType;
                        node_wot_logger_1["default"].verbose("ConsumedThing decoding '" + content.mediaType + "' in readProperty");
                        var value = node_wot_content_serdes_1["default"].bytesToValue(content);
                        resolve(value);
                    });
                }
            }
        });
    };
    /**
     * Set a given property
     * @param Name of the property
     * @param newValue value to be set
     */
    ConsumedThing.prototype.setProperty = function (propertyName, newValue) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var property = _this.findInteraction(propertyName, TD.InteractionPattern.Property);
            if (!property) {
                reject(new Error("ConsumedThing '" + _this.name + "' cannot find Property '" + propertyName + "'"));
            }
            else {
                var _a = _this.getClientFor(property.link), client = _a.client, link = _a.link;
                if (!client) {
                    reject(new Error("ConsumedThing '" + _this.name + "' did not get suitable client for " + link.href));
                }
                else {
                    node_wot_logger_1["default"].info("ConsumedThing '" + _this.name + "' setting " + link.href + " to '" + newValue + "'");
                    var payload = node_wot_content_serdes_1["default"].valueToBytes(newValue, link.mediaType);
                    resolve(client.writeResource(link.href, payload));
                }
            }
        });
    };
    /** invokes an action on the target thing
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters
    */
    ConsumedThing.prototype.invokeAction = function (actionName, parameter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var action = _this.findInteraction(actionName, TD.InteractionPattern.Action);
            if (!action) {
                reject(new Error("ConsumedThing '" + _this.name + "' cannot find Action '" + actionName + "'"));
            }
            else {
                var _a = _this.getClientFor(action.link), client = _a.client, link_2 = _a.link;
                if (!client) {
                    reject(new Error("ConsumedThing '" + _this.name + "' did not get suitable client for " + link_2.href));
                }
                else {
                    node_wot_logger_1["default"].info("ConsumedThing '" + _this.name + "' invoking " + link_2.href + " with '" + parameter + "'");
                    // TODO #5 client expects Buffer; ConsumedThing would have the necessary TD valueType rule...
                    var mediaType = link_2.mediaType;
                    var input = node_wot_content_serdes_1["default"].valueToBytes(parameter, link_2.mediaType.toString());
                    client.invokeResource(link_2.href, input).then(function (output) {
                        if (!output.mediaType)
                            output.mediaType = link_2.mediaType;
                        node_wot_logger_1["default"].verbose("ConsumedThing decoding '" + output.mediaType + "' in invokeAction");
                        var value = node_wot_content_serdes_1["default"].bytesToValue(output);
                        resolve(value);
                    });
                }
            }
        });
    };
    ConsumedThing.prototype.addListener = function (eventName, listener) { return this; };
    ConsumedThing.prototype.removeListener = function (eventName, listener) { return this; };
    ConsumedThing.prototype.removeAllListeners = function (eventName) { return this; };
    /**
     * Retrive the thing description for this object
     */
    ConsumedThing.prototype.getDescription = function () {
        return this.td;
    };
    return ConsumedThing;
}());
exports["default"] = ConsumedThing;
