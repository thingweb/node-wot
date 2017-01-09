import ThingDescription from './thingdescription'
import Servient from './servient'
import * as TDParser from './tdparser'

export default class ProxyThing implements WoT.ConsumedThing {

    readonly name: string;
    private readonly td: ThingDescription;
    private readonly srv: Servient;

    constructor(servient: Servient, td: ThingDescription) {
        this.srv = servient
        this.name = td.name;
        this.td = td;
    }

    private findInteraction(name: string, type: string) {
        let res = this.td.interactions.filter((ia) => ia.type === type && ia.name === name)
        return (res.length > 0) ? res[0] : null;
    }

    /** invokes an action on the target thing 
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters  
    */
    invokeAction(actionName: string, parameter?: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let action = this.findInteraction(name, 'action');
            if (!action)
                reject(new Error("cannot find action " + name + " in " + this.name))
            else {
                let uri = action.uri;
                console.log("getting client for " + uri);
                let client = this.srv.getClientFor(uri);
                if (!client)
                    reject("no suitable client found for " + uri)
                else {
                    console.log("invoking " + action.uri);
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
        return new Promise<any>((resolve, reject) => {
            let property = this.findInteraction(name, 'property');
            if (!property)
                reject(new Error("cannot find property " + name + " in " + this.name))
            else {
                let uri = property.uri;
                console.log("getting client for " + uri);
                let client = this.srv.getClientFor(uri);
                if (!client)
                    reject("no suitable client found for " + uri)
                else {
                    console.log("invoking " + property.uri);
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
        return new Promise<any>((resolve, reject) => {
            let property = this.findInteraction(name, 'property');
            if (!property)
                reject(new Error("cannot find property " + name + " in " + this.name))
            else {
                let uri = property.uri;
                console.log("getting client for " + uri);
                let client = this.srv.getClientFor(uri);
                if (!client)
                    reject("no suitable client found for " + uri)
                else {
                    console.log("invoking " + property.uri);
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