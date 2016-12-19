/// <reference types="wot-typescript-definitons" />

import Servient from './Servient'
//import * as WoT from 'wot-typescript-definitons';

export default class WoTImpl implements WoT.WoTFactory {
    private srv : Servient;

    constructor(srv: Servient) {
        this.srv = srv;
    }

    discover(discoveryType: string, filter: Object): Promise<WoT.ConsumedThing> {
        return new Promise<WoT.ConsumedThing>((resolve, reject) => {

        });
    }

    /**
     * consume a thing description by URI and return a client representation object
     * @param uri URI of a thing description
     */
    consumeDescriptionUri(uri: string): Promise<WoT.ConsumedThing> {
        return new Promise<WoT.ConsumedThing>((resolve, reject) => {

        });
    }

    /**
     * consume a thing description from an object and return a client representation object
     * 
     * @param thingDescription a thing description
     */
    consumeDescription(thingDescription: Object): Promise<WoT.ConsumedThing> {
        return new Promise<WoT.ConsumedThing>((resolve, reject) => {

        });
    }

    /**
     * create a new Thing
     * 
     * @param name name/identifier of the thing to be created 
     */
    createThing(name: string): Promise<WoT.DynamicThing> {
        return new Promise<WoT.DynamicThing>((resolve, reject) => {

        });
    }

    /**
     * create a new Thing based on a thing description, given by a URI
     * 
     * @param uri URI of a thing description to be used as "template" 
     */
    createFromDescriptionUri(uri: string): Promise<WoT.ExposedThing> {
        return new Promise((resolve, reject) => {

        });
    }

    createFromDescription(thingDescription: Object): Promise<WoT.ExposedThing> {
        return new Promise((resolve, reject) => {

        });
    }
}
