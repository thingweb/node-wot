/**
 * Basic test suite to demonstrate test setup
 * uncomment the @skip to see failing tests
 * 
 * h0ru5: there is currently some problem with VSC failing to recognize experimentalDecorators option, it is present in both tsconfigs
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import * as Helpers from '../src/helpers'
import {expect} from 'chai'

@suite("tests to verify the helpers")
class HelperTest {
    
    @test("should extract the http scheme")
    simple_http() {
        let scheme = Helpers.extractScheme("http://blablupp.de")
        expect(scheme).to.eq("http")
    }
    
    @test("should extract https scheme")
    simple_https() {
        let scheme = Helpers.extractScheme("https://blablupp.de")
        expect(scheme).to.eq("https")
    }
    
    @test("should extract scheme when a port is given")
    http_with_port() {
        let scheme = Helpers.extractScheme("http://blablupp.de:8080")
        expect(scheme).to.eq("http")
    }

    @test("should extract combined scheme")
    combined_scheme() {
        let scheme = Helpers.extractScheme("coap+ws://blablupp.de")
        expect(scheme).to.eq("coap+ws")
    }
}