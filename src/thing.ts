namespace Thingweb {
    export class Thing implements WoT.DynamicThing {
        private actionHandlers : {[key : string] : (param? : any) => any } = {};
        private propListeners  : {[key : string] : (param? : any) => any } = {};
        private propStates : {[key : string] : any } = {}; 


        /** name of the Thing */
        public name: string

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

        public addListener(eventName: string, listener: (event: Event) => void): Thing {
            return this;
         }

        public removeListener(eventName: string, listener: (event: Event) => void): Thing { 
            return this;
        }

        removeAllListeners(eventName: string): Thing {
            return this;
         }


        /**
         * register a handler for an action
         * @param actionName Name of the action
         * @param cb callback to be called when the action gets invoked, optionally is supplied a parameter  
         */
        onInvokeAction(actionName: string, cb: (param?: any) => any): Thing { 
            return this;
        }

        /**
         * register a handler for value updates on the property
         * @param propertyName Name of the property
         * @param cb callback to be called when value changes; signature (newValue,oldValue)
         */
        onUpdateProperty(propertyName: string, cb: (newValue: any, oldValue?: any) => void): Thing {
            return this;
         }

        /**
         * Retrive the thing description for this object
         */
        getDescription(): Object { 
            return serializeTd(this);
        }

        /**
         * declare a new property for the thing
         * @param propertyName Name of the property
         * @param valueType type specification of the value (JSON schema) 
         */
        addProperty(propertyName: string, valueType: Object): Thing { return this; }

        /**
         * declare a new action for the thing
         * @param actionName Name of the action
         * @param inputType type specification of the parameter (optional, JSON schema)
         * @param outputType type specification of the return value (optional, JSON schema)
         */
        addAction(actionName: string, inputType?: Object, outputType?: Object): Thing  { return this; }

        /**
         * declare a new eventsource for the thing
         */
        addEvent(eventName: string): Thing  { return this; }

        /**
         * remove a property from the thing
         */
        removeProperty(propertyName: string): boolean { return false }

        /**
         * remove an action from the thing
         */
        removeAction(actionName: string): boolean { return false }

        /**
         * remove an event from the thing
         */
        removeEvent(eventName: string): boolean { return false }
    }
}
