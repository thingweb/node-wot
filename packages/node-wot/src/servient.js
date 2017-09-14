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
var wot_impl_1 = require("./wot-impl");
var node_wot_content_serdes_1 = require("node-wot-content-serdes");
var vm = require("vm");
var Servient = (function () {
    function Servient() {
        this.servers = [];
        this.clientFactories = new Map();
        this.things = new Map();
        this.listeners = new Map();
    }
    /** runs the script in a new sandbox */
    Servient.prototype.runScript = function (code, filename) {
        if (filename === void 0) { filename = 'script'; }
        var script = new vm.Script(code);
        var context = vm.createContext({ 'WoT': new wot_impl_1["default"](this), 'console': console });
        var options = {
            "filename": filename,
            "displayErrors": true
        };
        script.runInContext(context, options);
    };
    /** runs the script in priviledged context (dangerous) - means here: scripts can require */
    Servient.prototype.runPriviledgedScript = function (code, filename) {
        if (filename === void 0) { filename = 'script'; }
        var script = new vm.Script(code);
        var context = vm.createContext({ 'WoT': new wot_impl_1["default"](this), 'console': console, 'require': require });
        var options = {
            "filename": filename,
            "displayErrors": true
        };
        script.runInContext(context, options);
    };
    /** add a new codec to support a mediatype */
    Servient.prototype.addMediaType = function (codec) {
        node_wot_content_serdes_1["default"].addCodec(codec);
    };
    /** retun all media types that this servient supports */
    Servient.prototype.getSupportedMediaTypes = function () {
        return node_wot_content_serdes_1["default"].getSupportedMediaTypes();
    };
    Servient.prototype.chooseLink = function (links) {
        // TODO add an effective way of choosing a link
        // @mkovatsc order of ClientFactories added could decide priority
        return (links.length > 0) ? links[0].href : "nope://none";
    };
    Servient.prototype.addResourceListener = function (path, resourceListener) {
        node_wot_logger_1["default"].verbose("Servient adding ResourceListener '" + path + "' of type " + resourceListener.constructor.name);
        this.listeners.set(path, resourceListener);
        this.servers.forEach(function (srv) { return srv.addResource(path, resourceListener); });
    };
    Servient.prototype.removeResourceListener = function (path) {
        node_wot_logger_1["default"].verbose("Servient removing ResourceListener '" + path + "'");
        this.listeners["delete"](path);
        this.servers.forEach(function (srv) { return srv.removeResource(path); });
    };
    Servient.prototype.addServer = function (server) {
        this.servers.push(server);
        this.listeners.forEach(function (listener, path) { return server.addResource(path, listener); });
        return true;
    };
    Servient.prototype.getServers = function () {
        return this.servers.slice(0);
    };
    Servient.prototype.addClientFactory = function (clientFactory) {
        var _this = this;
        clientFactory.getSchemes().forEach(function (scheme) { return _this.clientFactories.set(scheme, clientFactory); });
    };
    Servient.prototype.hasClientFor = function (scheme) {
        node_wot_logger_1["default"].debug("Servient checking for '" + scheme + "' scheme in " + this.clientFactories.size + " ClientFactories");
        return this.clientFactories.has(scheme);
    };
    Servient.prototype.getClientFor = function (scheme) {
        if (this.clientFactories.has(scheme)) {
            node_wot_logger_1["default"].verbose("Servient creating client for scheme '" + scheme + "'");
            return this.clientFactories.get(scheme).getClient();
        }
        else {
            // FIXME returning null was bad - Error or Promise?
            // h0ru5: caller cannot react gracefully - I'd throw Error
            throw new Error("Servient has no ClientFactory for scheme '" + scheme + "'");
        }
    };
    Servient.prototype.getClientSchemes = function () {
        return Array.from(this.clientFactories.keys());
    };
    Servient.prototype.addThingFromTD = function (thing) {
        // TODO loop through all properties and add properties
        // TODO loop through all actions and add actions
        return false;
    };
    Servient.prototype.addThing = function (thing) {
        if (!this.things.has(thing.name)) {
            this.things.set(thing.name, thing);
            return true;
        }
        else
            return false;
    };
    Servient.prototype.getThing = function (name) {
        if (this.things.has(name)) {
            return this.things.get(name);
        }
        else
            return null;
    };
    //will return WoT object
    Servient.prototype.start = function () {
        this.servers.forEach(function (server) { return server.start(); });
        // FIXME if ClientFactory has multiple schemes it is initialized multiple times
        this.clientFactories.forEach(function (clientFactory) { return clientFactory.init(); });
        // Clients are to be created / started when a ConsumedThing is created
        return new wot_impl_1["default"](this);
    };
    Servient.prototype.shutdown = function () {
        this.clientFactories.forEach(function (clientFactory) { return clientFactory.destroy(); });
        this.servers.forEach(function (server) { return server.stop(); });
    };
    return Servient;
}());
exports["default"] = Servient;
