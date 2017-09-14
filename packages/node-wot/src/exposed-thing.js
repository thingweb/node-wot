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
var TD = require("node-wot-td-tools");
var Rest = require("./resource-listeners/all-resource-listeners");
var TDGenerator = require("./td-generator");
var ExposedThing = (function () {
    function ExposedThing(servient, name) {
        // these arrays and their contents are mutable
        this.interactions = [];
        this.interactionStates = {}; //TODO migrate to Map
        this.restListeners = new Map();
        this.srv = servient;
        this.name = name;
        this.addResourceListener("/" + this.name, new Rest.TDResourceListener(this));
    }
    ExposedThing.prototype.addResourceListener = function (path, resourceListener) {
        this.restListeners.set(path, resourceListener);
        this.srv.addResourceListener(path, resourceListener);
    };
    ExposedThing.prototype.removeResourceListener = function (path) {
        this.restListeners["delete"](path);
        this.srv.removeResourceListener(path);
    };
    ExposedThing.prototype.getInteractions = function () {
        // returns a copy
        return this.interactions.slice(0);
    };
    /** invokes an action on the target thing
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters
    */
    ExposedThing.prototype.invokeAction = function (actionName, parameter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var state = _this.interactionStates[actionName];
            if (state) {
                if (state.handlers.length) {
                    var handler = state.handlers[0];
                    resolve(handler(parameter));
                }
                else {
                    reject(new Error("No handler for " + actionName + " on " + _this.name));
                }
            }
            else {
                reject(new Error("No action " + actionName + " on " + _this.name));
            }
        });
    };
    /**
     * Set a given property
     * @param Name of the property
     * @param newValue value to be set
     */
    ExposedThing.prototype.setProperty = function (propertyName, newValue) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var state = _this.interactionStates[propertyName];
            if (state) {
                var oldValue_1 = state.value;
                state.value = newValue;
                // calls all handlers
                state.handlers.forEach(function (handler) { return handler.apply(_this, [newValue, oldValue_1]); });
                resolve(newValue);
            }
            else {
                reject(new Error("No property called " + propertyName));
            }
        });
    };
    /**
     * Read a given property
     * @param propertyName Name of the property
     */
    ExposedThing.prototype.getProperty = function (propertyName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var state = _this.interactionStates[propertyName];
            if (state) {
                resolve(state.value);
            }
            else {
                reject(new Error("No property called " + propertyName));
            }
        });
    };
    /**
     * Emit event to all listeners
     */
    ExposedThing.prototype.emitEvent = function (event) { };
    ExposedThing.prototype.addListener = function (eventName, listener) {
        return this;
    };
    ExposedThing.prototype.removeListener = function (eventName, listener) {
        return this;
    };
    ExposedThing.prototype.removeAllListeners = function (eventName) {
        return this;
    };
    /**
     * register a handler for an action
     * @param actionName Name of the action
     * @param cb callback to be called when the action gets invoked, optionally is supplied a parameter
     */
    ExposedThing.prototype.onInvokeAction = function (actionName, cb) {
        var state = this.interactionStates[actionName];
        if (state) {
            if (state.handlers.length > 0)
                state.handlers.splice(0);
            state.handlers.push(cb);
        }
        return this;
    };
    /**
     * register a handler for value updates on the property
     * @param propertyName Name of the property
     * @param cb callback to be called when value changes; signature (newValue,oldValue)
     */
    ExposedThing.prototype.onUpdateProperty = function (propertyName, cb) {
        var state = this.interactionStates[propertyName];
        if (state) {
            state.handlers.push(cb);
        }
        else {
            console.error("no such property " + propertyName + " on " + this.name);
        }
        return this;
    };
    /**
     * Retrive the ExposedThing description for this object
     */
    ExposedThing.prototype.getDescription = function () {
        //this is downright madness - TODO clean it up soon
        return JSON.parse(TD.serializeTD(TDGenerator.generateTD(this, this.srv)));
    };
    /**
     * declare a new property for the ExposedThing
     * @param propertyName Name of the property
     * @param valueType type specification of the value (JSON schema)
     */
    ExposedThing.prototype.addProperty = function (propertyName, outputType, initialValue) {
        // new way
        var newProp = new TD.Interaction();
        newProp.pattern = TD.InteractionPattern.Property;
        newProp.name = propertyName;
        //  newProp.inputData = { 'valueType' : valueType};
        // newProp.outputData =  { 'valueType' : valueType};
        newProp.outputData = outputType;
        newProp.writable = true; //we need a param for this
        this.interactions.push(newProp);
        var propState = new InteractionState();
        propState.value = initialValue;
        propState.handlers = [];
        this.interactionStates[propertyName] = propState;
        this.addResourceListener("/" + this.name + "/properties/" + propertyName, new Rest.PropertyResourceListener(this, newProp));
        return this;
    };
    /**
     * declare a new action for the ExposedThing
     * @param actionName Name of the action
     * @param inputType type specification of the parameter (optional, JSON schema)
     * @param outputType type specification of the return value (optional, JSON schema)
     */
    ExposedThing.prototype.addAction = function (actionName, inputType, outputType) {
        // new way
        var newAction = new TD.Interaction();
        newAction.pattern = TD.InteractionPattern.Action;
        newAction.name = actionName;
        /*newAction.inputData = inputType ? { 'valueType' : inputType} : null;
        newAction.outputData = outputType ? { 'valueType' : outputType} : null;
*/
        newAction.inputData = inputType ? inputType : null;
        newAction.outputData = outputType ? outputType : null;
        this.interactions.push(newAction);
        var actionState = new InteractionState();
        actionState.handlers = [];
        this.interactionStates[actionName] = actionState;
        this.addResourceListener("/" + this.name + "/actions/" + actionName, new Rest.ActionResourceListener(this, newAction));
        return this;
    };
    /**
     * declare a new eventsource for the ExposedThing
     */
    ExposedThing.prototype.addEvent = function (eventName) {
        var newEvent = new TD.Interaction();
        newEvent.pattern = TD.InteractionPattern.Event;
        newEvent.name = eventName;
        this.interactions.push(newEvent);
        var eventState = new InteractionState();
        eventState.handlers = [];
        this.interactionStates[eventName] = eventState;
        return this;
    };
    /**
     * remove a property from the ExposedThing
     */
    ExposedThing.prototype.removeProperty = function (propertyName) {
        delete this.interactionStates[propertyName];
        this.removeResourceListener(this.name + "/properties/" + propertyName);
        return true;
    };
    /**
     * remove an action from the ExposedThing
     */
    ExposedThing.prototype.removeAction = function (actionName) {
        delete this.interactionStates[actionName];
        this.removeResourceListener(this.name + "/actions/" + actionName);
        return true;
    };
    /**
     * remove an event from the thing
     */
    ExposedThing.prototype.removeEvent = function (eventName) { return false; };
    return ExposedThing;
}());
exports["default"] = ExposedThing;
var InteractionState = (function () {
    function InteractionState() {
        this.handlers = [];
    }
    return InteractionState;
}());
