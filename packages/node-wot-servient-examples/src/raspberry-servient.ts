/*
 * W3C Software License
 *
 * Copyright (c) 2017 the thingweb community
 *
 * THIS WORK IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR
 * WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF
 * MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE
 * SOFTWARE OR DOCUMENT WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS,
 * TRADEMARKS OR OTHER RIGHTS.
 *
 * COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR
 * CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENT.
 *
 * The name and trademarks of copyright holders may NOT be used in advertising or
 * publicity pertaining to the work without specific, written prior permission. Title
 * to copyright in this work will at all times remain with copyright holders.
 */


'use strict'

// global W3C WoT Scripting API definitions
import _ from 'node-wot'; // 'wot-typescript-definitions';
// node-wot implementation of W3C WoT Servient 
import {Servient} from 'node-wot';
import {HttpServer} from "node-wot-protocol-http";

// exposed protocols
import {CoapServer} from 'node-wot-protocol-coap';

// tools
const net = require('net');

// the UnicornHat API daemon listens on a Unix socket at /var/run/mysocket
const client = net.createConnection('/var/run/unicornd.socket');
client.on('connect', () => { main(); });
client.on('error', (err: Error) => { console.log('unicornd error: ' + err.message); });
client.on('data', (data: Buffer) => { console.log('unicornd data: ' + data.toString()); });

// local definition
declare interface Color {
  r: number,
  g: number,
  b: number
}

let unicorn: WoT.ExposedThing; // WoT.DynamicThing
let gradient: Array<Color>;
let gradientTimer: any;
let gradIndex: number = 0;
let gradNow: Color;
let gradNext: Color;
let gradVector: Color;

// main logic after connecting to UnicornHat daemon
function main() {

  let servient = new Servient();

  servient.addServer(new HttpServer());
  servient.addServer(new CoapServer());

  // get WoT object for privileged script
  let wot = servient.start();
  console.info('RaspberryServient started');

  let thingInit : WoT.ThingInit;
  thingInit.name = 'unicorn'; 

  wot.expose(thingInit).then(thing => {
    unicorn = thing;
    let thingPropertyInitBrightness : WoT.ThingPropertyInit;
    thingPropertyInitBrightness.name = 'brightness';
    thingPropertyInitBrightness.value = 50;
    // TODO valueType: { type: 'integer', minimum: 0, maximum: 255 }
    let thingPropertyInitColor : WoT.ThingPropertyInit;
    thingPropertyInitColor.name = 'color';
    thingPropertyInitColor.value = { r: 0, g: 0, b: 0 };
  // TODO valueType: type: 'object',
        // properties: {
        //   r: { type: 'integer', minimum: 0, maximum: 255 },
        //   g: { type: 'integer', minimum: 0, maximum: 255 },
        //   b: { type: 'integer', minimum: 0, maximum: 255 }
        // }
    let thingActionInitGradient : WoT.ThingActionInit;
    thingActionInitGradient.name = 'gradient';
     // TODO valueType: {
      //   type: 'array',
      //   items: {
      //     type: 'object',
      //     properties: {
      //       r: { type: 'integer', minimum: 0, maximum: 255 },
      //       g: { type: 'integer', minimum: 0, maximum: 255 },
      //       b: { type: 'integer', minimum: 0, maximum: 255 }
      //     }
      //   },
      //   minItems: 2
      // }
    let thingActionInitCancel : WoT.ThingActionInit;
    thingActionInitCancel.name = 'cancel';
    unicorn
      .addProperty(thingPropertyInitBrightness)
      .addProperty(thingPropertyInitColor)
      .addAction(thingActionInitGradient)
      .addAction(thingActionInitCancel);
    // implementations
    let rhBrightness : WoT.RequestHandler;
    // rhBrightness.name = "brightness";
    rhBrightness.callback.call = (nu, old) => {
      setBrightness(nu);}

    unicorn.onUpdateProperty(rhBrightness);

    // unicorn
    //   .onUpdateProperty('brightness', (nu, old) => {
    //     setBrightness(nu);
    //   })
      // .onUpdateProperty('color', (nu, old) => {
      //   setAll(nu.r, nu.g, nu.b);
      // })
      // .onInvokeAction('gradient', (input: Array<Color>) => {
      //   if (input.length < 2) {
      //     return '{ "minItems": 2 }';
      //   }
      //   unicorn.invokeAction('cancel');

      //   gradient = input;
      //   gradIndex = 0;
      //   gradNow = gradient[0];
      //   gradNext = gradient[1];
      //   gradVector = {
      //     r: (gradNext.r - gradNow.r) / 20,
      //     g: (gradNext.g - gradNow.g) / 20,
      //     b: (gradNext.b - gradNow.b) / 20
      //   };
      //   gradientTimer = setInterval(gradientStep, 50);
      //   return true;
      // })
      // .onInvokeAction('forceColor', (input: Color) => {
      //   unicorn.invokeAction('cancel');
      //   unicorn.setProperty('color', input);
      //   return true;
      // })
      // .onInvokeAction('cancel', (input) => {
      //   if (gradientTimer) {
      //     console.log('>> canceling timer');
      //     clearInterval(gradientTimer);
      //     gradientTimer = null;
      //   }
      // })
      //;
    // initialize
    // unicorn.setProperty('brightness', 50);
    // unicorn.setProperty('color', { r: 0, g: 0, b: 0 });
  // };

  });
}

// helper
function roundColor(color: Color): Color {
  return { r: Math.round(color.r), g: Math.round(color.g), b: Math.round(color.b) };
}

// function gradientStep() {
//   gradNow = {
//     r: (gradNow.r + gradVector.r),
//     g: (gradNow.g + gradVector.g),
//     b: (gradNow.b + gradVector.b)
//   };
//   unicorn.setProperty('color', roundColor(gradNow));
//   if (gradNow.r === gradNext.r && gradNow.g === gradNext.g && gradNow.b === gradNext.b) {
//     gradNow = gradient[gradIndex];
//     gradIndex = ++gradIndex % gradient.length;
//     gradNext = gradient[gradIndex];
//     console.log('> step new index ' + gradIndex);
//     gradVector = {
//       r: (gradNext.r - gradNow.r) / 20,
//       g: (gradNext.g - gradNow.g) / 20,
//       b: (gradNext.b - gradNow.b) / 20
//     };
//   }
// }

function setBrightness(val: number) {
  if (!client) {
    console.log('not connected');
    return;
  }
  client.write(new Buffer([0, val, 3]));
}

function setPixel(x: number, y: number, r: number, g: number, b: number) {
  if (!client) {
    console.log('not connected');
    return;
  }
  client.write(new Buffer([1, x, y, g, r, b]));
}

function show() {
  if (!client) {
    console.log('not connected');
    return;
  }
  client.write(new Buffer([3]));
}

function setAll(r: number, g: number, b: number) {
  if (!client) {
    console.log('not connected');
    return;
  }
  let all = [2];
  for (let i = 0; i < 64; ++i) {
    all.push(g);
    all.push(r);
    all.push(b);
  }
  all.push(3);
  client.write(new Buffer(all));
}
