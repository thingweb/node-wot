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
/// <reference path="../src/protocols/protocol-client.ts"  />

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
import { logger } from "../src/logger";

import Servient from '../src/servient'

class TrapClient implements ProtocolClient {

    private trap: (any) => any

    public setTrap(callback: (any) => any) {
        this.trap = callback
    }

    public readResource(uri: string): Promise<any> {
        return Promise.resolve(this.trap(uri))
    }

    public writeResource(uri: string, payload: any): Promise<any> {
        return Promise.resolve(this.trap({ 'uri': uri, 'payload': payload }))
    }

    public invokeResource(uri: String, payload: any): Promise<any> {
        return Promise.resolve(this.trap({ 'uri': uri, 'payload': payload }))
    }

    public unlinkResource(uri: string): Promise<any> {
        return Promise.resolve(this.trap(uri))
    }

    public start(): boolean {
        return true;
    }

    public stop(): boolean {
        return true;
    }
}

class TrapClientFactory implements ProtocolClientFactory {
    client = new TrapClient();

    public setTrap(callback: (any) => any) {
        this.client.setTrap(callback)
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

    public getSchemes(): Array<string> {
        return ["test"];
    }
}

let myThingDesc = {
    "@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],
    "@type": "Thing",
    "name": "aThing",
    "interactions": [
        {
            "@type": ["Property"],
            "name": "aProperty",
            "outputData":
            { "valueType": { "type": "number" } },
            "writable": false,
            "links": [
                { "href": "test://host/athing/properties/aproperty", "mediaType": "application/json" }
            ]
        },
        {
            "@type": ["Action"],
            "name": "anAction",
            "outputData":
            { "valueType": { "type": "number" } },
            "inputData":
            { "valueType": { "type": "number" } },
            "links": [
                { "href": "test://host/athing/actions/anaction", "mediaType": "application/json" }
            ]
        }

    ]
}

@only
@suite("client flow of servient")
class ServientClient {

    servient: Servient;
    clientFactory: TrapClientFactory;
    WoT: WoT.WoTFactory;

    before() {
        this.servient = new Servient()
        this.clientFactory = new TrapClientFactory();
        this.servient.addClientFactory(this.clientFactory);
        this.WoT = this.servient.start();
        logger.info("starting test suite")
    }

    after() {
        logger.info("finishing up")
        this.servient.shutdown()
    }

    @test "read a value"(done) {
        logger.info("preparing test")
        //let the client return 42
        this.clientFactory.setTrap((uri) => 42)

        logger.info("running test")
        this.WoT.consumeDescription(myThingDesc)
            .then((thing) => {
                expect(thing).not.to.be.null
                thing.name.should.equal("aThing")
                return thing.getProperty("aProperty")
            })
            .then((value) => {
                expect(value).not.to.be.null
                expect(value).to.equal(42)
                value.should.equal(42)
                done()
            })
            .catch(err => { throw err })
    }
}