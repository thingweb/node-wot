/**
 * Protocol test suite to test protocol implementations
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should, assert } from "chai";
// should must be called to augment all variables
should();

import { ResourceListener, BasicResourceListener, Content, ContentSerdes } from "@node-wot/core";

import CoapServer from "../src/coap-server";
import CoapClient from "../src/coap-client";

class TestResourceListener extends BasicResourceListener implements ResourceListener {

    public referencedVector: any;
    constructor(vector: any) {
        super();
        this.referencedVector = vector;
    }

    public onRead(): Promise<Content> {
        this.referencedVector.expect = "GET";
        return new Promise<Content>(
            (resolve, reject) => resolve({ mediaType: ContentSerdes.DEFAULT, body: new Buffer("TEST") })
        );
    }

    public onWrite(content: Content): Promise<void> {
        this.referencedVector.expect = "PUT";
        return new Promise<void>((resolve, reject) => resolve())
    }

    public onInvoke(content: Content): Promise<Content> {
        this.referencedVector.expect = "POST";
        return new Promise<Content>(
            (resolve, reject) => resolve({ mediaType: ContentSerdes.DEFAULT, body: new Buffer("TEST") })
        );
    }

    public onUnlink(): Promise<void> {
        this.referencedVector.expect = "DELETE";
        return new Promise<void>(
            (resolve, reject) => resolve()
        );
    }
}

@suite("CoAP client implementation")
class CoapClientTest {

    @test async "should apply form information"() {

        var testVector = { expect: "UNSET" }

        let coapServer = new CoapServer(56833);
        coapServer.addResource("/", new TestResourceListener(testVector));

        await coapServer.start();
        expect(coapServer.getPort()).to.equal(56833);

        let client = new CoapClient();
        let representation;

        // read with POST instead of GET
        representation = await client.readResource({
            href: "coap://localhost:56833/",
            "coap:methodCode": 2 // POST
        });
        expect(testVector.expect).to.equal("POST");
        testVector.expect = "UNSET";

        // write with POST instead of PUT
        representation = await client.writeResource({
            href: "coap://localhost:56833/",
            "coap:methodCode": 2 // POST
        }, { mediaType: ContentSerdes.DEFAULT, body: new Buffer("test") });
        expect(testVector.expect).to.equal("POST");
        testVector.expect = "UNSET";

        // invoke with PUT instead of POST
        representation = await client.invokeResource({
            href: "coap://localhost:56833/",
            "coap:methodCode": 3 // PUT
        }, { mediaType: ContentSerdes.DEFAULT, body: new Buffer("test") });
        expect(testVector.expect).to.equal("PUT");
        testVector.expect = "UNSET";

        // invoke with DELETE instead of POST
        representation = await client.invokeResource({
            href: "coap://localhost:56833/",
            "coap:methodCode": 4 // DELETE
        }, { mediaType: ContentSerdes.DEFAULT, body: new Buffer("test") });
        expect(testVector.expect).to.equal("DELETE");
        testVector.expect = "UNSET";

        await coapServer.stop();
    }
}
