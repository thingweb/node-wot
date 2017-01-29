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

import ExposedThing from "./exposed-thing";
import WoTImpl from "./wot-impl";
import ThingDescription from "./td/thing-description";
import * as TD from "./td/thing-description";
import * as Helpers from "./helpers";

export default class Servient {
    private servers: Array<ProtocolServer> = [];
    private clientFactories: Map<string, ProtocolClientFactory> = new Map<string, ProtocolClientFactory>();
    private things: Map<string, ExposedThing> = new Map<string, ExposedThing>();
    private listeners : Map<string,ResourceListener> = new Map<string,ResourceListener>();

    public chooseLink(links: Array<TD.InteractionLink>): string {
        // TODO add an effective way of choosing a link
        // @mkovatsc order of ClientFactories added could decide priority
        return (links.length > 0) ? links[0].href : "nope://none";
    }

    public addResourceListener(path : string, resourceListener : ResourceListener) {
        this.listeners.set(path,resourceListener);
        //TODO add to all servers
    }

    public removeResourceListener(path : string) {
        this.listeners.delete(path);
        // TODO remove from all servers
    }

    public addServer(server: ProtocolServer): boolean {
        this.servers.push(server);
        this.listeners.forEach((listener,path) => server.addResource(path,listener));
        return true;
    }

    public addClientFactory(clientFactory: ProtocolClientFactory): void {
        clientFactory.getSchemes().forEach(scheme => this.clientFactories.set(scheme, clientFactory));
    }

    public hasClientFor(scheme: string) : boolean {
        logger.debug(`Servient checking for '${scheme}' scheme in ${this.clientFactories.size} ClientFactories`);
        return this.clientFactories.has(scheme);
    }

    public getClientFor(scheme: string): ProtocolClient {
        if(this.clientFactories.has(scheme)) {
            logger.verbose(`Servient creating client for scheme '${scheme}'`);
            return this.clientFactories.get(scheme).getClient();
        } else {
            // FIXME returning null was bad - Error or Promise?
            throw new Error(`Servient has no ClientFactory for scheme '${scheme}'`);
        }
    }

    public getClientSchemes() : string[] {
        return Array.from(this.clientFactories.keys());
    }

    public addThingFromTD(thing: ThingDescription): boolean {
        return false;
    }

    public addThing(thing: ExposedThing): boolean {
        if (!this.things.has(thing.name)) {
            this.things.set(thing.name, thing);
            return true
        } else
            return false
    }

    public getThing(name: string): ExposedThing {
        if (this.things.has(name)) {
            return this.things.get(name);
        } else return null;
    }

    //will return WoT object
    public start(): WoT.WoTFactory {
        this.servers.forEach((server) => server.start());
        // FIXME if ClientFactory has multiple schemes it is initialized multiple times
        this.clientFactories.forEach((clientFactory) => clientFactory.init());
        // Clients are to be created / started when a ConsumedThing is created
        return new WoTImpl(this);
    }

    public shutdown(): void {
        this.clientFactories.forEach((clientFactory) => clientFactory.destroy());
        this.servers.forEach((server) => server.stop());
    }
}
