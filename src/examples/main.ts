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


'use strict'

import fs = require("fs");
import {Servient} from "../thingweb";
import {DummyClientFactory}  from "../protocols/dummy/dummy-protocol-client";
import ProxyThing from "../proxything";
import ThingDescription from "../td/thingdescription";

import {logger} from "../logger";

/**
 * Servient control for scripts
 * The lifecycle of a script should be. start up Servient
 * Obtain WoT object from servient
 * Use WoT object to Script
 */
class MyServient extends Servient {
    public readConf(): void {
        fs.readFile(".wotconfig", 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            }
            console.log("config:\n");
            console.dir(data);
        });
    }
}

 let srv = new MyServient();

// ...import servers and clients and add them...
 let dcf = new DummyClientFactory();
srv.addClientFactory(dcf);

let wot = srv.start();

console.log("starting servient");

wot.createThing("bla").then((thing) => {
    console.log("there is a thing called " + thing.name);

    thing
        .addAction("wuu")
        .onInvokeAction("wuu",
            () => {
                console.log("Woo was called");
            }
        );

    thing
    .addProperty("bar",{ "type" : "number"})
    .onUpdateProperty("bar",(nV,oV) => {
        "bar changed from " + oV + " to " + nV;
    })
    .setProperty("bar",0)
    .catch(console.error);

    console.log("things are up, now check it");

    let t = srv.getThing("bla");
    console.log(t.getProperty("bar"));
    t.invokeAction("wuu");
});

// client factory tests
let dc = dcf.getClient();
console.log(dcf.getSchemes());
dc.readResource("dummy://foo").then(console.log).catch(console.error);

// console.log();
// console.log(dc.readResource("unknown://foo"));

// async calls
console.log("start async calls...");
for (var i = 0; i < 5; i++) {
    dc.readResource("dummy://foo_" + i).then(function (val) {
        console.log(val);
    }).catch(function (err) {
        logger.error('readResourceAsync error', err.message)
    });
}
logger.info("all async calls started (wait for responses)");


// proxy thing tests
// let servient: Servient, let td: ThingDescription;
let td = new ThingDescription();
td.name = "test";
let pt = new ProxyThing(srv, td);
pt.invokeAction("foo");
