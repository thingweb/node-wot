/*
 * W3C Software License
 *
 * Copyright (c) 2018 the thingweb community
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

/**
 * Basic test suite to demonstrate test setup
 * uncomment the @skip to see failing tests
 * 
 * h0ru5: there is currently some problem with VSC failing to recognize experimentalDecorators option, it is present in both tsconfigs
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import { InteractionForm } from "@node-wot/td-tools";
import Servient from "../src/servient";
import { ProtocolClient, ProtocolClientFactory, Content } from "../src/resource-listeners/protocol-interfaces"

class TDDataClient implements ProtocolClient {

    public readResource(uri: InteractionForm): Promise<Content> {
        // Note: this is not a "real" DataClient! Instead it just reports the same TD in any case
        let c: Content = { mediaType: "application/json", body: new Buffer(JSON.stringify(myThingDesc)) };
        return Promise.resolve(c);
    }

    public writeResource(uri: InteractionForm, content: Content): Promise<void> {
        return Promise.reject("writeResource not implemented");
    }

    public invokeResource(uri: InteractionForm, content: Content): Promise<Content> {
        return Promise.reject("invokeResource not implemented");
    }

    public unlinkResource(uri: InteractionForm): Promise<void> {
        return Promise.reject("unlinkResource not implemented");
    }

    public start(): boolean {
        return true;
    }

    public stop(): boolean {
        return true;
    }

    public setSecurity = (metadata: any) => false;
}

class TDDataClientFactory implements ProtocolClientFactory {

    public readonly scheme: string = "data";

    client = new TDDataClient();

    public getClient(): ProtocolClient {
        return this.client;
    }

    public init(): boolean {
        return true;
    }

    public destroy(): boolean {
        return true;
    }
}


class TrapClient implements ProtocolClient {

    private trap: Function

    public setTrap(callback: Function) {
        this.trap = callback
    }

    public readResource(uri: InteractionForm): Promise<Content> {
        return Promise.resolve(this.trap(uri));
    }

    public writeResource(uri: InteractionForm, content: Content): Promise<void> {
        return Promise.resolve(this.trap(uri, content));
    }

    public invokeResource(uri: InteractionForm, content: Content): Promise<Content> {
        return Promise.resolve(this.trap(uri, content));
    }

    public unlinkResource(uri: InteractionForm): Promise<void> {
        return Promise.resolve(this.trap(uri));
    }

    public start(): boolean {
        return true;
    }

    public stop(): boolean {
        return true;
    }

    public setSecurity = (metadata: any) => false;
}

class TrapClientFactory implements ProtocolClientFactory {

    public scheme: string = "test";
    client = new TrapClient();

    public setTrap(callback: Function) {
        this.client.setTrap(callback);
    }

    public getClient(): ProtocolClient {
        return this.client;
    }

    public init(): boolean {
        return true;
    }

    public destroy(): boolean {
        return true;
    }
}

let myThingDesc = {
    "@context": ["https://w3c.github.io/wot/w3c-wot-td-context.jsonld"],
    "@type": ["Thing"],
    "name": "aThing",
    "interaction": [
        {
            "@type": ["Property"],
            "name": "aProperty",
            "schema": { "type": "number" },
            "writable": false,
            "form": [
                { "href": "test://host/athing/properties/aproperty", "mediaType": "application/json" }
            ]
        },
        {
            "@type": ["Action"],
            "name": "anAction",
            "inputSchema": { "type": "number" },
            "outputSchema": { "type": "number" },
            "form": [
                { "href": "test://host/athing/actions/anaction", "mediaType": "application/json" }
            ]
        }

    ]
}

@suite("client flow of servient")
class WoTClientTest {

    static servient: Servient;
    static clientFactory: TrapClientFactory;
    static WoT: WoT.WoTFactory;

    // static tdFileUri : string = "td.json";

    static before() {
        this.servient = new Servient();
        this.clientFactory = new TrapClientFactory();
        this.servient.addClientFactory(this.clientFactory);
        this.servient.addClientFactory(new TDDataClientFactory());
        this.servient.start().then(WoTfactory => { this.WoT = WoTfactory; });

        console.log("starting test suite");
    }

    static after() {
        console.log("finishing test suite");
        this.servient.shutdown();
    }

    getThingName(ct: WoT.ConsumedThing): string {
        let td: WoT.ThingDescription = ct.getThingDescription();
        return JSON.parse(td).name;
    }

    @test "read a value"(done: Function) {
        // let the client return 42
        WoTClientTest.clientFactory.setTrap(
            () => {
                return { mediaType: "application/json", body: new Buffer("42") };
            }
        );

        // JSON.stringify(myThingDesc)
        WoTClientTest.WoT.fetch("data://" + "tdFoo")
            .then((td) => {
                let thing = WoTClientTest.WoT.consume(td);
                expect(thing).not.to.be.null;
                expect(this.getThingName(thing)).to.equal("aThing");
                return thing.readProperty("aProperty");
            })
            .then((value) => {
                expect(value).not.to.be.null;
                expect(value.toString()).to.equal("42");
                done();
            })
            .catch(err => { throw err })
    }

    @test "observe a value"(done: Function) {
        // let the client return 42
        WoTClientTest.clientFactory.setTrap(
            () => {
                return { mediaType: "application/json", body: new Buffer("42") };
            }
        );

        WoTClientTest.WoT.fetch("data://" + "tdFoo")
            .then((td) => {
                let thing = WoTClientTest.WoT.consume(td);
                expect(thing).not.to.be.null;
                expect(this.getThingName(thing)).to.equal("aThing");
                expect(thing.onPropertyChange("aProperty")).not.to.be.null;

                let subscription = thing.onPropertyChange("aProperty").subscribe(
                    x => {
                        console.log('onNext: %s', x);
                        if (x == 123) {
                            done();
                        }
                    },
                    e => console.log('onError: %s', e),
                    () => {
                        console.log('onCompleted aProperty changed');
                        // done();
                    }
                );

                // write one other value
                thing.writeProperty("aProperty", 12356666);

                setTimeout(() => {
                    // update value to trigger success
                    return thing.writeProperty("aProperty", 123);
                }, 25);
            })
            .then((value) => {
                expect(value).not.to.be.null;
                // done(); 
            })
            .catch(err => { throw err });
    }

    @test "write a value"(done: Function) {
        //verify the value transmitted
        WoTClientTest.clientFactory.setTrap(
            (uri: string, content: Content) => {
                expect(content.body.toString()).to.equal("23");
            }
        )

        // JSON.stringify(myThingDesc)
        WoTClientTest.WoT.fetch("data://" + "tdFoo")
            .then((td) => {
                let thing = WoTClientTest.WoT.consume(td);
                expect(thing).not.to.be.null;
                expect(this.getThingName(thing)).to.equal("aThing");
                return thing.writeProperty("aProperty", 23);
            })
            .then(() => done())
            .catch(err => { done(err) });
    }

    @test "call an action"(done: Function) {
        //an action
        WoTClientTest.clientFactory.setTrap(
            (uri: string, content: Content) => {
                expect(content.body.toString()).to.equal("23");
                return { mediaType: "application/json", body: new Buffer("42") };
            }
        )

        // JSON.stringify(myThingDesc)
        WoTClientTest.WoT.fetch("data://" + "tdFoo")
            .then((td) => {
                let thing = WoTClientTest.WoT.consume(td);
                thing.should.not.be.null;
                this.getThingName(thing).should.equal("aThing");
                return thing.invokeAction("anAction", 23);
            })
            .then((result) => {
                expect(result).not.to.be.null;
                expect(result).to.equal(42);
                done();
            })
            .catch(err => { done(err) });
    }
}
