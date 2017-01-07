import {serializeTD} from './tdparser'
import ThingDescritpion from './thingdescription'

export default class ServedThing implements WoT.DynamicThing {
    private actionHandlers : {[key : string] : (param? : any) => any } = {};
    private propListeners  : {[key : string] : Array<(param? : any) => any> } = {};
    private propStates : {[key : string] : any } = {}; 

    /** name of the Thing */
    readonly name: string

    constructor(name : string) {
        this.name = name;
    }

    /** invokes an action on the target thing 
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters  
    */
    public invokeAction(actionName: string, parameter?: any): Promise<any> { 
        return new Promise<any>((resolve, reject) => {
            let handler = this.actionHandlers[actionName];
            if(handler) {
                resolve(handler(parameter));
            } else {
                reject(new Error("No handler for " + actionName));
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
            if(this.propStates[propertyName]) {
                this.propStates[propertyName] = newValue;
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
            if(this.propStates[propertyName]) {
                resolve(this.propStates[propertyName]);
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
        if(this.actionHandlers[actionName]) {
            console.debug("replacing action handler for " + actionName + " on " + this.name);
        } 
        this.actionHandlers[actionName] = cb;
        return this;
    }

    /**
     * register a handler for value updates on the property
     * @param propertyName Name of the property
     * @param cb callback to be called when value changes; signature (newValue,oldValue)
     */
    onUpdateProperty(propertyName: string, cb: (newValue: any, oldValue?: any) => void): ServedThing {
        if(this.propListeners[propertyName]) {
            this.propListeners[propertyName].push(cb);
        } else {
            console.error("no such property " + propertyName + " on " + this.name);
        }
        return this;
        }

    /**
     * Retrive the ServedThing description for this object
     */
    getDescription(): Object { 
        return serializeTD(this);
    }

    /**
     * declare a new property for the ServedThing
     * @param propertyName Name of the property
     * @param valueType type specification of the value (JSON schema) 
     */
    addProperty(propertyName: string, valueType: Object, initialValue? : any): ServedThing { 
        this.propStates[propertyName] = (initialValue) ? initialValue : null;
        this.propListeners[propertyName] = [];

        // TODO decide for td-updates on-demand or pre-caching

        return this; 
    }

    /**
     * declare a new action for the ServedThing
     * @param actionName Name of the action
     * @param inputType type specification of the parameter (optional, JSON schema)
     * @param outputType type specification of the return value (optional, JSON schema)
     */
    addAction(actionName: string, inputType?: Object, outputType?: Object): ServedThing  {
        this.actionHandlers[actionName] = null;
    
        // TODO decide for td-updates on-demand or pre-caching

        return this;
        }

    /**
     * declare a new eventsource for the ServedThing
     */
    addEvent(eventName: string): ServedThing  { return this; }

    /**
     * remove a property from the ServedThing
     */
    removeProperty(propertyName: string): boolean {
        delete this.propListeners[propertyName];
        delete this.propStates[propertyName];
        return false
    }

    /**
     * remove an action from the ServedThing
     */
    removeAction(actionName: string): boolean {
        delete this.actionHandlers[actionName];
            return false
    }

    /**
     * remove an event from the thing
     */
    removeEvent(eventName: string): boolean { return false }
}