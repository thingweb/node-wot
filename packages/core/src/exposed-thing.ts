/*
 * W3C Software License
 *
 * Copyright (c) 2018 the thingweb community
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

import * as WoT from "wot-typescript-definitions";

import { ThingDescription } from "@node-wot/td-tools";
import * as TD from "@node-wot/td-tools";

import Servient from "./servient";
import ConsumedThing from "./consumed-thing";
import * as TDGenerator from "./td-generator"
import * as Rest from "./resource-listeners/all-resource-listeners";
import { ResourceListener } from "./resource-listeners/protocol-interfaces";

export default class ExposedThing extends ConsumedThing implements WoT.ExposedThing {
    // these arrays and their contents are mutable
    private interactions: Array<TD.Interaction> = [];
    private interactionStates: { [key: string]: InteractionState } = {}; //TODO migrate to Map
    private restListeners: Map<string, ResourceListener> = new Map<string, ResourceListener>();

    constructor(servient: Servient, td: ThingDescription) { // name: string
        super(servient, td);
        this.addResourceListener("/" + this.td.name, new Rest.TDResourceListener(this));
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
                // TODO debug-level
                console.log(`ExposedThing '${this.td.name}' Action state of '${actionName}':`, state);

                if (state.handlers.length) {
                    let handler = state.handlers[0];
                    resolve(handler(parameter));
                } else {
                    reject(new Error("No handler for " + actionName + " on " + this.td.name));
                }
            } else {
                reject(new Error("No action " + actionName + " on " + this.td.name));
            }
        });
    }

    /**
     * Write a given property
     * @param Name of the property
     * @param newValue value to be set
     */
    public writeProperty(propertyName: string, newValue: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
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
    public readProperty(propertyName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let state = this.interactionStates[propertyName];
            if (state) {

                // TODO calls all handlers

                resolve(state.value);
            } else {
                reject(new Error("No property called " + propertyName));
            }
        });
    }

    // define how to expose and run the Thing

    /** @inheritDoc */
    register(directory: USVString): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    /** @inheritDoc */
    unregister(directory: USVString): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    /** @inheritDoc */
    start(): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    /** @inheritDoc */
    stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    /** @inheritDoc */
    public emitEvent(eventName: string, payload: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    // /**
    //  * Retrive the ExposedThing description for this object
    //  */
    // getDescription(): Object {
    //     //this is downright madness - TODO clean it up soon
    //     return JSON.parse(
    //         TD.serializeTD(
    //             TDGenerator.generateTD(this, this.srv)
    //         )
    //     )
    // }

    // updateTD(): void {
    //     this.td = TD.serializeTD(TDGenerator.generateTD(this, this.srv));
    // }

    // updateTDAndInform(): void {
    //     // TODO update TD properly
    //     // this.updateTD(); // fails!?!?!
    //     this.observablesTDChange.next(this.td);
    // }

    /** @inheritDoc */
    addProperty(property: WoT.ThingPropertyInit): ExposedThing {
        // propertyName: string, valueType: Object, initialValue?: any

        console.log(`ExposedThing '${this.td.name}' adding Property '${property.name}'`);

        // new way
        let newProp = new TD.Interaction();
        newProp.pattern = TD.InteractionPattern.Property;
        //newProp.semanticTypes = property.semanticTypes.slice(0);
        newProp.name = property.name;
        newProp.outputData = property.type;
        // TODO newProp.semanticTypes = property.semanticTypes;
        newProp.metadata = property.metadata;
        newProp.writable = property.writable;

        this.interactions.push(newProp);

        let propState = new InteractionState();
        propState.value = property.initValue; // initialValue;
        propState.handlers = [];
        if (property.onWrite) propState.handlers.push(property.onWrite);

        this.interactionStates[property.name] = propState;
        this.addResourceListener("/" + this.td.name + "/properties/" + property.name, new Rest.PropertyResourceListener(this, newProp));

        if (property.onWrite) {
            console.info("set onWrite handler for " + property.name);
            propState.handlers.push(property.onWrite);
        }

        // inform TD observers
        this.observablesTDChange.next(this.getThingDescription());

        return this;
    }

    /** @inheritDoc */
    addAction(action: WoT.ThingActionInit): ExposedThing {
        // actionName: string, inputType?: Object, outputType?: Object

        console.log(`ExposedThing '${this.td.name}' adding Action '${action.name}'`);

        // new way
        let newAction = new TD.Interaction();
        newAction.pattern = TD.InteractionPattern.Action;
        newAction.name = action.name;
        // TODO newAction.semanticTypes = action.semanticTypes;
        newAction.metadata = action.metadata;
        // inputData & outputData
        newAction.inputData = action.inputType ? action.inputType : null;
        newAction.outputData = action.outputType ? action.outputType : null;

        this.interactions.push(newAction);

        let actionState = new InteractionState();
        actionState.handlers = [];
        if(action.action) actionState.handlers.push(action.action);

        this.interactionStates[action.name] = actionState;
        this.addResourceListener("/" + this.td.name + "/actions/" + action.name, new Rest.ActionResourceListener(this, newAction));

        if(action.action) {
            console.info("set action handler for " + action.name);
            actionState.handlers.push(action.action);
        }

        // inform TD observers
        this.observablesTDChange.next(this.getThingDescription());

        return this;
    }

    /**
     * declare a new eventsource for the ExposedThing
     */
    addEvent(event: WoT.ThingEventInit): ExposedThing { 
        // eventName: string
        let newEvent = new TD.Interaction();
        newEvent.pattern = TD.InteractionPattern.Event;
        newEvent.name = event.name; //  eventName;
        // TODO newEvent.semanticTypes = event.semanticTypes;
        newEvent.metadata = event.metadata;

        this.interactions.push(newEvent);

        let eventState = new InteractionState();
        eventState.handlers = [];

        this.interactionStates[event.name] = eventState;

        // inform TD observers
        this.observablesTDChange.next(this.getThingDescription());

        return this;
    }

    /** @inheritDoc */
    removeProperty(propertyName: string): ExposedThing {
        // TODO necessary to inform observers?
        delete this.interactionStates[propertyName];
        this.removeResourceListener(this.td.name + "/properties/" + propertyName)

        // inform TD observers
        this.observablesTDChange.next(this.getThingDescription());

        return this;
    }

    /** @inheritDoc */
    removeAction(actionName: string): ExposedThing {
        delete this.interactionStates[actionName];
        this.removeResourceListener(this.td.name + "/actions/" + actionName)

        // inform TD observers
        this.observablesTDChange.next(this.getThingDescription());

        return this;
    }

    /** @inheritDoc */
    removeEvent(eventName: string): ExposedThing {
        // TODO 

        // inform TD observers
        this.observablesTDChange.next(this.getThingDescription());

        return this;
    }
}

class InteractionState {
    public value: any;
    public handlers: Array<Function> = [];
    public path: string;
}
