/**
 * Basic test suite to demonstrate test setup
 * uncomment the @skip to see failing tests
 * 
 * h0ru5: there is currently some problem with VSC failing to recognize experimentalDecorators option, it is present in both tsconfigs
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";

@suite("basic tests to verify test setup")
class Basic {
    
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