/**
 * Protocol test suite to test protocol implementations
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import * as http from "http";
import * as rp from "request-promise";

import { AssetResourceListener } from "@node-wot/core";
import { HttpServer } from "@node-wot/binding-http";
import { CoapServer } from "@node-wot/binding-coap";

const coap = require("coap");

@suite("Multi-protcol implementation")
class ProtocolsTest {

    @test "should work cross-protocol"(done : Function) {
        let httpServer = new HttpServer(0);
        let coapServer = new CoapServer(0);

        let asset = new AssetResourceListener("test");

        httpServer.addResource("/", asset);
        coapServer.addResource("/", asset);
        
        httpServer.start();
        coapServer.start();

        let uri = `http://localhost:${httpServer.getPort()}/`;

        rp.get(uri).then(body => {
            expect(body).to.equal("test");

            let req1 = coap.request({ method: "PUT", hostname: "localhost", port: coapServer.getPort(), path: "/" } );
            req1.on("response", (res1 : any) => {
                expect(res1.code).to.equal("2.04");
                rp.get(uri).then(body => {
                    expect(body).to.equal("by-coap");

                    rp.put(uri, {body: "by-http"}).then(body => {
                        let req2 = coap.request({ method: "GET", hostname: "localhost", port: coapServer.getPort(), path: "/" } );
                        req2.on("response", (res2 : any) => {
                                expect(res2.payload.toString()).to.equal("by-http");

                                httpServer.stop();
                                coapServer.stop();

                                done();
                            });
                        req2.end();
                    });
                });
            });
            req1.write("by-coap");
            req1.end();
        });
    }
}
