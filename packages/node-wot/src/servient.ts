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


import ExposedThing from "./exposed-thing";
import WoTImpl from "./wot-impl";
import {ProtocolClientFactory, ProtocolServer, ResourceListener, ProtocolClient} from "./resource-listeners/protocol-interfaces"
import {ThingDescription} from "node-wot-td-tools";
import * as TD from "node-wot-td-tools";
import * as Helpers from "./helpers";
import { default as ContentSerdes, ContentCodec } from "./content-serdes"
import * as vm from 'vm'

export default class Servient {
    private servers: Array<ProtocolServer> = [];
    private clientFactories: Map<string, ProtocolClientFactory> = new Map<string, ProtocolClientFactory>();
    private things: Map<string, ExposedThing> = new Map<string, ExposedThing>();
    private listeners : Map<string,ResourceListener> = new Map<string,ResourceListener>();
    private credentialStore : Map<string, any> = new Map<string, any>();

    /** runs the script in a new sandbox */
    public runScript(code : string, filename = 'script') {
        let script = new vm.Script(code);
        let context = vm.createContext({
            'WoT': new WoTImpl(this),
            'console': console,
            'setInterval': setInterval,
            'setTimeout': setTimeout
        });
        let options = {
            "filename" : filename,
            "displayErrors" : true
        };
        script.runInContext(context,options);
    }

    /** runs the script in priviledged context (dangerous) - means here: scripts can require */
    public runPriviledgedScript(code : string, filename = 'script') {
        let script = new vm.Script(code);
        let context = vm.createContext({
            'WoT': new WoTImpl(this),
            'console': console,
            'setInterval': setInterval,
            'setTimeout': setTimeout,
            'require' : require
        });
        let options = {
            "filename" : filename,
            "displayErrors" : true
        };
        script.runInContext(context, options);
    }

    /** add a new codec to support a mediatype */
    public addMediaType(codec : ContentCodec) : void {
        ContentSerdes.addCodec(codec);
    }

    /** retun all media types that this servient supports */
    public getSupportedMediaTypes() : Array<string> {
        return ContentSerdes.getSupportedMediaTypes();
    }

    public chooseLink(links: Array<TD.InteractionLink>): string {
        // TODO add an effective way of choosing a link
        // @mkovatsc order of ClientFactories added could decide priority
        return (links.length > 0) ? links[0].href : "nope://none";
    }

    public addResourceListener(path : string, resourceListener : ResourceListener) {
        console.log(`Servient adding ResourceListener '${path}' of type ${resourceListener.constructor.name}`);
        this.listeners.set(path,resourceListener);
        this.servers.forEach(srv => srv.addResource(path,resourceListener));
    }

    public removeResourceListener(path : string) {
        console.log(`Servient removing ResourceListener '${path}'`);
        this.listeners.delete(path);
        this.servers.forEach(srv => srv.removeResource(path));
    }

    public addServer(server: ProtocolServer): boolean {
        this.servers.push(server);
        this.listeners.forEach((listener,path) => server.addResource(path,listener));
        return true;
    }

    public getServers() : Array<ProtocolServer> {
        return this.servers.slice(0);
    }

    public addClientFactory(clientFactory: ProtocolClientFactory): void {
        clientFactory.getSchemes().forEach(scheme => this.clientFactories.set(scheme, clientFactory));
    }

    public hasClientFor(scheme: string) : boolean {
        console.log(`Servient checking for '${scheme}' scheme in ${this.clientFactories.size} ClientFactories`);
        return this.clientFactories.has(scheme);
    }

    public getClientFor(scheme: string): ProtocolClient {
        if(this.clientFactories.has(scheme)) {
            console.log(`Servient creating client for scheme '${scheme}'`);
            return this.clientFactories.get(scheme).getClient();
        } else {
            // FIXME returning null was bad - Error or Promise?
            // h0ru5: caller cannot react gracefully - I'd throw Error
            throw new Error(`Servient has no ClientFactory for scheme '${scheme}'`);
        }
    }

    public getClientSchemes() : string[] {
        return Array.from(this.clientFactories.keys());
    }

    public addThingFromTD(thing: ThingDescription): boolean {
        // TODO loop through all properties and add properties
        // TODO loop through all actions and add actions
        return false;
    }

    public addThing(thing: ExposedThing): boolean {
        if (!this.things.has(thing.name)) {
            this.things.set(thing.name, thing);
            return true;
        } else {
            return false;
        }
    }

    public getThing(name: string): ExposedThing {
        if (this.things.has(name)) {
            return this.things.get(name);
        } else return null;
    }

    public addCredentials(credentials: any) {
        if (typeof credentials === "object") {
            for (let i in credentials) {
                this.credentialStore.set(i, credentials[i]);
            }
        }
    }
    public getCredentials(identifier: string): any {
        return this.credentialStore.get(identifier);
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
