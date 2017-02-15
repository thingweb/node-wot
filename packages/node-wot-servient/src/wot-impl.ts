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

import logger from "node-wot-logger";

import Servient from "./servient";
import ExposedThing from "./exposed-thing";
import ConsumedThing from "./consumed-thing";
import * as Helpers from "node-wot-helpers";
import * as TDParser from "node-wot-td-parser";

import * as WoT from 'wot-typescript-definitions';

export default class WoTImpl implements WoT.WoTFactory {
    private srv: Servient;

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
            client.readResource(uri).then((content) => {
                if (content.mediaType !== 'application/json')
                    logger.warn(`parsing TD from ${content.mediaType}`)
                let thingdesc = TDParser.parseTDString(content.body.toString());
                let pt = new ConsumedThing(this.srv, thingdesc);
                client.stop();
                resolve(pt);
            })
                .catch((err) => { console.error(err); });
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
            let td = TDParser.parseTDObject(thingDescription);
            let thing = new ConsumedThing(this.srv, td);
            resolve(thing);
        });
    }

    /**
     * create a new Thing
     *
     * @param name name/identifier of the thing to be created
     */
    createThing(name: string): Promise<WoT.DynamicThing> {
        return new Promise<WoT.DynamicThing>((resolve, reject) => {
            logger.info(`WoTImpl creating new ExposedThing '${name}'`);
            let mything = new ExposedThing(this.srv, name);
            if (this.srv.addThing(mything)) {
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
            logger.info(`WoTImpl creating new ExposedThing from TD at ${uri} with ${client}`);
            client.readResource(uri).then((content) => {
                if (content.mediaType !== 'application/json')
                    logger.warn(`parsing TD from ${content.mediaType}`)
                let thingdesc = TDParser.parseTDString(content.body.toString());
                let mything = new ExposedThing(this.srv, thingdesc.name);
                if (this.srv.addThing(mything)) {
                    resolve(mything);
                } else {
                    reject(new Error("WoTImpl could not create Thing from TD: " + mything))
                }
            }).catch((err) => logger.error("failed fetching TD", err));
        });
    }

    createFromDescription(thingDescription: Object): Promise<WoT.ExposedThing> {
        return new Promise((resolve, reject) => {
            let thingdesc = TDParser.parseTDObject(thingDescription);
            logger.info(`WoTImpl creating new ExposedThing from object`);
            let mything = new ExposedThing(this.srv, thingdesc.name);
            if (this.srv.addThing(mything)) {
                resolve(mything);
            } else {
                reject(new Error("WoTImpl could not create Thing from object: " + mything))
            }
        });
    }
}
