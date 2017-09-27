/**
 * Protocol test suite to test protocol implementations
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import CoapServer from "../src/coap-server";
import {AssetResourceListener} from "node-wot"

const coap = require("coap");

@suite("CoAP implementation")
class CoapTest {

    @test "should start and stop a server"() {
        let coapServer = new CoapServer(56831);
        let ret = coapServer.start();

        expect(ret).to.eq(true);
        expect(coapServer.getPort()).to.eq(56831); // from test

        ret = coapServer.stop();

        expect(ret).to.eq(true);
        expect(coapServer.getPort()).to.eq(-1); // from getPort() when not listening
    }

    @test "should cause EADDRINUSE error when already running"(done : Function) {
        let coapServer1 = new CoapServer(0); // cannot use 0, since getPort() does not work
        coapServer1.addResource("/", new AssetResourceListener("One") );
        let ret1 = coapServer1.start();

        expect(ret1).to.eq(true);
        expect(coapServer1.getPort()).to.be.above(0); // from server._port, not real socket

        let coapServer2 = new CoapServer(coapServer1.getPort());
        coapServer2.addResource("/", new AssetResourceListener("Two") );
        let ret2 = coapServer2.start(); // should fail, but does not...

        expect(ret2).to.eq(false);
        expect(coapServer2.getPort()).to.eq(-1);

        let req = coap.request({ method: "GET", hostname: "localhost", port: coapServer1.getPort(), path: "/" });
        req.on("response", (res : any) => {
            expect(res.payload.toString()).to.equal("One");

            ret1 = coapServer1.stop();
            ret2 = coapServer2.stop();

            done();
        });
        req.end();
    }
}