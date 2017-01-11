import ThingDescription from './thingdescription'
import * as TD from './thingdescription'
import Servient from './servient'
import * as TDParser from './tdparser'

import {logger} from "./logger";

export default class ProxyThing implements WoT.ConsumedThing {

    readonly name: string;
    private readonly td: ThingDescription;
    private readonly srv: Servient;

    constructor(servient: Servient, td: ThingDescription) {
        logger.info("Create ProxyThing '" + this.name + "' created");
        this.srv = servient
        this.name = td.name;
        this.td = td;
    }

    private findInteraction(name: string, type: string) {
        let res = this.td.interactions.filter((ia) => ia.interactionType === TD.interactionTypeEnum.action && ia.name === name)
        return (res.length > 0) ? res[0] : null;
    }

    /** invokes an action on the target thing 
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters  
    */
    invokeAction(actionName: string, parameter?: any): Promise<any> {
        logger.info("invokeAction '" + actionName + "' for ProxyThing '" + this.name + "'");
        return new Promise<any>((resolve, reject) => {
            let action = this.findInteraction(name, 'action');
            if (!action)
                reject(new Error("cannot find action " + name + " in " + this.name))
            else {
                let uri = this.srv.chooseLink(action.links);
                console.log("getting client for " + uri);
                let client = this.srv.getClientFor(uri);
                if (!client)
                    reject("no suitable client found for " + uri)
                else {
                    console.log("invoking " + uri);
                    resolve(client.invokeResource(uri, parameter))
                }
            }
        });
    }

    /**
     * Set a given property
     * @param Name of the property
     * @param newValue value to be set  
     */
    setProperty(propertyName: string, newValue: any): Promise<any> {
        logger.info("setProperty '" + propertyName + "' for ProxyThing '" + this.name + "'");
        return new Promise<any>((resolve, reject) => {
            let property = this.findInteraction(name, 'property');
            if (!property)
                reject(new Error("cannot find property " + name + " in " + this.name))
            else {
                let uri = this.srv.chooseLink(property.links);
                console.log("getting client for " + uri);
                let client = this.srv.getClientFor(uri);
                if (!client)
                    reject("no suitable client found for " + uri)
                else {
                    console.log("writing " + uri);
                    resolve(client.writeResource(uri, newValue))
                }
            }
        });

    }

    /**
     * Read a given property
     * @param propertyName Name of the property 
     */
    getProperty(propertyName: string): Promise<any> {
        logger.info("getProperty '" + propertyName + "' for ProxyThing '" + this.name + "'");
        return new Promise<any>((resolve, reject) => {
            let property = this.findInteraction(name, 'property');
            if (!property)
                reject(new Error("cannot find property " + name + " in " + this.name))
            else {
                let uri = this.srv.chooseLink(property.links);
                console.log("getting client for " + uri);
                let client = this.srv.getClientFor(uri);
                if (!client)
                    reject(new Error("no suitable client found for " + uri))
                else {
                    console.log("reading " + uri);
                    resolve(client.readResource(uri))
                }
            }
        });
    }

    addListener(eventName: string, listener: (event: Event) => void): ProxyThing { return this }
    removeListener(eventName: string, listener: (event: Event) => void): ProxyThing { return this }
    removeAllListeners(eventName: string): ProxyThing { return this }

    /**
     * Retrive the thing description for this object
     */
    getDescription(): Object {
        return TDParser.serializeTD(this.td);
    }


}