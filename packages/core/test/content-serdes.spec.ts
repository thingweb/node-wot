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
 * Tests for ContentSerdes functionality
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import ContentSerdes from "../src/content-serdes";
import {ContentCodec} from "../src/content-serdes";

let checkJsonToJs = (value : any) : void => {
        let jsonBuffer = new Buffer(JSON.stringify(value));
        expect(ContentSerdes.contentToValue({ mediaType: "application/json", body: jsonBuffer })).to.deep.equal(value);
}

let checkJsToJson = (value: any) : void => {
        let jsonContent = ContentSerdes.valueToContent(value)
        let reparsed = JSON.parse(jsonContent.body.toString());
        expect(reparsed).to.deep.equal(value);
}

/** Hodor will always return the String "Hodor" */
class HodorCodec implements ContentCodec {
    getMediaType() : string { return "text/hodor"; }
    bytesToValue(bytes : Buffer) : any { return "Hodor"; }
    valueToBytes(value : any) : Buffer { return new Buffer("Hodor"); }
}

@suite("testing JSON codec")
class SerdesTests {

    @test "JSON to value"() {
        checkJsonToJs(42)
        checkJsonToJs("Hallo")
        checkJsonToJs(null)
        checkJsonToJs({"foo" : "bar"})
        checkJsonToJs({"answer" : 42})
        checkJsonToJs({"pi" : 3.14})
    }

    @test "value to JSON"() {
        checkJsToJson(42)
        checkJsToJson("Hallo")
        checkJsToJson(null)
        checkJsToJson({"foo" : "bar"})
        checkJsToJson({"answer" : 42})
        checkJsToJson({"pi" : 3.14})
    }
}

@suite("adding new codec")
class SerdesCodecTests {

    static before() {
        ContentSerdes.addCodec(new HodorCodec())
    }

    static after() {
    }

    @test "new codec should serialize"() {
        ContentSerdes.valueToContent("The meaning of Life", "text/hodor").body.toString().should.equal("Hodor")
    }

    @test "new codec should deserialize"() {
        let buffer = new Buffer("Some actual meaningful stuff")
        ContentSerdes.contentToValue({ mediaType: "text/hodor", body: buffer }).should.deep.equal("Hodor")
    }
}