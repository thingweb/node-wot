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

import * as WoT from "wot-typescript-definitions";

import { ThingDescription } from "@node-wot/td-tools";
import * as TD from "@node-wot/td-tools";

import Servient from "./servient";
import * as Helpers from "./helpers";


import { ProtocolClient } from "./resource-listeners/protocol-interfaces";

import ContentSerdes from "./content-serdes"

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


interface ClientAndLink {
    client: ProtocolClient
    link: TD.InteractionLink
}


export default class ConsumedThing implements WoT.ConsumedThing {

    protected readonly td: ThingDescription;
    protected readonly srv: Servient;
    private clients: Map<string, ProtocolClient> = new Map();
    protected observablesEvent: Map<string, Subject<any>> = new Map();
    protected observablesPropertyChange: Map<string, Subject<any>> = new Map();
    protected observablesTDChange: Subject<any> = new Subject<any>();

    constructor(servient: Servient, td: ThingDescription) {
        this.srv = servient
        this.td = td;
        console.info(`ConsumedThing '${td.name}' created`);
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
            console.log(`ConsumedThing '${this.td.name}' chose cached client for '${schemes[cacheIdx]}'`);
            let client = this.clients.get(schemes[cacheIdx]);
            let link = links[cacheIdx];
            return { client: client, link: link };
        } else {
            // new client
            console.log(`ConsumedThing '${this.td.name}' has no client in cache (${cacheIdx})`);
            let srvIdx = schemes.findIndex(scheme => this.srv.hasClientFor(scheme));
            if (srvIdx === -1) throw new Error(`ConsumedThing '${this.td.name}' missing ClientFactory for '${schemes}'`);
            let client = this.srv.getClientFor(schemes[srvIdx]);
            if (client) {
                console.log(`ConsumedThing '${this.td.name}' got new client for '${schemes[srvIdx]}'`);
                if (this.td.security) {
                    console.warn("ConsumedThing applying security metadata");
                    console.dir(this.td.security);
                    client.setSecurity(this.td.security);
                }
                this.clients.set(schemes[srvIdx], client);
                let link = links[srvIdx];
                return { client: client, link: link }
            } else {
                throw new Error(`ConsumedThing '${this.td.name}' could not get client for '${schemes[srvIdx]}'`);
            }
        }
    }

    private findInteraction(name: string, type: TD.InteractionPattern) {
        let res = this.td.interaction.filter((ia) => ia.pattern === type && ia.name === name)
        return (res.length > 0) ? res[0] : null;
    }

    /**
     * Returns the Thing Description of the Thing.
     */
    getThingDescription(): WoT.ThingDescription {
        // TODO shall we implement some caching?
        return TD.serializeTD(this.td);
    }

    getThingName() : string {
        return this.td.name;
    }

    /**
     * Read a given property
     * @param propertyName Name of the property
     */
    readProperty(propertyName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let property = this.findInteraction(propertyName, TD.InteractionPattern.Property);
            if (!property) {
                reject(new Error(`ConsumedThing '${this.td.name}' cannot find Property '${propertyName}'`));
            } else {
                let {client, link} = this.getClientFor(property.link);
                if (!client) {
                    reject(new Error(`ConsumedThing '${this.td.name}' did not get suitable client for ${link.href}`));
                } else {
                    console.info(`ConsumedThing '${this.td.name}' reading ${link.href}`);
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
     * Write a given property
     * @param Name of the property
     * @param newValue value to be set
     */
    writeProperty(propertyName: string, newValue: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let property = this.findInteraction(propertyName, TD.InteractionPattern.Property);
            if (!property) {
                reject(new Error(`ConsumedThing '${this.td.name}' cannot find Property '${propertyName}'`));
            } else {
                let {client, link} = this.getClientFor(property.link);
                if (!client) {
                    reject(new Error(`ConsumedThing '${this.td.name}' did not get suitable client for ${link.href}`));
                } else {
                    console.info(`ConsumedThing '${this.td.name}' writing ${link.href} with '${newValue}'`);
                    let payload = ContentSerdes.valueToBytes(newValue,link.mediaType)
                    resolve(client.writeResource(link.href, payload));
                    
                    if(this.observablesPropertyChange.get(propertyName)) {
                        this.observablesPropertyChange.get(propertyName).next(newValue);
                    };
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
                reject(new Error(`ConsumedThing '${this.td.name}' cannot find Action '${actionName}'`));
            } else {
                let {client, link} = this.getClientFor(action.link);
                if (!client) {
                    reject(new Error(`ConsumedThing '${this.td.name}' did not get suitable client for ${link.href}`));
                } else {
                    console.info(`ConsumedThing '${this.td.name}' invoking ${link.href} with '${parameter}'`);
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

    onEvent(name: string): Observable<any> {
        if(!this.observablesEvent.get(name)) {
            console.log("Create event observable for " +  name);
            this.observablesEvent.set(name, new Subject());
        }

        return this.observablesEvent.get(name);
    }

    onPropertyChange(name: string): Observable<any> {
        if(!this.observablesPropertyChange.get(name)) {
            console.log("Create propertyChange observable for " +  name);
            this.observablesPropertyChange.set(name, new Subject());
        }

        return this.observablesPropertyChange.get(name);
    }

    onTDChange(): Observable<any> {
        return this.observablesTDChange;
    }

}
