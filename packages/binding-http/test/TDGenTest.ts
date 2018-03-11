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
 * Basic test suite for TD parsing
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import Servient from "@node-wot/core";
import ExposedThing from "@node-wot/core";
import { ContentCodec } from "@node-wot/core";
import { ProtocolServer } from "@node-wot/core";
import * as Helpers from "@node-wot/core";

import * as TD from "@node-wot/td-tools";

import HttpServer from "../src/http-server";

@suite("TD Generation")
class TDGeneratorTest {
  @test "TD generation test"() {

    let servient: Servient = new Servient();
    servient.addServer(new HttpServer());
    servient.start().then(WoT => {

      let thing: WoT.ExposedThing = WoT.produce({ name: "TDGeneratorTest" });

      thing.addProperty({
        name: "prop1",
        schema: `{ "type": "number" }`
      });
      thing.addAction({
        name: "act1",
        inputSchema: `{ "type": "string" }`
      });

      let td: TD.Thing = TD.parseTDString(thing.getThingDescription());

      expect(td).to.have.property("name").that.equals("TDGeneratorTest");

      let add = Helpers.getAddresses()[0];
      let ser: Array<ProtocolServer> = servient.getServers();

      expect(ser).to.be.an('Array').with.length.above(0)
      expect(td.interaction[0]).to.have.property("name").that.include("prop1");
      expect(td.interaction[1]).to.have.property("name").that.include("act1");
      expect(td.interaction[0]).to.have.property("semanticType").that.include("Property");
      expect(td.interaction[1]).to.have.property("semanticType").that.include("Action");

      if (ser[0].getPort() !== -1) {
        expect(td.interaction[0].form[0]).to.have.property("mediaType").that.equals("application/json");
        expect(td.interaction[0].form[0]).to.have.property("href").that.equals("http://" + add + ":" + ser[0].getPort() + "/TDGeneratorTest/properties/prop1");
        expect(td.interaction[1].form[0]).to.have.property("mediaType").that.equals("application/json");
        expect(td.interaction[1].form[0]).to.have.property("href").that.equals("http://" + add + ":" + ser[0].getPort() + "/TDGeneratorTest/actions/act1");
      }
    });
  }
}
