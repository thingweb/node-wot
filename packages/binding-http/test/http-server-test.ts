/**
 * Protocol test suite to test protocol implementations
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should, assert } from "chai";
// should must be called to augment all variables
should();

import * as http from "http";
import * as rp from "request-promise";

import { AssetResourceListener } from "@node-wot/core";

import HttpServer from "../src/http-server";

@suite("HTTP server implementation")
class HttpServerTest {

  @test async "should start and stop a server"() {
    let httpServer = new HttpServer(58080);

    await httpServer.start();
    expect(httpServer.getPort()).to.eq(58080); // from test

    await httpServer.stop();
    expect(httpServer.getPort()).to.eq(-1); // from getPort() when not listening
  }

  @test async "should change resource from 'off' to 'on' and try to invoke and delete"() {
    let httpServer = new HttpServer(0);
    httpServer.addResource("/", new AssetResourceListener("off") );

    await httpServer.start();

    let uri = `http://localhost:${httpServer.getPort()}/`;

    rp.get(uri).then(body => {
      expect(body).to.equal("off");
      rp.put(uri, {body: "on"}).then(body => {
        expect(body).to.equal("");
        rp.get(uri).then(body => {
          expect(body).to.equal("on");
          rp.post(uri, {body: "toggle"}).then(async body => {
            expect(body).to.equal("TODO");
            await httpServer.stop();
          });
        });
      });
    });
  }

  @test async "should cause EADDRINUSE error when already running"() {
    let httpServer1 = new HttpServer(0);
    httpServer1.addResource("/", new AssetResourceListener("One") );

    await httpServer1.start();
    expect(httpServer1.getPort()).to.be.above(0);

    let httpServer2 = new HttpServer(httpServer1.getPort());
    httpServer2.addResource("/", new AssetResourceListener("Two") );

    try {
      await httpServer2.start(); // should fail
    } catch(err) { assert(true) };

    //expect(ret2).to.eq(false);
    expect(httpServer2.getPort()).to.eq(-1);

    let uri = `http://localhost:${httpServer1.getPort()}/`;

    rp.get(uri).then(async body => {
      expect(body).to.equal("One");

      await httpServer1.stop();
      await httpServer2.stop();
    });
  }
}
