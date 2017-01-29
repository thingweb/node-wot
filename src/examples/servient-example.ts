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

import Servient from "../servient";
import HttpClientFactory from "../protocols/http/http-client-factory";
import CoapClientFactory from "../protocols/coap/coap-client-factory";

import ThingDescription from "../td/thing-description";
import * as TD from "../td/thing-description";

const async = require("async");

// for level only - use console for output
import logger from "../logger";
logger.level = "silly";

logger.info("INFO");
logger.debug("DEBUG");
logger.silly("SILLY");

console.log(`\n# Setting up Servient with HTTP and CoAP\n`);

let servient = new Servient();

servient.addClientFactory(new HttpClientFactory());
servient.addClientFactory(new CoapClientFactory());

console.log("Starting servient");
let wot = servient.start();

async.series([
    (next : Function) => {

        console.log(`\n# Consuming Thing over HTTP\n`);

        wot.consumeDescriptionUri("http://people.inf.ethz.ch/mkovatsc/test/thing/td.jsonld").then( (thing) => {
                console.log(`### Thing name: ${thing.name}`);
                thing.getProperty("myProp").then( (res) => {
                    console.log(`### myProp value: ${res}`);
                    thing.setProperty("myProp", "4711").then( (res) => {
                        console.log(`### myProp set successfully`);
                        thing.getProperty("myProp").then( (res) => {
                            console.log(`### myProp value: ${res}`);
                            thing.invokeAction("myAction", "").then( (res) => {
                                console.log(`### myAction result: ${res}`);
                                next();
                            }).catch( (err) => console.error(err) );
                        }).catch( (err) => console.error(err) );
                    }).catch( (err) => console.error(err) );
                }).catch( (err) => console.error(err) );
            }).catch( (err) => console.error(err) );
    },
    (next : Function) => {

        console.log(`\n# Consuming Thing over CoAP\n`);

        let td = {
            "@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],
            "@type": "Thing",
            "name": "PlugtestServer",
            "interactions": [
                {
                    "@type": ["Property"],
                    "name": "coapProp",
                    "outputData": { "valueType": { "type": "string" } },
                    "writable": false,
                    "links": [
                        { "href": "coap://californium.eclipse.org:5683/path/sub1", "mediaType": "application/json" }
                    ]
                },
                {
                    "@type": ["Action"],
                    "name": "coapAction",
                    "outputData": { "valueType": { "type": "string" } },
                    "inputData": { "valueType": { "type": "string" } },
                    "links": [
                        { "href": "coap://californium.eclipse.org:5683/large-post", "mediaType": "application/json" }
                    ]
                }

            ]
        };

        wot.consumeDescription(td).then( (thing) => {
                console.log(`### Thing name: ${thing.name}`);
                thing.getProperty("coapProp").then( (res) => {
                    console.log(`### coapProp value: ${res}`);
                    thing.setProperty("coapProp", "4711").then( (res) => {
                        console.log(`### coapProp set successfully`);
                        thing.getProperty("coapProp").then( (res) => {
                            console.log(`### coapProp value: ${res}`);
                            thing.invokeAction("coapAction", "lower").then( (res) => {
                                console.log(`### coapAction result: ${res}`);
                                next();
                            }).catch( (err) => console.error(err) );
                        }).catch( (err) => console.error(err) );
                    }).catch( (err) => console.error(err) );
                }).catch( (err) => console.error(err) );
            }).catch( (err) => console.error(err) );
    }
]);
