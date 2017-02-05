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

import Servient from "../servient";
import HttpServer from "../protocols/http/http-server";
import CoapServer from "../protocols/coap/coap-server";
import logger from "../logger";

const net = require('net');

// This server listens on a Unix socket at /var/run/mysocket
const client = net.createConnection('/var/run/unicornd.socket');
client.on('connect', () => {
    main();

});
client.on('error', (err : Error) => { console.log('Error: ' + err.message);});
client.on('data', (data : Buffer) => { console.log('Data: ' + data.toString());});
client.on('drain', ()=>{ console.log('Bytes written: ' + client.bytesWritten);});


function main() {

    let srv = new Servient();
    logger.info("created servient");

    srv.addServer(new HttpServer());
    //srv.addServer(new CoapServer());

    logger.info("added servers");

    let WoT = srv.start();
    logger.info("started servient")

    WoT.createThing("unicorn").then(unicorn => {
        unicorn
            .addProperty("brightness", { type: "integer", minimum: 0, maximum: 255 })
            .addProperty("color", { type: "object",
                                    properties: {
                                        r: { type: "integer", minimum: 0, maximum: 255 },
                                        g: { type: "integer", minimum: 0, maximum: 255 },
                                        b: { type: "integer", minimum: 0, maximum: 255 }
                                    }})
            .addAction("gradient");
        unicorn.onUpdateProperty("brightness", (nu, old) => {
            setBrightness(nu);
        });
        unicorn.onUpdateProperty("color", (nu, old) => {
            setAll(nu.r, nu.g, nu.b);
        });
        unicorn.setProperty("brightness", 0);
        unicorn.setProperty("color", {r:0,g:0,b:0});
    });
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
