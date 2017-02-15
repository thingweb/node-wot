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
 * Basic test suite for TD parsing
 */
import Servient from '../src/servient'
import ExposedThing from '../src/exposed-thing'
import HttpServer from "node-wot-protocols-http-server"

import {ContentCodec} from 'node-wot-content-serdes'
import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import TDTools from "node-wot-td-parser";
import * as TDGenerator from "../src/td-generator";
import AddressHelper from "node-wot-helpers";

@suite("TD Generation")
class TDGeneratorTest {

    @test "TD generation test"() {

          let servient: Servient = new Servient();
          let WoT = servient.start();
          return WoT.createThing("TDGeneratorTest").then((thing) => {

            servient.addServer(new HttpServer())
            thing.addProperty("prop1", "number");
            thing.addAction("act1", "", "string");

            let td:TDTools.ThingDescription = TDGenerator.generateTD(thing as ExposedThing, servient);

            expect(td).to.have.property("name").that.equals("TDGeneratorTest");

            let add =  AddressHelper.getAddresses()[0];
            let ser: Array<ProtocolServer>  = servient.getServers();

            expect(ser).to.be.an('Array').with.length.above(0)
            expect(td.interactions[0]).to.have.property("name").that.include("prop1");
            expect(td.interactions[1]).to.have.property("name").that.include("act1");
            expect(td.interactions[0]).to.have.property("semanticTypes").that.include("Property");
            expect(td.interactions[1]).to.have.property("semanticTypes").that.include("Action");

            if(ser[0].getPort()!==-1) {
              expect(td.interactions[0].links[0]).to.have.property("mediaType").that.equals("application/json");
              expect(td.interactions[0].links[0]).to.have.property("href").that.equals("http://"+add+":"+ser[0].getPort()+"/TDGeneratorTest/properties/prop1");
              expect(td.interactions[1].links[0]).to.have.property("mediaType").that.equals("application/json");
              expect(td.interactions[1].links[0]).to.have.property("href").that.equals("http://"+add+":"+ser[0].getPort()+"/TDGeneratorTest/actions/act1");

            }
          })



    }
}
