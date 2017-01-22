/// <reference types="wot-typescript-definitions" />

import Servient from './servient'
import ServedThing from './servedthing'
import ProxyThing from './proxything'
import * as Helpers from './helpers'
import * as TDParser from './td/tdparser'

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
            let client = this.srv.getClientFor(uri);
            client.readResource(uri).then((td) => {
                let thingdesc = TDParser.parseTDObj(td);
                let pt = new ProxyThing(this.srv, thingdesc);
                resolve(pt);
            })
        });
    }

    /**
     * consume a thing description from an object and return a client representation object
     *
     * @param thingDescription a thing description
     */
    consumeDescription(thingDescription: Object): Promise<WoT.ConsumedThing> {
        return new Promise<WoT.ConsumedThing>((resolve, reject) => {
            let thingdesc = TDParser.parseTDObj(thingDescription);
            let pt = new ProxyThing(this.srv, thingdesc);
            resolve(pt);
        });
    }

    /**
     * create a new Thing
     *
     * @param name name/identifier of the thing to be created
     */
    createThing(name: string): Promise<WoT.DynamicThing> {
        return new Promise<WoT.DynamicThing>((resolve, reject) => {
            console.log("async creation of a thing called " + name);
            let mything = new ServedThing(this.srv, name);
            if(this.srv.addThing(mything)) {
                resolve(mything);
            } else {
                reject(new Error("could not add thing: " + mything))
            }
        });
    }

    /**
     * create a new Thing based on a thing description, given by a URI
     *
     * @param uri URI of a thing description to be used as "template"
     */
    createFromDescriptionUri(uri: string): Promise<WoT.ExposedThing> {
        return new Promise((resolve, reject) => {
            let client = this.srv.getClientFor(uri);
            client.readResource(uri).then((td) => {
                let thingdesc = TDParser.parseTDObj(td);
                let mything = new ServedThing(this.srv, thingdesc.name);
                resolve(mything);
            }
         );
        });
    }

    createFromDescription(thingDescription: Object): Promise<WoT.ExposedThing> {
        return new Promise((resolve, reject) => {
            let thingdesc = TDParser.parseTDObj(thingDescription);
        });
    }
}
