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
 * Tests for ContentSerdes functionality
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should } from "chai";
// should must be called to augment all variables
should();

import ContentSerdes from '../src/types/content-serdes'
import {ContentCodec} from '../src/types/content-serdes'

let checkJsonToJs = (value : any) : void => {
        let jsonBuffer = new Buffer(JSON.stringify(value));
        expect(ContentSerdes.bytesToValue(jsonBuffer)).to.deep.equal(value);
}

let checkJsToJson = (value: any) : void => {
        let jsonBuffer = ContentSerdes.valueToBytes(value)
        let reparsed = JSON.parse(jsonBuffer.toString());
        expect(reparsed).to.deep.equal(value);
}

/** Hodor will always return the String 'Hodor' */
class HodorCodec implements ContentCodec {
    getMediaType() : string {return "text/hodor"}
    bytesToValue(bytes : Buffer) : any { return "Hodor" }
    valueToBytes(value : any) : Buffer { return new Buffer("Hodor") }
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

    @test "new Codec should serialize"() {
        ContentSerdes.valueToBytes("The meaning of Life","text/hodor").toString().should.equal("Hodor")
    }

    @test "new codec should deserialize"() {
        let buffer = new Buffer("Some actual meaningful stuff")
        ContentSerdes.bytesToValue(buffer,"text/hodor").should.deep.equal("Hodor")
    }
}