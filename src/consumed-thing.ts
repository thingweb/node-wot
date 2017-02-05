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

import logger from "./logger";

import Servient from "./servient";
import ThingDescription from "./td/thing-description";
import * as TD from "./td/thing-description";
import * as TDParser from "./td/td-parser";
import * as Helpers from "./helpers";
import ContentSerdes from "./types/content-serdes"

interface ClientAndLink {
    client: ProtocolClient
    link: TD.InteractionLink
}

export default class ConsumedThing implements WoT.ConsumedThing {

    readonly name: string;
    private readonly td: ThingDescription;
    private readonly srv: Servient;
    private clients: Map<string, ProtocolClient> = new Map();

    constructor(servient: Servient, td: ThingDescription) {
        this.srv = servient
        this.name = td.name;
        this.td = td;
        logger.info(`ConsumedThing '${this.name}' created`);
    }

    // lazy singleton for ProtocolClient per scheme
    private getClientFor(links: TD.InteractionLink[]): ClientAndLink {
        if (links.length === 0) {
            throw new Error("ConsumedThing '${this.name}' has no links for this interaction");
        }

        let schemes = links.map(link => Helpers.extractScheme(link.href))
        let cacheIdx = schemes.findIndex(scheme => this.clients.has(scheme))
        
        if (cacheIdx !== -1) {
            logger.debug(`ConsumedThing '${this.name}' chose cached client for '${schemes[cacheIdx]}'`);
            let client = this.clients.get(schemes[cacheIdx]);
            let link = links[cacheIdx];
            return { client: client, link: link };
        } else {
            logger.silly(`ConsumedThing '${this.name}' has no client in cache (${cacheIdx})`);
            let srvIdx = schemes.findIndex(scheme => this.srv.hasClientFor(scheme));
            if (srvIdx === -1) throw new Error(`ConsumedThing '${this.name}' missing ClientFactory for '${schemes}'`);
            logger.silly(`ConsumedThing '${this.name}' chose protocol '${schemes[srvIdx]}'`);
            let client = this.srv.getClientFor(schemes[srvIdx]);
            if (client) {
                logger.debug(`ConsumedThing '${this.name}' got new client for '${schemes[srvIdx]}'`);
                this.clients.set(schemes[srvIdx], client);
                let link = links[srvIdx];
                return { client: client, link: link }
            } else {
                throw new Error(`ConsumedThing '${this.name}' could not get client for '${schemes[srvIdx]}'`);
            }
        }
    }

    private findInteraction(name: string, type: TD.InteractionPattern) {
        let res = this.td.interactions.filter((ia) => ia.pattern === type && ia.name === name)
        return (res.length > 0) ? res[0] : null;
    }

    /**
     * Read a given property
     * @param propertyName Name of the property
     */
    getProperty(propertyName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let property = this.findInteraction(propertyName, TD.InteractionPattern.Property);
            if (!property) {
                reject(new Error(`ConsumedThing '${this.name}' cannot find Property '${propertyName}'`));
            } else {
                let {client, link} = this.getClientFor(property.links);
                if (!client) {
                    reject(new Error(`ConsumedThing '${this.name}' did not get suitable client for ${link.href}`));
                } else {
                    logger.info(`ConsumedThing '${this.name}' getting ${link.href}`);
                    client.readResource(link.href).then( (buffer) => {
                        let mediaType = link.mediaType
                        logger.info(`decoding media type ${mediaType} in readProperty`)
                        let value = ContentSerdes.bytesToValue(buffer,mediaType.toString());
                        resolve(value);
                    });
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
            let property = this.findInteraction(propertyName, TD.InteractionPattern.Property);
            if (!property) {
                reject(new Error(`ConsumedThing '${this.name}' cannot find Property '${propertyName}'`));
            } else {
                let {client, link} = this.getClientFor(property.links);
                if (!client) {
                    reject(new Error(`ConsumedThing '${this.name}' did not get suitable client for ${link.href}`));
                } else {
                    logger.info(`ConsumedThing '${this.name}' setting ${link.href} to '${newValue}'`);
                    let payload = ContentSerdes.valueToBytes(newValue,link.mediaType) 
                    resolve(client.writeResource(link.href, payload));
                }
            }
        });
    }

    /** invokes an action on the target thing
     * @param actionName Name of the action to invoke
     * @param parameter optional json object to supply parameters
    */
    invokeAction(actionName: string, parameter?: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let action = this.findInteraction(actionName, TD.InteractionPattern.Action);
            if (!action) {
                reject(new Error(`ConsumedThing '${this.name}' cannot find Action '${actionName}'`));
            } else {
                let {client, link} = this.getClientFor(action.links);
                if (!client) {
                    reject(new Error(`ConsumedThing '${this.name}' did not get suitable client for ${link.href}`));
                } else {
                    logger.info(`ConsumedThing '${this.name}' invoking ${link.href} with '${parameter}'`);
                    // TODO #5 client expects Buffer; ConsumedThing would have the necessary TD valueType rule...

                    let mediaType = link.mediaType; //TODO: I need a function to turn the enum to string
                    let payload = ContentSerdes.valueToBytes(parameter) 

                    client.invokeResource(link.href, payload).then( (payload) => {
                        // TODO #5 client returns Buffer on invoke; ConsumedThing would have the necessary TD valueType rule...
                        let value = ContentSerdes.bytesToValue(payload,link.mediaType)
                        resolve(value);
                    });
                }
            }
        });
    }

    addListener(eventName: string, listener: (event: Event) => void): ConsumedThing { return this }
    removeListener(eventName: string, listener: (event: Event) => void): ConsumedThing { return this }
    removeAllListeners(eventName: string): ConsumedThing { return this }

    /**
     * Retrive the thing description for this object
     */
    getDescription(): Object {
        return TDParser.serializeTD(this.td);
    }
}
