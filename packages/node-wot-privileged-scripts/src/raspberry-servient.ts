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


"use strict"

// global W3C WoT Scripting API definitions
import _ from "wot-typescript-definitions";
// node-wot implementation of W3C WoT Servient 
import Servient from "node-wot-servient";
// exposed protocols
import HttpServer from "node-wot-protocols-http-server";
import CoapServer from "node-wot-protocols-coap-server";
// tools
import logger from "node-wot-logger";
const net = require('net');

// the UnicornHat API daemon listens on a Unix socket at /var/run/mysocket
const client = net.createConnection('/var/run/unicornd.socket');
client.on('connect', () => { main(); });
client.on('error', (err : Error) => { console.log('unicornd error: ' + err.message);});
client.on('data', (data : Buffer) => { console.log('unicornd data: ' + data.toString());});

// local definition
declare interface Color {
    r : number,
    g : number,
    b : number
}

var unicorn : WoT.DynamicThing;
var gradient : Array<Color>;
var gradientTimer : any;
var gradIndex : number = 0;
var gradNow : Color;
var gradNext : Color;
var gradVector : Color;

// main logic after connecting to UnicornHat daemon
function main() {

    let servient = new Servient();
    logger.info("created servient");

    servient.addServer(new HttpServer());
    servient.addServer(new CoapServer());
    logger.info("added servers");

    // get WoT object for privileged script
    let WoT = servient.start();
    logger.info("started servient")

    WoT.createThing("unicorn").then(thing => {
        unicorn = thing;
        unicorn
            .addProperty("brightness", { type: "integer", minimum: 0, maximum: 255 })
            .addProperty("color", { type: "object",
                                    properties: {
                                        r: { type: "integer", minimum: 0, maximum: 255 },
                                        g: { type: "integer", minimum: 0, maximum: 255 },
                                        b: { type: "integer", minimum: 0, maximum: 255 }
                                    }})
            .addAction("gradient", { type: "array",
                                     items: { type: "object",
                                        properties: {
                                            r: { type: "integer", minimum: 0, maximum: 255 },
                                            g: { type: "integer", minimum: 0, maximum: 255 },
                                            b: { type: "integer", minimum: 0, maximum: 255 }
                                        }
                                     },
                                     minItems: 2 })
            .addAction("forceColor", { type: "object",
                                       properties: {
                                           r: { type: "integer", minimum: 0, maximum: 255 },
                                           g: { type: "integer", minimum: 0, maximum: 255 },
                                           b: { type: "integer", minimum: 0, maximum: 255 }
                                       }})
            .addAction("cancel");
        // implementations
        unicorn
            .onUpdateProperty("brightness", (nu, old) => {
                setBrightness(nu);
            })
            .onUpdateProperty("color", (nu, old) => {
                setAll(nu.r, nu.g, nu.b);
            })
            .onInvokeAction("gradient", (input : Array<Color>) => {
                if (input.length<2) return "{ \"minItems\": 2 }";

                unicorn.invokeAction("cancel");

                gradient = input;
                gradIndex = 0;
                gradNow = gradient[0];
                gradNext = gradient[1];
                gradVector = {
                    r: (gradNext.r - gradNow.r)/20,
                    g: (gradNext.g - gradNow.g)/20,
                    b: (gradNext.b - gradNow.b)/20
                };
                gradientTimer = setInterval(gradientStep, 50);
                return true;
            })
            .onInvokeAction("forceColor", (input : Color) => {
                unicorn.invokeAction("cancel");
                unicorn.setProperty("color", input);
                return true;
            })
            .onInvokeAction("cancel", (input) => {
                if (gradientTimer) {
                    console.log(">> canceling timer");
                    clearInterval(gradientTimer);
                    gradientTimer = null;
                }
            });
        // initialize
        unicorn.setProperty("brightness", 50);
        unicorn.setProperty("color", {r:0,g:0,b:0});
    });
}

// helper
function roundColor(color : Color) : Color {
    return { r: Math.round(color.r), g: Math.round(color.g), b: Math.round(color.b) };
}

function gradientStep() {
    gradNow = {
            r: (gradNow.r + gradVector.r),
            g: (gradNow.g + gradVector.g),
            b: (gradNow.b + gradVector.b)
        };
    unicorn.setProperty("color", roundColor(gradNow));
    if (gradNow.r===gradNext.r && gradNow.g===gradNext.g && gradNow.b===gradNext.b) {
        gradNow = gradient[gradIndex];
        gradIndex = ++gradIndex % gradient.length;
        gradNext = gradient[gradIndex];
        console.log("> step new index " + gradIndex);
        gradVector = {
                r: (gradNext.r - gradNow.r)/20,
                g: (gradNext.g - gradNow.g)/20,
                b: (gradNext.b - gradNow.b)/20
            };
    }
}

function setBrightness(val : number) {
    if (!client) {
        console.log('not connected');
        return;
    }
    client.write(new Buffer([0,val,3]));
}

function setPixel(x : number, y : number, r : number, g : number, b : number) {
    if (!client) {
        console.log('not connected');
        return;
    }
    client.write(new Buffer([1,x,y,g,r,b]));
}

function show() {
    if (!client) {
        console.log('not connected');
        return;
    }
    client.write(new Buffer([3]));
}

function setAll(r : number, g : number, b : number) {
    if (!client) {
        console.log('not connected');
        return;
    }
    let all = [2];
    for (let i=0;i<64;++i) {
        all.push(g);
        all.push(r);
        all.push(b);
    }
    all.push(3);
    client.write(new Buffer(all));
}
