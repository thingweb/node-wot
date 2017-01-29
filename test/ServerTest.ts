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

/**
 * Basic test suite to demonstrate test setup
 * uncomment the @skip to see failing tests
 * 
 * h0ru5: there is currently some problem with VSC failing to recognize experimentalDecorators option, it is present in both tsconfigs
 */
/// <reference path="../src/protocols/protocol-server.ts"  />

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import logger from '../src/logger'
import Servient from '../src/servient'


// implement a testserver to mock a server
class TestProtocolServer implements ProtocolServer {
    private listeners: Map<string, ResourceListener> = new Map();

    getListenerFor(path: string): ResourceListener {
        return this.listeners.get(path);
    }

    addResource(path: string, res: ResourceListener): boolean {
        if (this.listeners.has(path)) return false;
        this.listeners.set(path, res)
    }

    removeResourceListener(path: string): boolean {
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
        this.servient = new Servient()
        this.server = new TestProtocolServer();
        this.servient.addServer(this.server)
        this.WoT = this.servient.start();
        logger.debug("starting test suite")
    }

    static after() {
        logger.debug("finishing test suite")
        this.servient.shutdown()
    }

    @test "should be able to add a thing"() {
        return WoTServerTest.WoT.createThing("myThing").then(thing => {
            expect(thing).to.exist
            expect(thing).to.have.property("name", "myThing")
        })
    }

    @test "should be able to add a property, read it and write it locally"() {
        return WoTServerTest.WoT.createThing("otherthing").then(thing => {
            return thing
                .addProperty("number", { "valueType": "number" })
                .setProperty("number", 5)
                .then(value => {
                    expect(value).to.equal(5)
                })
                .then(() => thing.getProperty("number"))
                .then(value => {
                    expect(value).to.equal(5)
                })
        })
    }

    @test "should be able to add a property, and a listener should exist"() {
        return WoTServerTest.WoT.createThing("thing3").then(thing => {
            thing.addProperty("prop1", { "valueType": "number" })
            let listener = WoTServerTest.server.getListenerFor("thing3/properties/prop1");
            expect(listener).to.exist
        })
    }
}