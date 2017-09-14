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
var exposed_thing_1 = require("./exposed-thing");
var consumed_thing_1 = require("./consumed-thing");
var Helpers = require("node-wot-helpers");
var TDParser = require("node-wot-td-tools");
var WoTImpl = (function () {
    function WoTImpl(srv) {
        this.srv = srv;
    }
    WoTImpl.prototype.discover = function (discoveryType, filter) {
        return new Promise(function (resolve, reject) {
        });
    };
    /**
     * consume a thing description by URI and return a client representation object
     * @param uri URI of a thing description
     */
    WoTImpl.prototype.consumeDescriptionUri = function (uri) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var client = _this.srv.getClientFor(Helpers.extractScheme(uri));
            node_wot_logger_1["default"].info("WoTImpl consuming TD from " + uri + " with " + client);
            client.readResource(uri)
                .then(function (content) {
                if (content.mediaType !== "application/json")
                    node_wot_logger_1["default"].warn("WoTImpl parsing TD from '" + content.mediaType + "' media type");
                var td = TDParser.parseTDString(content.body.toString());
                var thing = new consumed_thing_1["default"](_this.srv, td);
                client.stop();
                resolve(thing);
            })["catch"](function (err) { console.error(err); });
        });
    };
    /**
     * consume a thing description from an object and return a client representation object
     *
     * @param thingDescription a thing description
     */
    WoTImpl.prototype.consumeDescription = function (thingDescription) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            node_wot_logger_1["default"].info("WoTImpl consuming TD from object");
            var td = TDParser.parseTDObject(thingDescription);
            var thing = new consumed_thing_1["default"](_this.srv, td);
            resolve(thing);
        });
    };
    /**
     * create a new Thing
     *
     * @param name name/identifier of the thing to be created
     */
    WoTImpl.prototype.createThing = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            node_wot_logger_1["default"].info("WoTImpl creating new ExposedThing '" + name + "'");
            var mything = new exposed_thing_1["default"](_this.srv, name);
            if (_this.srv.addThing(mything)) {
                resolve(mything);
            }
            else {
                reject(new Error("WoTImpl could not create Thing: " + mything));
            }
        });
    };
    /**
     * create a new Thing based on a thing description, given by a URI
     *
     * @param uri URI of a thing description to be used as "template"
     */
    WoTImpl.prototype.createFromDescriptionUri = function (uri) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var client = _this.srv.getClientFor(uri);
            node_wot_logger_1["default"].info("WoTImpl creating new ExposedThing from TD at " + uri + " with " + client);
            client.readResource(uri).then(function (content) {
                if (content.mediaType !== "application/json")
                    node_wot_logger_1["default"].warn("WoTImpl parsing TD from '" + content.mediaType + "' media type");
                var thingDescription = TDParser.parseTDString(content.body.toString()); //ThingDescription type doesnt work for some reason
                //this.createFromDescription(thingDescription);
            })["catch"](function (err) { return node_wot_logger_1["default"].error("WoTImpl failed fetching TD", err); });
        });
    };
    WoTImpl.prototype.createFromDescription = function (thingDescription) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //not necessary to parse if it is already obj
            //let thingdesc = TDParser.parseTDObject(thingDescription);
            node_wot_logger_1["default"].info("WoTImpl creating new ExposedThing from Thing Description");
            var myThing = new exposed_thing_1["default"](_this.srv, thingDescription.name);
            if (_this.srv.addThing(myThing)) {
                //add base field
                //add actions:
                //get the interactions
                //for each interaction, add it like event, action or property (first actions)
                var interactions = thingDescription.interaction;
                for (var i = 0; i < interactions.length; i++) {
                    var currentInter = interactions[i];
                    var interType = currentInter['semanticTypes'][0];
                    if (interType === 'Action') {
                        var actionName = currentInter.name;
                        try {
                            var inputType = currentInter.inputData;
                            var outputType = currentInter.outputData;
                            myThing.addAction(actionName, inputType, outputType);
                        }
                        catch (err) {
                            //it means that we couldn't find the input AND output, we'll try individual cases
                            try {
                                var inputType = currentInter.inputData;
                                myThing.addAction(actionName, inputType);
                            }
                            catch (err2) {
                                try {
                                    var outputType = currentInter.outputData;
                                    myThing.addAction(actionName, {}, outputType);
                                }
                                catch (err3) {
                                    //worst case, we just create with the name
                                    //should there be the semantics case as well?
                                    myThing.addAction(actionName);
                                }
                            }
                        }
                    }
                    else if (interType === 'Property') {
                        //maybe there should be more things added?
                        var propertyName = currentInter.name;
                        var outputType = currentInter.outputData;
                        myThing.addProperty(propertyName, outputType);
                    }
                    else if (interType === 'Event') {
                        //currently there isnt much implemented that's why I add only the name and nothing else
                        var eventName = currentInter.name;
                        myThing.addEvent(eventName);
                    }
                    else {
                        node_wot_logger_1["default"].info("Wrong interaction type for number ", i);
                    }
                }
                resolve(myThing);
            }
            else {
                reject(new Error("WoTImpl could not create Thing from object: " + myThing));
            }
        });
    };
    return WoTImpl;
}());
exports["default"] = WoTImpl;
