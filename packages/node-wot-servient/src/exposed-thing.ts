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

import * as proto from "node-wot-protocols"
import {ThingDescription} from "node-wot-td-parser";
import * as TD from "node-wot-td-parser";
import * as Rest from "node-wot-resource-listeners";
import Servient from "./servient";
import TDGenerator from "./td-generator"

export default class ExposedThing implements WoT.DynamicThing {
    // these arrays and their contents are mutable
    private interactions: Array<TD.Interaction> = [];
    private interactionStates: { [key: string]: InteractionState } = {}; //TODO migrate to Map
    private restListeners: Map<string, ResourceListener> = new Map<string, ResourceListener>();

    private readonly srv: Servient;

    /** name of the Thing */
    public readonly name: string

    constructor(servient: Servient, name: string) {
        this.srv = servient;
        this.name = name;
        this.addResourceListener("/" + this.name, new Rest.TDResourceListener(this));
    }

    private addResourceListener(path: string, resourceListener: ResourceListener) {
        this.restListeners.set(path, resourceListener);
        this.srv.addResourceListener(path, resourceListener);
    }

    private removeResourceListener(path: string) {
        this.restListeners.delete(path);
        this.srv.removeResourceListener(path);
    }

    public getInteractions(): Array<TD.Interaction> {
        // returns a copy
        return this.interactions.slice(0);
    }

    /** invokes an action on the target thing
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters
    */
    public invokeAction(actionName: string, parameter?: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let state = this.interactionStates[actionName];
            if (state) {
                if (state.handlers.length) {
                    let handler = state.handlers[0];
                    resolve(handler(parameter));
                } else {
                    reject(new Error("No handler for " + actionName + " on " + this.name));
                }
            } else {
                reject(new Error("No action " + actionName + " on " + this.name));
            }
        });
    }

    /**
     * Set a given property
     * @param Name of the property
     * @param newValue value to be set
     */
    public setProperty(propertyName: string, newValue: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let state = this.interactionStates[propertyName];
            if (state) {
                let oldValue = state.value;
                state.value = newValue;

                // calls all handlers
                state.handlers.forEach(handler => handler.apply(this, [newValue, oldValue]))

                resolve(newValue);
            } else {
                reject(new Error("No property called " + propertyName));
            }
        });
    }

    /**
     * Read a given property
     * @param propertyName Name of the property
     */
    public getProperty(propertyName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let state = this.interactionStates[propertyName];
            if (state) {
                resolve(state.value);
            } else {
                reject(new Error("No property called " + propertyName));
            }
        });
    }

    /**
     * Emit event to all listeners
     */
    public emitEvent(event: Event): void { }

    public addListener(eventName: string, listener: (event: Event) => void): ExposedThing {
        return this;
    }

    public removeListener(eventName: string, listener: (event: Event) => void): ExposedThing {
        return this;
    }

    removeAllListeners(eventName: string): ExposedThing {
        return this;
    }

    /**
     * register a handler for an action
     * @param actionName Name of the action
     * @param cb callback to be called when the action gets invoked, optionally is supplied a parameter
     */
    onInvokeAction(actionName: string, cb: (param?: any) => any): ExposedThing {
        let state = this.interactionStates[actionName];
        if (state) {
            if (state.handlers.length > 0) state.handlers.splice(0);
            state.handlers.push(cb);
        }

        return this;
    }

    /**
     * register a handler for value updates on the property
     * @param propertyName Name of the property
     * @param cb callback to be called when value changes; signature (newValue,oldValue)
     */
    onUpdateProperty(propertyName: string, cb: (newValue: any, oldValue?: any) => void): ExposedThing {
        let state = this.interactionStates[propertyName];
        if (state) {
            state.handlers.push(cb);
        } else {
            console.error("no such property " + propertyName + " on " + this.name);
        }

        return this;
    }

    /**
     * Retrive the ExposedThing description for this object
     */
    getDescription(): Object {
        //this is downright madness - TODO clean it up soon
        return JSON.parse(
            TD.serializeTD(
                TDGenerator.generateTD(this, this.srv)
            )
        )
    }

    /**
     * declare a new property for the ExposedThing
     * @param propertyName Name of the property
     * @param valueType type specification of the value (JSON schema)
     */
    addProperty(propertyName: string, valueType: Object, initialValue?: any): ExposedThing {
        // new way
        let newProp = new TD.Interaction();
        newProp.pattern = TD.InteractionPattern.Property;
        newProp.name = propertyName;
        newProp.inputData = { 'valueType' : valueType};
        newProp.outputData =  { 'valueType' : valueType};
        newProp.writable = true; //we need a param for this

        this.interactions.push(newProp);

        let propState = new InteractionState();
        propState.value = initialValue;
        propState.handlers = [];

        this.interactionStates[propertyName] = propState;

        this.addResourceListener("/" + this.name + "/properties/" + propertyName, new Rest.PropertyResourceListener(this, newProp));

        return this;
    }

    /**
     * declare a new action for the ExposedThing
     * @param actionName Name of the action
     * @param inputType type specification of the parameter (optional, JSON schema)
     * @param outputType type specification of the return value (optional, JSON schema)
     */
    addAction(actionName: string, inputType?: Object, outputType?: Object): ExposedThing {
        // new way
        let newAction = new TD.Interaction();
        newAction.pattern = TD.InteractionPattern.Action;
        newAction.name = actionName;
        newAction.inputData = inputType ? { 'valueType' : inputType} : null;
        newAction.outputData = outputType ? { 'valueType' : outputType} : null;

        this.interactions.push(newAction);

        let actionState = new InteractionState();
        actionState.handlers = [];

        this.interactionStates[actionName] = actionState;

        this.addResourceListener("/" + this.name + "/actions/" + actionName, new Rest.ActionResourceListener(this, newAction));

        return this;
    }

    /**
     * declare a new eventsource for the ExposedThing
     */
    addEvent(eventName: string): ExposedThing { return this; }

    /**
     * remove a property from the ExposedThing
     */
    removeProperty(propertyName: string): boolean {
        delete this.interactionStates[propertyName];
        this.removeResourceListener(this.name + "/properties/" + propertyName)
        return true;
    }

    /**
     * remove an action from the ExposedThing
     */
    removeAction(actionName: string): boolean {
        delete this.interactionStates[actionName];
        this.removeResourceListener(this.name + "/actions/" + actionName)
        return true
    }

    /**
     * remove an event from the thing
     */
    removeEvent(eventName: string): boolean { return false }
}

class InteractionState {
    public value: any;
    public handlers: Array<(param?: any) => any> = [];
    public path: string;
}
