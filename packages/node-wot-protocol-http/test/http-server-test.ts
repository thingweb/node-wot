/**
 * Protocol test suite to test protocol implementations
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import HttpServer from "../src/http-server";
import {AssetResourceListener} from "node-wot"

import * as http from "http";
import * as rp from "request-promise";

@suite("HTTP implementation")
class HttpTest {

    @test "should start and stop a server"() {
        let httpServer = new HttpServer(58080);
        let ret = httpServer.start();

        expect(ret).to.eq(true);
        expect(httpServer.getPort()).to.eq(58080); // from test

        ret = httpServer.stop();

        expect(ret).to.eq(true);
        expect(httpServer.getPort()).to.eq(-1); // from getPort() when not listening
    }

    @test "should change resource from 'off' to 'on' and try to invoke and delete"(done : Function) {
        let httpServer = new HttpServer(0);
        httpServer.addResource("/", new AssetResourceListener("off") );
        let ret = httpServer.start();

        let uri = `http://localhost:${httpServer.getPort()}/`;

        rp.get(uri).then(body => {
                expect(body).to.equal("off");
                rp.put(uri, {body: "on"}).then(body => {
                        expect(body).to.equal("");
                        rp.get(uri).then(body => {
                                expect(body).to.equal("on");
                                rp.post(uri, {body: "toggle"}).then(body => {
                                        expect(body).to.equal("TODO");

                                        ret = httpServer.stop();
                                        done();
                                    });
                            });
                    });
            });
    }

    @test "should cause EADDRINUSE error when already running"(done : Function) {
        let httpServer1 = new HttpServer(0);
        httpServer1.addResource("/", new AssetResourceListener("One") );
        let ret1 = httpServer1.start();

        expect(httpServer1.getPort()).to.be.above(0);

        let httpServer2 = new HttpServer(httpServer1.getPort());
        httpServer2.addResource("/", new AssetResourceListener("Two") );
        let ret2 = httpServer2.start(); // should fail

        expect(ret2).to.eq(false);
        expect(httpServer2.getPort()).to.eq(-1);

        let uri = `http://localhost:${httpServer1.getPort()}/`;

        rp.get(uri).then(body => {
                expect(body).to.equal("One");
        
                ret1 = httpServer1.stop();
                ret2 = httpServer2.stop();

                done();
            });
    }
}

