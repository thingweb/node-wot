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

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import ThingDescription from "../src/td/thing-description";
import * as TDParser from "../src/td/td-parser";

import logger from "../src/logger";
logger.level = "silly";

/** sample TD json-ld string from the CP page*/
let tdSample = `{
  "@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],
  "@type": "Thing",
  "name": "MyTemperatureThing",
  "interactions": [
    {
      "@type": ["Property"],
      "name": "temperature",
      "outputData": {"valueType": { "type": "number" }},
      "writable": false,
      "links": [{
        "href" : "coap://mytemp.example.com:5683/temp",
        "mediaType": "application/json"
        }]
    }
  ]
}`;

@suite("TD parsing/serialising")
class TDParserTest {

    @test "should parse the example from Current Practices"() {
        let td : ThingDescription = TDParser.parseTDString(tdSample)

        expect(td).have.property("context").that.has.lengthOf(1);
        expect(td).have.property("semanticType").that.equals("Thing");
        expect(td).have.property("name").that.equals("MyTemperatureThing");
        expect(td).to.not.have.property("base");
        
        expect(td.interactions).to.have.lengthOf(1);
        expect(td.interactions[0]).to.have.property("name").that.equals("temperature");
        expect(td.interactions[0]).to.have.property("pattern").that.equals("Property");
        expect(td.interactions[0]).to.have.property("writable").that.equals(false);

        expect(td.interactions[0].links).to.have.lengthOf(1);
        expect(td.interactions[0].links[0]).to.have.property("mediaType").that.equals("application/json");
        expect(td.interactions[0].links[0]).to.have.property("href").that.equals("coap://mytemp.example.com:5683/temp");
    }

    @skip //TODO #8 test is failing because of writable
    @test "should return same TD in round-trip"() {
        let td : ThingDescription = TDParser.parseTDString(tdSample)
        let newJson = TDParser.serializeTD(td);

        let jsonExpected = JSON.parse(tdSample);
        let jsonActual = JSON.parse(newJson);

        expect(jsonActual).to.deep.equal(jsonExpected);
    }
}
