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

/// <reference path="protocols/protocol-client.ts"  />
/// <reference path="protocols/protocol-server.ts"  />

import ServedThing from './servedthing';
import WoTImpl from './wot-impl';
import ThingDescription from './td/thingdescription'
import * as TD from './td/thingdescription'
import * as Helpers from './helpers'


export default class Servient {
    private servers: Array<ProtocolServer> = [];
    private clientFactories: Map<string, ProtocolClientFactory> = new Map<string, ProtocolClientFactory>();
    private things: Map<string, ServedThing> = new Map<string, ServedThing>();
    private listeners : Map<string,ResourceListener> = new Map<string,ResourceListener>();

    public chooseLink(links: Array<TD.TDInteractionLink>): string {
        // TODO add an effective way of choosing a link
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

    public addClientFactory(clientFactory: ProtocolClientFactory): boolean {
        for (let scheme in clientFactory.getSchemes()) {
            this.clientFactories.set(scheme, clientFactory);
        }
        return true;
    }

    public hasClientFor(scheme: string) : boolean {
        return this.clientFactories.has(scheme);
    }

    public getClientFor(scheme: string): ProtocolClient {
        if(this.clientFactories.has(scheme))
            return this.clientFactories.get(scheme).getClient();
        else
            return null;
    }

    public getClientSchemes() : string[] {
        return [...this.clientFactories.keys()];
    }

    public addThingFromTD(thing: ThingDescription): boolean {
        return false;
    }

    public addThing(thing: ServedThing): boolean {
        if (!this.things.has(thing.name)) {
            this.things.set(thing.name, thing);
            return true
        } else
            return false
    }

    public getThing(name: string): ServedThing {
        if (this.things.has(name)) {
            return this.things.get(name);
        } else return null;
    }

    //will return WoT object
    public start(): WoT.WoTFactory {
        this.servers.forEach((server) => server.start());
        this.clientFactories.forEach((clientFactory) => clientFactory.init());
        // Clients are to be created / started when a ConsumedThing is created
        return new WoTImpl(this);
    }

    public shutdown(): void {
        this.clientFactories.forEach((clientFactory) => clientFactory.destroy());
        this.servers.forEach((server) => server.stop());
    }
}
