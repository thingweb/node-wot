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
 * Basic test suite for helper functions
 * uncomment the @skip to see failing tests
 * 
 * h0ru5: there is currently some problem with VSC failing to recognize experimentalDecorators option, it is present in both tsconfigs
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect } from "chai";

import * as Helpers from "../src/helpers";


@suite("tests to verify the helpers")
class HelperTest {
    
    @test "should extract the http scheme"() {
        let scheme = Helpers.extractScheme("http://blablupp.de")
        expect(scheme).to.eq("http")
    }
    
    @test "should extract https scheme"() {
        let scheme = Helpers.extractScheme("https://blablupp.de")
        expect(scheme).to.eq("https")
    }
    
    @test "should extract scheme when a port is given"() {
        let scheme = Helpers.extractScheme("http://blablupp.de:8080")
        expect(scheme).to.eq("http")
    }

    @test "should extract combined scheme"() {
        let scheme = Helpers.extractScheme("coap+ws://blablupp.de")
        expect(scheme).to.eq("coap+ws")
    }
}