/*
 * The MIT License (MIT)
 * Copyright (c) 2017 the thingweb community
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import logger from './logger'

import Servient from './servient'
import ServedThing from './servedthing'
import ProxyThing from './proxything'
import * as Helpers from './helpers'
import * as TDParser from './td/tdparser'

import * as WoT from 'wot-typescript-definitions';

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
            let client = this.srv.getClientFor(Helpers.extractScheme(uri));
            logger.info(`WoTImpl consuming TD at ${uri} with ${client}`);
            client.readResource(uri).then((td) => {
                let thingdesc = TDParser.parseTDObj(td);
                let pt = new ProxyThing(this.srv, thingdesc);
                client.stop();
                resolve(pt);
            })
            .catch( (err) => { console.error(err); } );
        });
    }

    /**
     * consume a thing description from an object and return a client representation object
     *
     * @param thingDescription a thing description
     */
    consumeDescription(thingDescription: Object): Promise<WoT.ConsumedThing> {
        return new Promise<WoT.ConsumedThing>((resolve, reject) => {
            logger.info(`WoTImpl consuming TD from object`);
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
            logger.info(`WoTImpl creating new ServedThing '${name}'`);
            let mything = new ServedThing(this.srv, name);
            if(this.srv.addThing(mything)) {
                resolve(mything);
            } else {
                reject(new Error("WoTImpl could not create Thing: " + mything))
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
            logger.info(`WoTImpl creating new ServedThing from TD at ${uri} with ${client}`);
            client.readResource(uri).then((td) => {
                let thingdesc = TDParser.parseTDObj(td);
                let mything = new ServedThing(this.srv, thingdesc.name);
                if(this.srv.addThing(mything)) {
                    resolve(mything);
                } else {
                    reject(new Error("WoTImpl could not create Thing from TD: " + mything))
                }
            }
        );
        });
    }

    createFromDescription(thingDescription: Object): Promise<WoT.ExposedThing> {
        return new Promise((resolve, reject) => {
            let thingdesc = TDParser.parseTDObj(thingDescription);
            logger.info(`WoTImpl creating new ServedThing from object`);
            let mything = new ServedThing(this.srv, thingdesc.name);
            if(this.srv.addThing(mything)) {
                resolve(mything);
            } else {
                reject(new Error("WoTImpl could not create Thing from object: " + mything))
            }
        });
    }
}
