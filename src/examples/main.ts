'use strict'

import fs = require("fs");
import {Servient}  from "../thingweb";

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

let wot = srv.start();

console.log("staring servient");

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