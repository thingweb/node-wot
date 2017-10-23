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

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import ThingDescription from "../src/thing-description";
import * as TDParser from "../src/td-parser";
// import * as AddressHelper from "node-wot-helpers";

/** sample TD json-ld string from the CP page*/
let tdSample1 = `{
  "@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],
  "@type": ["Thing"],
  "name": "MyTemperatureThing",
  "interaction": [
    {
      "@type": ["Property"],
      "name": "temperature",
      "outputData":  { "type": "number" },
      "writable": false,
      "link": [{
        "href" : "coap://mytemp.example.com:5683/temp",
        "mediaType": "application/json"
        }]
    }
  ]
}`;
/** sample TD json-ld string from the CP page*/
let tdSample2 = `{
  "@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],
  "@type": ["Thing"],
  "name": "MyTemperatureThing2",
  "interaction": [
    {
      "@type": ["Property"],
      "name": "temperature",
      "outputData":  { "type": "number" },
      "writable": true,
      "link": [{
        "href" : "coap://mytemp.example.com:5683/temp",
        "mediaType": "application/json"
        }]
    }
  ]
}`;
/** sample TD json-ld string from the CP page*/
let tdSample3 = `{
  "@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],
  "@type": ["Thing"],
  "name": "MyTemperatureThing3",
  "base": "coap://mytemp.example.com:5683/interactions/",
  "interaction": [
    {
      "@type": ["Property"],
      "name": "temperature",
      "outputData":  { "type": "number" },
      "writable": true,
      "link": [{
        "href" : "temp",
        "mediaType": "application/json"
        }]
    },
    {
      "@type": ["Property"],
      "name": "temperature2",
      "outputData": { "type": "number" },
      "writable": false,
      "link": [{
        "href" : "./temp",
        "mediaType": "application/json"
        }]
    },
    {
      "@type": ["Property"],
      "name": "humidity",
      "outputData": { "type": "number" },
      "writable": false,
      "link": [{
        "href" : "/humid",
        "mediaType": "application/json"
        }]
    }
  ]
}`;

@suite("TD parsing/serialising")
class TDParserTest {

    @test "should parse the example from Current Practices"() {
        let td : ThingDescription = TDParser.parseTDString(tdSample1);

        expect(td).to.have.property("context").that.has.lengthOf(1);
        expect(td).to.have.property("semanticType").to.have.lengthOf(1);
        expect(td.semanticType[0]).equals("Thing");
        expect(td).to.have.property("name").that.equals("MyTemperatureThing");
        expect(td).to.not.have.property("base");

        expect(td.interaction).to.have.lengthOf(1);
        expect(td.interaction[0]).to.have.property("semanticTypes").that.contains("Property");
        expect(td.interaction[0]).to.have.property("name").that.equals("temperature");
        expect(td.interaction[0]).to.have.property("pattern").that.equals("Property");
        expect(td.interaction[0]).to.have.property("writable").that.equals(false);

        expect(td.interaction[0].link).to.have.lengthOf(1);
        expect(td.interaction[0].link[0]).to.have.property("mediaType").that.equals("application/json");
        expect(td.interaction[0].link[0]).to.have.property("href").that.equals("coap://mytemp.example.com:5683/temp");
    }

    @test "should parse writable Property"() {
        let td : ThingDescription = TDParser.parseTDString(tdSample2);

        expect(td).to.have.property("context").that.has.lengthOf(1);
        expect(td).to.have.property("semanticType").to.have.lengthOf(1);
        expect(td.semanticType[0]).equals("Thing");
        expect(td).to.have.property("name").that.equals("MyTemperatureThing2");
        expect(td).to.not.have.property("base");

        expect(td.interaction).to.have.lengthOf(1);
        expect(td.interaction[0]).to.have.property("name").that.equals("temperature");
        expect(td.interaction[0]).to.have.property("pattern").that.equals("Property");
        expect(td.interaction[0]).to.have.property("writable").that.equals(true);

        expect(td.interaction[0].link).to.have.lengthOf(1);
        expect(td.interaction[0].link[0]).to.have.property("mediaType").that.equals("application/json");
        expect(td.interaction[0].link[0]).to.have.property("href").that.equals("coap://mytemp.example.com:5683/temp");
    }

    @test "should parse and apply base Property"() {
        let td : ThingDescription = TDParser.parseTDString(tdSample3);

        expect(td).to.have.property("context").that.has.lengthOf(1);
        expect(td).to.have.property("semanticType").to.have.lengthOf(1);
        expect(td.semanticType[0]).equals("Thing");
        expect(td).to.have.property("name").that.equals("MyTemperatureThing3");
        expect(td).to.have.property("base").that.equals("coap://mytemp.example.com:5683/interactions/");

        expect(td.interaction).to.have.lengthOf(3);
        expect(td.interaction[0]).to.have.property("name").that.equals("temperature");
        expect(td.interaction[0]).to.have.property("pattern").that.equals("Property");
        expect(td.interaction[0]).to.have.property("writable").that.equals(true);

        expect(td.interaction[0].link).to.have.lengthOf(1);
        expect(td.interaction[0].link[0]).to.have.property("mediaType").that.equals("application/json");
        expect(td.interaction[0].link[0]).to.have.property("href").that.equals("coap://mytemp.example.com:5683/interactions/temp");

        expect(td.interaction[1]).to.have.property("name").that.equals("temperature2");
        expect(td.interaction[1]).to.have.property("pattern").that.equals("Property");
        expect(td.interaction[1]).to.have.property("writable").that.equals(false);

        expect(td.interaction[1].link).to.have.lengthOf(1);
        expect(td.interaction[1].link[0]).to.have.property("mediaType").that.equals("application/json");
        expect(td.interaction[1].link[0]).to.have.property("href").that.equals("coap://mytemp.example.com:5683/interactions/temp");

        expect(td.interaction[2]).to.have.property("name").that.equals("humidity");
        expect(td.interaction[2]).to.have.property("pattern").that.equals("Property");
        expect(td.interaction[2]).to.have.property("writable").that.equals(false);

        expect(td.interaction[2].link).to.have.lengthOf(1);
        expect(td.interaction[2].link[0]).to.have.property("mediaType").that.equals("application/json");
        expect(td.interaction[2].link[0]).to.have.property("href").that.equals("coap://mytemp.example.com:5683/humid");
    }

    @test "should return same TD in round-trips"() {
        let td1 : ThingDescription = TDParser.parseTDString(tdSample1)
        let newJson1 = TDParser.serializeTD(td1);

        let jsonExpected = JSON.parse(tdSample1);
        let jsonActual = JSON.parse(newJson1);

        expect(jsonActual).to.deep.equal(jsonExpected);

        let td2 : ThingDescription = TDParser.parseTDString(tdSample2)
        let newJson2 = TDParser.serializeTD(td2);

        jsonExpected = JSON.parse(tdSample1);
        jsonActual = JSON.parse(newJson1);

        expect(jsonActual).to.deep.equal(jsonExpected);

        let td3 : ThingDescription = TDParser.parseTDString(tdSample3)
        let newJson3 = TDParser.serializeTD(td3);

        jsonExpected = JSON.parse(tdSample1);
        jsonActual = JSON.parse(newJson1);

        expect(jsonActual).to.deep.equal(jsonExpected);
    }

   
}
