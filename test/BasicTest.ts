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
 * Basic test suite to demonstrate test setup
 * uncomment the @skip to see failing tests
 * 
 * h0ru5: there is currently some problem with VSC failing to recognize experimentalDecorators option, it is present in both tsconfigs
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";


// h0ru5: I am commenting this out to take it out of the test runs but leaving the file in as reference guide how to write tests
//@suite("basic tests to verify test setup")
class BasicTest {
    
    @test("should pass when asserts are fine")
    asserts_pass() {
    }
    
    @skip
    @test("should fail when asserts are broken")
    asserts_fail() {
        // Any self-respecting assertion framework should throw
        var error = new Error("Assert failed");
        (<any>error).expected = "expected";
        (<any>error).actual = "to fail";
        throw error;
    }
    
    @test("should pass async tests")
    assert_pass_async(done: Function) {
        setTimeout(() => done(), 1);
    }
    
    @skip
    @test("should fail async when given error")
    assert_fail_async(done: Function) {
        setTimeout(() => done(new Error("Oops...")), 1);
    }
    
    @skip
    @test("should fail async when callback not called")
    @timeout(100)
    assert_fail_async_no_callback(done: Function) {
        // Never called... t/o intentional.
    }
    
    @test("should pass when promise resolved")
    promise_pass_resolved() {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 1);
        });
    }
    
    @skip
    @test("should fail when promise rejected")
    promise_fail_rejected() {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error("Ooopsss...")), 1);
        });
    }
}