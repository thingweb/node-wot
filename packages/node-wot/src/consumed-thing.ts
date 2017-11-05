/*
 * W3C Software License
 *
 * Copyright (c) 2017 the thingweb community
 *
 * THIS WORK IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR
 * WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF
 * MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE
 * SOFTWARE OR DOCUMENT WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS,
 * TRADEMARKS OR OTHER RIGHTS.
 *
 * COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR
 * CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENT.
 *
 * The name and trademarks of copyright holders may NOT be used in advertising or
 * publicity pertaining to the work without specific, written prior permission. Title
 * to copyright in this work will at all times remain with copyright holders.
 */

import * as WoT from 'wot-typescript-definitions';
import {ProtocolClient} from "./resource-listeners/protocol-interfaces"
import Servient from "./servient";
import {ThingDescription} from "node-wot-td-tools"
import * as TD from "node-wot-td-tools";
import * as Helpers from "./helpers";
import ContentSerdes from "./content-serdes"
import {Observable} from 'rxjs/Observable';

interface ClientAndLink {
    client: ProtocolClient
    link: TD.InteractionLink
}


export default class ConsumedThing implements WoT.ConsumedThing {

    readonly name: string;
    readonly url: USVString;
    readonly description: WoT.ThingDescription;

    protected readonly td: ThingDescription;
    protected readonly srv: Servient;
    private clients: Map<string, ProtocolClient> = new Map();

    constructor(servient: Servient, td: ThingDescription) {
        this.srv = servient
        this.name = td.name;
        this.td = td;
        this.description = JSON.stringify(td);
        console.info(`ConsumedThing '${this.name}' created`);
    }

    // lazy singleton for ProtocolClient per scheme
    private getClientFor(links: TD.InteractionLink[]): ClientAndLink {
        if (links.length === 0) {
            throw new Error("ConsumedThing '${this.name}' has no links for this interaction");
        }

        let schemes = links.map(link => Helpers.extractScheme(link.href))
        let cacheIdx = schemes.findIndex(scheme => this.clients.has(scheme))

        if (cacheIdx !== -1) {
            // from cache
            console.log(`ConsumedThing '${this.name}' chose cached client for '${schemes[cacheIdx]}'`);
            let client = this.clients.get(schemes[cacheIdx]);
            let link = links[cacheIdx];
            return { client: client, link: link };
        } else {
            // new client
            console.log(`ConsumedThing '${this.name}' has no client in cache (${cacheIdx})`);
            let srvIdx = schemes.findIndex(scheme => this.srv.hasClientFor(scheme));
            if (srvIdx === -1) throw new Error(`ConsumedThing '${this.name}' missing ClientFactory for '${schemes}'`);
            let client = this.srv.getClientFor(schemes[srvIdx]);
            if (client) {
                console.log(`ConsumedThing '${this.name}' got new client for '${schemes[srvIdx]}'`);
                if (this.td.security) {
                    console.warn("ConsumedThing applying security metadata");
                    console.dir(this.td.security);
                    client.setSecurity(this.td.security);
                }
                this.clients.set(schemes[srvIdx], client);
                let link = links[srvIdx];
                return { client: client, link: link }
            } else {
                throw new Error(`ConsumedThing '${this.name}' could not get client for '${schemes[srvIdx]}'`);
            }
        }
    }

    private findInteraction(name: string, type: TD.InteractionPattern) {
        let res = this.td.interaction.filter((ia) => ia.pattern === type && ia.name === name)
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
                let {client, link} = this.getClientFor(property.link);
                if (!client) {
                    reject(new Error(`ConsumedThing '${this.name}' did not get suitable client for ${link.href}`));
                } else {
                    console.info(`ConsumedThing '${this.name}' reading ${link.href}`);
                    client.readResource(link.href).then( (content) => {
                        if (!content.mediaType) content.mediaType = link.mediaType;
                        //console.log(`ConsumedThing decoding '${content.mediaType}' in readProperty`);
                        let value = ContentSerdes.bytesToValue(content);
                        resolve(value);
                    })
                    .catch(err => { console.log("Failed to read because " + err); });
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
                let {client, link} = this.getClientFor(property.link);
                if (!client) {
                    reject(new Error(`ConsumedThing '${this.name}' did not get suitable client for ${link.href}`));
                } else {
                    console.info(`ConsumedThing '${this.name}' writing ${link.href} with '${newValue}'`);
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
                let {client, link} = this.getClientFor(action.link);
                if (!client) {
                    reject(new Error(`ConsumedThing '${this.name}' did not get suitable client for ${link.href}`));
                } else {
                    console.info(`ConsumedThing '${this.name}' invoking ${link.href} with '${parameter}'`);
                    // TODO #5 client expects Buffer; ConsumedThing would have the necessary TD valueType rule...

                    let mediaType = link.mediaType;
                    let input = ContentSerdes.valueToBytes(parameter, link.mediaType.toString());

                    client.invokeResource(link.href, input).then( (output) => {
                        if (!output.mediaType) output.mediaType = link.mediaType;
                        //console.log(`ConsumedThing decoding '${output.mediaType}' in invokeAction`);
                        let value = ContentSerdes.bytesToValue(output);
                        resolve(value);
                    });
                }
            }
        });
    }

    addListener(eventName: string, listener: WoT.ThingEventListener): ConsumedThing {    
        return this
    }
    removeListener(eventName: string, listener: WoT.ThingEventListener): ConsumedThing { return this }
    removeAllListeners(eventName: string): ConsumedThing { return this }

    observe(name: string, requestType: WoT.RequestType): Observable<any> { return null }


    // /**
    //  * Retrive the thing description for this object
    //  */
    // getDescription(): Object {
    //     return this.td;
    // }
}
