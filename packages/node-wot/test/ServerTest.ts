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

import Servient from "../src/servient";
import * as listeners from "../src/resource-listeners/all-resource-listeners";
import {ProtocolServer,Content,ResourceListener} from "../src/resource-listeners/protocol-interfaces"
import ThingInitImpl from "../src/thing-init-impl"
import ThingPropertyInitImpl from "../src/thing-property-init-impl"
import ThingActionInitImpl from "../src/thing-action-init-impl"
import RequestImpl from "../src/request-impl"

// implement a testserver to mock a server
class TestProtocolServer implements ProtocolServer {
    private listeners: Map<string, ResourceListener> = new Map();

    getScheme() : string {
        return "test";
    }

    getListenerFor(path: string): ResourceListener {
        return this.listeners.get(path);
    }

    addResource(path: string, res: ResourceListener): boolean {
        if (this.listeners.has(path)) return false;
        this.listeners.set(path, res);
    }

    removeResource(path: string): boolean {
        return true;
    }

    start(): boolean { return true }
    stop(): boolean { return true }
    getPort(): number { return -1 }
}

@suite("the server side of servient")
class WoTServerTest {

    static servient: Servient;
    static WoT: WoT.WoTFactory;
    static server: TestProtocolServer;

    static before() {
        this.servient = new Servient();
        this.server = new TestProtocolServer();
        this.servient.addServer(this.server);
        this.WoT = this.servient.start();
        console.log("before starting test suite");
    }

    static after() {
        console.log("after finishing test suite");
        this.servient.shutdown();
    }

    @test "should be able to add a thing"() {
        let init : WoT.ThingInit = new ThingInitImpl("myThing", "", {});

        return WoTServerTest.WoT.expose(init).then(thing => {
            expect(thing).to.exist;
            expect(thing).to.have.property("name", "myThing");
        });
    }

    @test "should be able to add a property, read it and write it locally"() {
        let init : WoT.ThingInit = new ThingInitImpl("otherthing", "", {});
        return WoTServerTest.WoT.expose(init).then(thing => {
            let initp : WoT.ThingPropertyInit = new ThingPropertyInitImpl("number", null);

            return thing.addProperty(initp).setProperty("number", 5).then(value => {
                expect(value).to.equal(5);
            })
            .then(() => thing.getProperty("number"))
            .then(value => {
                expect(value).to.equal(5);
            });
        });
    }

    @test "should be able to add a property, assign it via listener and read it locally"() {
        let init : WoT.ThingInit = new ThingInitImpl("thing3", "", {});
        return WoTServerTest.WoT.expose(init).then(thing => {
            let initp : WoT.ThingPropertyInit = new ThingPropertyInitImpl("prop1", null);
            // thing.addProperty("prop1", { "type": "number" });
            thing.addProperty(initp);

            let listener = WoTServerTest.server.getListenerFor("/thing3/properties/prop1");
            expect(listener).to.exist;
            listener.should.be.an.instanceOf(listeners.PropertyResourceListener);
            return listener.onWrite({mediaType: undefined, body: new Buffer("5") }).then(() => {
                return thing.getProperty("prop1").then((value) => expect(value).to.equal(5));
            });
        });
    }

    @test "should be able to add a property, assign it locally and read it via listener"() {
        let init : WoT.ThingInit = new ThingInitImpl("thing4", "", {});
        return WoTServerTest.WoT.expose(init).then(thing => {
            let initp : WoT.ThingPropertyInit = new ThingPropertyInitImpl("prop1", null);
            // thing.addProperty("prop1", { "type": "number" });
            thing.addProperty(initp);

            let listener = WoTServerTest.server.getListenerFor("/thing4/properties/prop1");
            expect(listener).to.exist;
            listener.should.be.an.instanceOf(listeners.PropertyResourceListener);

            return thing.setProperty("prop1", 23).then((value) => {
                return listener.onRead().then((content) => {
                    content.should.deep.equal({ mediaType: "application/json", body: new Buffer("23") });
                });
            });
        });
    }

    @test "should be able to add a property, assign and read it via listener"() {
        let init : WoT.ThingInit = new ThingInitImpl("thing5", "", {});
        return WoTServerTest.WoT.expose(init).then(thing => {
            let initp : WoT.ThingPropertyInit = new ThingPropertyInitImpl("prop1", null);
            // thing.addProperty("prop1", { "type": "number" });
            thing.addProperty(initp);

            let listener = WoTServerTest.server.getListenerFor("/thing5/properties/prop1");
            expect(listener).to.exist;
            listener.should.be.an.instanceOf(listeners.PropertyResourceListener);
            return listener.onWrite({mediaType: undefined, body: new Buffer("42") }).then(() => {
                return thing.getProperty("prop1").then((value) => {
                    value.should.equal(42);
                    return listener.onRead().then((content) => {
                        content.body.should.deep.equal(new Buffer("42"));
                    });
                });
            });
        });
    }

    @test "should be able to add an action and invoke it locally"() {
        let init : WoT.ThingInit = new ThingInitImpl("thing6", "", {});
        return WoTServerTest.WoT.expose(init).then(thing => {
            JSON.stringify
            let inita : WoT.ThingActionInit = new ThingActionInitImpl("action1", JSON.stringify({ "type": "number" }), JSON.stringify({ "type": "number" }));
            thing
            .addAction(inita);

            // console.log("foooooooooooooo");

            // let request : WoT.Request = new RequestImpl("action1");
            // thing.onInvokeAction(request => {
            //     request.data.should.be.a("number");
            //     request.data.should.equal(23);
            // });

            // .onInvokeAction("action1", (param) => {
            //     param.should.be.a("number");
            //     param.should.equal(23);
            //     return 42;
            // })

            // return thing.invokeAction("action1", 23).then((result) => result.should.equal(42));
        })
    }

    // @test "should be able to add an action and invoke it via listener"() {
    //     return WoTServerTest.WoT.createThing("thing7").then(thing => {
    //         thing
    //         .addAction("action1", { "type": "number" }, { "type": "number" })
    //         .onInvokeAction("action1", (param) => {
    //             param.should.be.a("number");
    //             param.should.equal(23);
    //             return 42;
    //         })
            
    //         let listener = WoTServerTest.server.getListenerFor("/thing7/actions/action1");
    //         expect(listener).to.exist;
    //         listener.should.be.an.instanceOf(listeners.ActionResourceListener);
            
    //         return listener
    //         .onInvoke({mediaType: undefined, body: new Buffer("23") })
    //         .then((resBytes => {
    //             resBytes.should.deep.equal({ mediaType: "application/json", body: new Buffer("42") });
    //         }))
    //     })
    // }
}
