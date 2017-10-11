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
 * Basic test suite for TD parsing
 */
import Servient from 'node-wot'
import ExposedThing from 'node-wot'
// import {HttpServer} from "node-wot-protocol-http"
import HttpServer from "../src/http-server"
import {ProtocolServer} from "node-wot" // "node-wot-protocols"


import {ContentCodec} from 'node-wot'
import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import * as TDTools from "node-wot-td-tools";
import * as TDGenerator from "node-wot";
// import * as Helpers from "../src/helpers";
import * as Helpers from 'node-wot'

@suite("TD Generation")
class TDGeneratorTest {
    @test "TD generation test"() {

          let servient: Servient = new Servient();
          let WoT = servient.start();
          // return WoT.createThing("TDGeneratorTest").then((thing) => {

          //   servient.addServer(new HttpServer())
          //   thing.addProperty("prop1", "number");
          //   thing.addAction("act1", "", "string");

            // let td:TDTools.ThingDescription = TDGenerator.generateTD(thing as ExposedThing, servient);

            // expect(td).to.have.property("name").that.equals("TDGeneratorTest");

            // let add =  Helpers.getAddresses()[0];
            // let ser: Array<ProtocolServer>  = servient.getServers();

            // expect(ser).to.be.an('Array').with.length.above(0)
            // expect(td.interaction[0]).to.have.property("name").that.include("prop1");
            // expect(td.interaction[1]).to.have.property("name").that.include("act1");
            // expect(td.interaction[0]).to.have.property("semanticTypes").that.include("Property");
            // expect(td.interaction[1]).to.have.property("semanticTypes").that.include("Action");

            // if(ser[0].getPort()!==-1) {
            //   expect(td.interaction[0].link[0]).to.have.property("mediaType").that.equals("application/json");
            //   expect(td.interaction[0].link[0]).to.have.property("href").that.equals("http://"+add+":"+ser[0].getPort()+"/TDGeneratorTest/properties/prop1");
            //   expect(td.interaction[1].link[0]).to.have.property("mediaType").that.equals("application/json");
            //   expect(td.interaction[1].link[0]).to.have.property("href").that.equals("http://"+add+":"+ser[0].getPort()+"/TDGeneratorTest/actions/act1");

            // }
          // })



    }
}
