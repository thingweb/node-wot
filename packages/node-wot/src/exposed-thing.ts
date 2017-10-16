/*
 * W3C Software License
 *
 * Copyright (c) 2017 the thingweb community
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

import {ResourceListener} from "./resource-listeners/protocol-interfaces"
import {ThingDescription} from "node-wot-td-tools";
import ConsumedThing from "./consumed-thing";
import * as TD from "node-wot-td-tools";
import * as Rest from "./resource-listeners/all-resource-listeners"
import Servient from "./servient";
import * as TDGenerator from "./td-generator"

export default class ExposedThing extends ConsumedThing implements WoT.ExposedThing {
    // these arrays and their contents are mutable
    private interactions: Array<TD.Interaction> = [];
    private interactionStates: { [key: string]: InteractionState } = {}; //TODO migrate to Map
    private restListeners: Map<string, ResourceListener> = new Map<string, ResourceListener>();

    // private readonly srv: Servient;

    /** name of the Thing */
    // public readonly name: string

    // readonly url: USVString;

    // readonly description: WoT.ThingDescription;

    constructor(servient: Servient, td: ThingDescription) { // name: string
        super(servient, td);
        // this.srv = servient;
        // this.name = name;
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
            console.log("Try to find action for: " + actionName);
            let state = this.interactionStates[actionName];
            if (state) {
                console.log("Action state : " + state);

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
    start(directory?: USVString): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    /** @inheritDoc */
    stop(directory?: USVString): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    /** @inheritDoc */
    public emitEvent(eventName: string, payload: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {    
        });
    }

    // public addListener(eventName: string, listener: (event: Event) => void): ExposedThing {
    //     return this;
    // }

    // public removeListener(eventName: string, listener: (event: Event) => void): ExposedThing {
    //     return this;
    // }

    // removeAllListeners(eventName: string): ExposedThing {
    //     return this;
    // }

    /** @inheritDoc */
    onRetrieveProperty(handler: WoT.RequestHandler): ExposedThing {
        // TODO implement onRetrieveProperty
        return this;
    }


    function (request: WoT.Request) {
        request.name;
        return 1;
    }

    /** @inheritDoc */
    // (request: WoT.Request) => any
    // handler: WoT.RequestHandler
    onInvokeAction(handler: WoT.RequestHandler): ExposedThing {

        // handler(Request);

        // actionName: string, cb: (param?: any) => any
        // handler.request.name;
        // request.name;
        // handler("dsa");
        // handler.call;
        // handler["request"].name;

        // console.log("call: " + handler.call)
        // console.log("callName: " + handler.call.name)
        // console.log("caller: " + handler.caller)
        // console.log("length: " + handler.length)
        // console.log("arg0: " + handler.arguments[0])
    
        // console.log("arg: " + handler.toString)
        // console.log("name: " + handler.name)
        console.log("name: " + handler.request.name)

        // console.log("name: " + request.name)
        let state = this.interactionStates[handler.request.name]; // actionName
        if (state) {
            if (state.handlers.length > 0) state.handlers.splice(0);
            state.handlers.push(handler.callback); // cb
        } else {
            console.error("no such action " + handler.request.name + " on " + this.name);
        }

        return this;
    }

    /** @inheritDoc */
    onUpdateProperty(handler: WoT.RequestHandler): ExposedThing {
        // propertyName: string, cb: (newValue: any, oldValue?: any) => void
        let state = this.interactionStates[handler.request.name]; // propertyName
        if (state) {
            state.handlers.push(handler.callback); // cb
        } else {
            console.error("no such property " + handler.request.name + " on " + this.name);
        }

        return this;
    }

    /** @inheritDoc */
    onObserve(handler: WoT.RequestHandler): ExposedThing {
        // TODO implement onObserve
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

    /** @inheritDoc */
    addProperty(property: WoT.ThingPropertyInit): ExposedThing {
        // propertyName: string, valueType: Object, initialValue?: any

        // new way
        let newProp = new TD.Interaction();
        newProp.pattern = TD.InteractionPattern.Property;
        newProp.name = property.name;  //propertyName;
      //  newProp.inputData = { 'valueType' : valueType};
       // newProp.outputData =  { 'valueType' : valueType};
        newProp.outputData = null; // need paramater for valueType;
        newProp.writable = property.writable;

        this.interactions.push(newProp);

        let propState = new InteractionState();
        propState.value = property.value; // initialValue;
        propState.handlers = [];

        this.interactionStates[property.name] = propState;

        this.addResourceListener("/" + this.name + "/properties/" + property.name, new Rest.PropertyResourceListener(this, newProp));

        return this;
    }

    /** @inheritDoc */
    addAction(action: WoT.ThingActionInit): ExposedThing {
        // actionName: string, inputType?: Object, outputType?: Object
        // new way
        let newAction = new TD.Interaction();
        newAction.pattern = TD.InteractionPattern.Action;
        newAction.name = action.name; // actionName;
        /*newAction.inputData = inputType ? { 'valueType' : inputType} : null;
        newAction.outputData = outputType ? { 'valueType' : outputType} : null;
*/
        // TODO inputData & outputData
        newAction.inputData = null; // inputType ? inputType : null;
        newAction.outputData = null; //  outputType ? outputType : null;

     
        this.interactions.push(newAction);

        let actionState = new InteractionState();
        // actionState.value = action.action;
        actionState.handlers = [];

        console.log("Add action '" + action.name + "' to interactionStates");

        this.interactionStates[action.name] = actionState;

        this.addResourceListener("/" + this.name + "/actions/" + action.name, new Rest.ActionResourceListener(this, newAction));

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

        this.interactions.push(newEvent);

         let eventState = new InteractionState();
        eventState.handlers = [];

        this.interactionStates[event.name] = eventState;

        return this;
    }

    /** @inheritDoc */
    removeProperty(propertyName: string): ExposedThing {
// =======
//     /*
//     sets the property to be writable or not
//     */
//     setWritable(propertyName:string, isWritable:boolean):void{
//         this.interactions.forEach(interaction => {
//             if(interaction.name == propertyName){
//                 if(interaction.semanticTypes.indexOf("Property")){
//                     interaction.writable=isWritable;
//                     return;
//                 }else{
//                     console.error("setWritable is only applicable to properties");
//                     return;
//                 }
//             }
//         });
//         console.error("Interaction not found");
//     }

//     /**
//      * remove a property from the ExposedThing
//      */
//     removeProperty(propertyName: string): boolean {
// >>>>>>> b8fdb1c903090bbd87eded2345f05f757364e8a0
        delete this.interactionStates[propertyName];
        this.removeResourceListener(this.name + "/properties/" + propertyName)
        return this;
    }

    /** @inheritDoc */
    removeAction(actionName: string): ExposedThing {
        delete this.interactionStates[actionName];
        this.removeResourceListener(this.name + "/actions/" + actionName)
        return this;
    }

    /** @inheritDoc */
    removeEvent(eventName: string): ExposedThing {
        // TODO 
        return this;
    }
}

class InteractionState {
    public value: any;
    // public handlers: Array<(param?: any) => any> = [];
    public handlers: Array<Function> = [];
    public path: string;
}
