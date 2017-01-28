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

// for level only - use console for output
import logger from "../logger";
logger.level = "silly";

logger.info("INFO");
logger.debug("DEBUG");
logger.silly("SILLY");

let test = "Testing";

console.log(test.slice(-1));
console.log(test.slice(1));

let servient = new Servient();

servient.addClientFactory(new HttpClientFactory());

console.log("Starting servient");
let wot = servient.start();

wot.consumeDescriptionUri("http://people.inf.ethz.ch/mkovatsc/test/thing/td.jsonld").then( (thing) => {
        console.log(thing.name);
    })
    .catch( (err) => console.error(err) );