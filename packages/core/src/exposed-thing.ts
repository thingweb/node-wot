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
import { Subject } from "rxjs/Subject";

import * as TD from "@node-wot/td-tools";

import Servient from "./servient";
import ConsumedThing from "./consumed-thing";
import * as TDGenerator from "./td-generator"
import * as Rest from "./resource-listeners/all-resource-listeners";
import { ResourceListener } from "./resource-listeners/protocol-interfaces";
import { Content, ContentSerdes } from "./content-serdes";

export default class ExposedThing extends ConsumedThing implements TD.Thing, WoT.ConsumedThing, WoT.ExposedThing {
    private propertyStates: Map<string, PropertyState> = new Map<string, PropertyState>();
    private actionStates: Map<string, ActionState> = new Map<string, ActionState>();
    private interactionObservables: Map<string, Subject<Content>> = new Map<string, Subject<Content>>();
    private restListeners: Map<string, ResourceListener> = new Map<string, ResourceListener>();

    constructor(servient: Servient, td: WoT.ThingDescription) {
        // TODO check if extending ConsumedThing is worth the complexity
        super(servient, td);

        // create state for all initial Interactions
        for (let inter of this.interaction) {

            // reset forms in case already set via ThingModel
            inter.form = [];

            if (inter.pattern === TD.InteractionPattern.Property) {
                this.propertyStates.set(inter.name, new PropertyState());
                this.addResourceListener("/" + this.name + "/properties/" + inter.name, new Rest.PropertyResourceListener(this, inter.name));
            } else if (inter.pattern === TD.InteractionPattern.Action) {
                this.actionStates.set(inter.name, new ActionState());
                this.addResourceListener("/" + this.name + "/actions/" + inter.name, new Rest.ActionResourceListener(this, inter.name));
            } else if (inter.pattern === TD.InteractionPattern.Event) {
                // TODO connection to bindings
            } else {
                console.error(`ExposedThing '${this.name}' ignoring unknown Interaction '${inter.name}':`, inter);
            }
        }

        // expose Thing
        this.addResourceListener("/" + this.name, new Rest.TDResourceListener(this));
    }

    public getThingDescription(): WoT.ThingDescription {
        return TD.serializeTD(TDGenerator.generateTD(this, this.srv));
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
        // returns a copy -- FIXME: not a deep copy
        return this.interaction.slice(0);
    }

    /**
     * Read a given property
     * @param propertyName Name of the property
     */
    public readProperty(propertyName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let state = this.propertyStates.get(propertyName);
            if (state) {
                // call read handler (if any)
                if (state.readHandler != null) {
                    console.log(`ExposedThing '${this.name}' calls registered readHandler for property ${propertyName}`);
                    state.value = state.readHandler.call(state.that);
                } else {
                    console.log(`ExposedThing '${this.name}' reports value ${state.value} for property ${propertyName}`);
                }

                resolve(state.value);
            } else {
                reject(new Error("No property called " + propertyName));
            }
        });
    }

    /**
     * Write a given property
     * @param propertyName of the property
     * @param newValue value to be set
     */
    public writeProperty(propertyName: string, newValue: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let state = this.propertyStates.get(propertyName);
            if (state) {
                // call write handler (if any)
                if (state.writeHandler != null) {
                    console.log(`ExposedThing '${this.name}' calls registered writeHandler for property ${propertyName}`);
                    state.value = state.writeHandler.call(state.that, newValue);
                } else {
                    console.log(`ExposedThing '${this.name}' sets new value ${newValue} for property ${propertyName}`);
                    state.value = newValue;
                }

                resolve();
            } else {
                reject(new Error("No property called " + propertyName));
            }
        });
    }

    /** invokes an action on the target thing
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters
    */
    public invokeAction(actionName: string, parameter?: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let state = this.actionStates.get(actionName);
            if (state) {
                // TODO debug-level
                console.debug(`ExposedThing '${this.name}' Action state of '${actionName}':`, state);

                if (state.handler != null) {
                    let handler = state.handler;
                    resolve(handler(parameter));
                } else {
                    reject(new Error(`ExposedThing '${this.name}' has no action handler for '${actionName}'`));
                }
            } else {
                reject(new Error(`ExposedThing '${this.name}' has no Action '${actionName}'`));
            }
        });
    }

    // define how to expose and run the Thing

    /** @inheritDoc */
    register(directory?: USVString): Promise<void> {
        return new Promise<void>((resolve, reject) => {
        });
    }

    /** @inheritDoc */
    unregister(directory?: USVString): Promise<void> {
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
    public emitEvent(eventName: string, value: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.interactionObservables.get(eventName).next(ContentSerdes.get().valueToContent(value));
            resolve();
        });
    }


    /** @inheritDoc */
    addProperty(property: WoT.ThingProperty): WoT.ExposedThing {

        console.log(`ExposedThing '${this.name}' adding Property '${property.name}'`);

        // new way
        let newProp = new TD.Interaction();
        newProp.pattern = TD.InteractionPattern.Property;

        newProp.name = property.name;
        newProp.writable = property.writable;
        newProp.observable = property.observable;
        newProp.schema = JSON.parse(property.schema);

        // TODO metadata
        //action.semanticType
        //action.metadata

        this.interaction.push(newProp);

        // FIXME does it makes sense to push the state to the ResourceListener?
        let state = new PropertyState();
        if (property.value != null) {
            state.value = property.value;
            console.log(`ExposedThing '${this.name}' sets initial property '${property.name}' to '${state.value}'`);
        }
        this.propertyStates.set(newProp.name, state);
        this.addResourceListener("/" + this.name + "/properties/" + newProp.name, new Rest.PropertyResourceListener(this, newProp.name));

        // inform TD observers
        this.observablesTDChange.next(this.getThingDescription());

        return this;
    }

    /** @inheritDoc */
    addAction(action: WoT.ThingAction): WoT.ExposedThing {

        console.log(`ExposedThing '${this.name}' adding Action '${action.name}'`);

        // new way
        let newAction = new TD.Interaction();
        newAction.pattern = TD.InteractionPattern.Action;

        newAction.name = action.name;
        newAction.inputSchema = action.inputSchema ? JSON.parse(action.inputSchema) : null;
        newAction.outputSchema = action.outputSchema ? JSON.parse(action.outputSchema) : null;

        // TODO metadata
        //action.semanticType
        //action.metadata

        this.interaction.push(newAction);

        this.actionStates.set(newAction.name, new ActionState());
        this.addResourceListener("/" + this.name + "/actions/" + newAction.name, new Rest.ActionResourceListener(this, newAction.name));

        // inform TD observers
        this.observablesTDChange.next(this.getThingDescription());

        return this;
    }

    /**
     * declare a new eventsource for the ExposedThing
     */
    addEvent(event: WoT.ThingEvent): WoT.ExposedThing {
        // eventName: string
        let newEvent = new TD.Interaction();
        newEvent.pattern = TD.InteractionPattern.Event;
        newEvent.name = event.name;
        newEvent.schema = JSON.parse(event.schema);

        this.interaction.push(newEvent);

        let subject = new Subject<Content>();

        // lookup table for emitEvent()
        this.interactionObservables.set(newEvent.name, subject);
        // connection to bindings, which use ResourceListeners to subscribe/unsubscribe
        this.addResourceListener("/" + this.name + "/events/" + newEvent.name, new Rest.EventResourceListener(newEvent.name, subject));

        // inform TD observers
        this.observablesTDChange.next(this.getThingDescription());

        return this;
    }

    /** @inheritDoc */
    removeProperty(propertyName: string): WoT.ExposedThing {
        this.interactionObservables.get(propertyName).complete();
        this.interactionObservables.delete(propertyName);
        this.propertyStates.delete(propertyName);
        this.removeResourceListener(this.name + "/properties/" + propertyName);

        // inform TD observers
        this.observablesTDChange.next(this.getThingDescription());

        return this;
    }

    /** @inheritDoc */
    removeAction(actionName: string): WoT.ExposedThing {
        this.actionStates.delete(actionName);
        this.removeResourceListener(this.name + "/actions/" + actionName);

        // inform TD observers
        this.observablesTDChange.next(this.getThingDescription());

        return this;
    }

    /** @inheritDoc */
    removeEvent(eventName: string): WoT.ExposedThing {
        this.interactionObservables.get(eventName).complete();
        this.interactionObservables.delete(eventName);
        this.removeResourceListener(this.name + "/events/" + eventName);

        // inform TD observers
        this.observablesTDChange.next(this.getThingDescription());

        return this;
    }

    /** @inheritDoc */
    setActionHandler(actionName: string, action: WoT.ActionHandler): WoT.ExposedThing {
        console.log(`ExposedThing '${this.name}' setting action Handler for '${actionName}'`);
        let state = this.actionStates.get(actionName);
        if (state) {
            state.handler = action;
        } else {
            throw Error(`ExposedThing '${this.name}' cannot set action handler for unknown '${actionName}'`);
        }

        return this;
    }

    /** @inheritDoc */
    setPropertyReadHandler(propertyName: string, readHandler: WoT.PropertyReadHandler): WoT.ExposedThing {
        console.log(`ExposedThing '${this.name}' setting read handler for '${propertyName}'`);
        let state = this.propertyStates.get(propertyName);
        if (state) {
            state.readHandler = readHandler;
        } else {
            throw Error(`ExposedThing '${this.name}' cannot set read handler for unknown '${propertyName}'`);
        }
        return this;
    }

    /** @inheritDoc */
    setPropertyWriteHandler(propertyName: string, writeHandler: WoT.PropertyWriteHandler): WoT.ExposedThing {
        console.log(`ExposedThing '${this.name}' setting write handler for '${propertyName}'`);
        let state = this.propertyStates.get(propertyName);
        if (state) {
            state.writeHandler = writeHandler;
        } else {
            throw Error(`ExposedThing '${this.name}' cannot set write handler for unknown '${propertyName}'`);
        }
        return this;
    }

}

class PropertyState {
    public that: Function;
    public value: any;

    public writeHandler: Function;
    public readHandler: Function;

    constructor() {
        this.that = new Function();
        this.value = null;
        this.writeHandler = null;
        this.readHandler = null;
    }

}

class ActionState {
    public that: Function;
    public handler: Function;
    constructor() {
        this.that = new Function();
        this.handler = null;
    }
}
