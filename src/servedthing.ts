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

import * as TDParser from './td/tdparser'
import * as TD from './td/thingdescription'
import ThingDescription from './td/thingdescription'
import Servient from './servient'

export default class ServedThing implements WoT.DynamicThing {
    // these arrays and their contents are mutable
    private interactions: Array<TD.TDInteraction> = [];
    private interactionStates: { [key: string]: InteractionState } = {};

    private readonly srv: Servient;

    /** name of the Thing */
    public readonly name: string

    constructor(servient: Servient, name: string) {
        this.srv = servient;
        this.name = name;
    }

    public getInteractions() {
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
                state.handlers.forEach(handler => handler.apply(this,[newValue,oldValue]))

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

    public addListener(eventName: string, listener: (event: Event) => void): ServedThing {
        return this;
    }

    public removeListener(eventName: string, listener: (event: Event) => void): ServedThing {
        return this;
    }

    removeAllListeners(eventName: string): ServedThing {
        return this;
    }


    /**
     * register a handler for an action
     * @param actionName Name of the action
     * @param cb callback to be called when the action gets invoked, optionally is supplied a parameter
     */
    onInvokeAction(actionName: string, cb: (param?: any) => any): ServedThing {
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
    onUpdateProperty(propertyName: string, cb: (newValue: any, oldValue?: any) => void): ServedThing {
        let state = this.interactionStates[propertyName];
        if (state) {
            state.handlers.push(cb);
        } else {
            console.error("no such property " + propertyName + " on " + this.name);
        }

        return this;
    }

    /**
     * Retrive the ServedThing description for this object
     */
    getDescription(): Object {
        return TDParser.generateTD(this, this.srv)
    }

    /**
     * declare a new property for the ServedThing
     * @param propertyName Name of the property
     * @param valueType type specification of the value (JSON schema)
     */
    addProperty(propertyName: string, valueType: Object, initialValue?: any): ServedThing {
        // new way
        let newProp = new TD.TDInteraction();
        newProp.interactionType = TD.interactionTypeEnum.property;
        newProp.name = propertyName;
        newProp.inputData = valueType;
        newProp.outputDate = valueType;
        newProp.writable = true; //we need a param for this

        this.interactions.push(newProp);

        let propState = new InteractionState();
        propState.value = initialValue;
        propState.path = "properties/" + propertyName;
        propState.handlers = [];

        this.interactionStates[propertyName] = propState;

        return this;
    }

    /**
     * declare a new action for the ServedThing
     * @param actionName Name of the action
     * @param inputType type specification of the parameter (optional, JSON schema)
     * @param outputType type specification of the return value (optional, JSON schema)
     */
    addAction(actionName: string, inputType?: Object, outputType?: Object): ServedThing {
        // new way
        let newAction = new TD.TDInteraction();
        newAction.interactionType = TD.interactionTypeEnum.property;
        newAction.name = actionName;
        newAction.inputData = inputType;
        newAction.outputDate = outputType;

        this.interactions.push(newAction);

        let actionState = new InteractionState();
        actionState.path = "actions/" + actionName;
        actionState.handlers = [];

        this.interactionStates[actionName] = actionState;

        return this;
    }

    /**
     * declare a new eventsource for the ServedThing
     */
    addEvent(eventName: string): ServedThing { return this; }

    /**
     * remove a property from the ServedThing
     */
    removeProperty(propertyName: string): boolean {
        delete this.interactionStates[propertyName];
        return false;
    }

    /**
     * remove an action from the ServedThing
     */
    removeAction(actionName: string): boolean {
        delete this.interactionStates[actionName];
        return false
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
