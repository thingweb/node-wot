/**
 * Protocol test suite to test protocol implementations
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
import { logger } from "../src/logger";

import HttpServer from "../src/protocols/http/http-server";
import AssetResourceListener from "../src/resource-listeners/asset-resource-listener";

import * as http from "http"
import * as rp from "request-promise"

logger.level = "debug";

@suite("tests to verify protocol implementations")
class ProtocolsTest {

    @test("should start an http server")
    http_start_stop() {
        let httpServer = new HttpServer();
        let ret = httpServer.start();

        expect(ret).to.eq(true);
        expect(httpServer.getPort()).to.eq(8080); // from server.address()

        ret = httpServer.stop();

        expect(ret).to.eq(true);
        expect(httpServer.getPort()).to.eq(-1);
    }

    @test("should change resource from 'off' to 'on' and try to invoke and delete")
    http_resource(done : Function) {
        let httpServer = new HttpServer();
        httpServer.addResource("/", new AssetResourceListener("off") );
        let ret = httpServer.start();

        let uri = "http://localhost:" + httpServer.getPort() + "/";

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
    
    @test("should cause EADDRINUSE error")
    http_conflicting_port(done : Function) {
        let httpServer1 = new HttpServer(0);
        httpServer1.addResource("/", new AssetResourceListener("One") );
        let ret1 = httpServer1.start();

        let httpServer2 = new HttpServer(httpServer1.getPort());
        httpServer2.addResource("/", new AssetResourceListener("Two") );
        let ret2 = httpServer2.start(); // should fail
        expect(ret2).to.eq(false);
        expect(httpServer2.getPort()).to.eq(-1);

        let uri = "http://localhost:" + httpServer1.getPort() + "/";

        rp.get(uri).then(body => {
                expect(body).to.equal("One");
        
                ret1 = httpServer1.stop();
                ret2 = httpServer2.stop();

                done();
            });
    }

}
