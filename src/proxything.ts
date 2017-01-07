import ThingDescription from './thingdescription'

export default class ProxyThing implements WoT.ConsumedThing {

    readonly name : string;
    private td : Object;

    constructor(td : ThingDescription) {

    }


    /** invokes an action on the target thing 
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters  
    */
    invokeAction(actionName: string, parameter?: any): Promise<any> {
        return null;
    }

    /**
     * Set a given property
     * @param Name of the property
     * @param newValue value to be set  
     */
    setProperty(propertyName: string, newValue: any): Promise<any> {
        return null;
    }

    /**
     * Read a given property
     * @param propertyName Name of the property 
     */
    getProperty(propertyName: string): Promise<any> {
        return null;
    }

    addListener(eventName: string, listener: (event: Event) => void): ProxyThing { return this }
    removeListener(eventName: string, listener: (event: Event) => void): ProxyThing { return this }
    removeAllListeners(eventName: string): ProxyThing { return this }

    /**
     * Retrive the thing description for this object
     */
    getDescription(): Object {
        return this.td;
    }


}