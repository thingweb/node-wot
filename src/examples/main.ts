'use strict'

import fs = require("fs");
import {Servient} from "../thingweb";
import {DummyClientFactory}  from "../protocols/dummy/dummy-protocol-client";

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
        });
    
    thing
    .addProperty("bar",{ "type" : "number"})
    .onUpdateProperty("bar",(nV,oV) => {
        "bar changed from " + oV + " to " + nV;
    })
    .setProperty("bar",0);

    console.log("things are up, now check it");
});

// client factory tests
let dc = dcf.getClient();
console.log(dc.getSchemes());
console.log(dc.readResource("dummy://foo"));
console.log(dc.readResource("unknown://foo"));

// async calls
console.log("start async calls...");
for (var i = 0; i < 5; i++) {
    dc.readResourceAsync("dummy://foo_" + i).then(function (val) {
        console.log(val);
    }).catch(function (err) {
        console.log('readResourceAsync error', err.message)
    });
}
console.log("all async calls started (wait for responses)");

// let t = srv.getThing("bla");
// console.log(t.getProperty("bar"));