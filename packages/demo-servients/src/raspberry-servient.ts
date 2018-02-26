/*
 * W3C Software License
 *
 * Copyright (c) 2018 the thingweb community
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

"use strict";

// global W3C WoT Scripting API definitions
import _ from "@node-wot/core";

// node-wot implementation of W3C WoT Servient 
import { Servient } from "@node-wot/core";
import { HttpServer } from "@node-wot/binding-http";

// exposed protocols
import { CoapServer } from "@node-wot/binding-coap";

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

let unicorn: WoT.ExposedThing;
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
  servient.start().then( WoT => {
  
    console.info("RaspberryServient started");

    let template : WoT.ThingTemplate;
    template.name = "unicorn"; 

    let thing = WoT.produce(template);
    unicorn = thing;

    let thingPropertyInitBrightness : WoT.ThingProperty;
      thingPropertyInitBrightness.name = 'brightness';
      thingPropertyInitBrightness.value = 50;
      thingPropertyInitBrightness.type = `{ type: "integer", minimum: 0, maximum: 255 }`;
      thingPropertyInitBrightness.writable = true;


      let thingPropertyInitColor : WoT.ThingProperty;
      thingPropertyInitColor.name = 'color';
      thingPropertyInitColor.value = { r: 0, g: 0, b: 0 };
      thingPropertyInitColor.type = `{ type: "object",
          field: [
            { name: "r", type: "integer", minimum: 0, maximum: 255 },
            { name: "g", type: "integer", minimum: 0, maximum: 255 },
            { name: "b", type: "integer", minimum: 0, maximum: 255 }
          ]
        }`;
      thingPropertyInitColor.writable = true;


      let thingActionInitGradient : WoT.ThingAction;
      thingActionInitGradient.name = 'gradient';
      thingActionInitGradient.inputDataDescription = `{
          type: "array",
          item: {
            type: "object",
            field: [
              { name: "r", type: "integer", minimum: 0, maximum: 255 },
              { name: "g", type: "integer", minimum: 0, maximum: 255 },
              { name: "b", type: "integer", minimum: 0, maximum: 255 }
            ]
          },
          minItems: 2
        }`;

        
      let thingActionInitForce : WoT.ThingAction;
      thingActionInitForce.name = 'forceColor';
      thingActionInitForce.inputDataDescription = `{ type: "object",
          properties: {
            r: { type: "integer", minimum: 0, maximum: 255 },
            g: { type: "integer", minimum: 0, maximum: 255 },
            b: { type: "integer", minimum: 0, maximum: 255 }
          }
        }`;

      let thingActionInitCancel : WoT.ThingAction;
      thingActionInitCancel.name = 'cancel';

      unicorn
        .addProperty(thingPropertyInitBrightness)
        .setPropertyWriteHandler(
          (value : any) => {
            return new Promise((resolve, reject) => {
                setBrightness(value);
                resolve();
            });
          },
          thingPropertyInitBrightness.name
        )
        .addProperty(thingPropertyInitColor)
        .setPropertyWriteHandler(
          (value : any) => {
            return new Promise((resolve, reject) => {
                setAll(value.r, value.g, value.b);
                resolve();
            });
          },
          thingPropertyInitColor.name
        )
        .addAction(thingActionInitGradient)
        .setActionHandler(
          (input: Array<Color>) => {
            return new Promise((resolve, reject) => {
              if (input.length < 2) {
                return '{ "minItems": 2 }';
              }
              unicorn.invokeAction('cancel');
    
              gradient = input;
              gradIndex = 0;
              gradNow = gradient[0];
              gradNext = gradient[1];
              gradVector = {
                r: (gradNext.r - gradNow.r) / 20,
                g: (gradNext.g - gradNow.g) / 20,
                b: (gradNext.b - gradNow.b) / 20
              };
              gradientTimer = setInterval(gradientStep, 50);
              resolve(true);
            });
          },
          thingActionInitGradient.name
        )
        .addAction(thingActionInitForce)
        .setActionHandler(
          (input: Color) => {
            return new Promise((resolve, reject) => {
                unicorn.invokeAction('cancel');
                unicorn.writeProperty('color', input);
                resolve();
            });
          },
          thingActionInitForce.name
        )
        .addAction(thingActionInitCancel)
        .setActionHandler(
          () => {
            return new Promise((resolve, reject) => {
              if (gradientTimer) {
                console.log('>> canceling timer');
                clearInterval(gradientTimer);
                gradientTimer = null;
              }
              resolve();
            });
          },
          thingActionInitCancel.name
        );
  });
}

// helper
function roundColor(color: Color): Color {
  return { r: Math.round(color.r), g: Math.round(color.g), b: Math.round(color.b) };
}

function gradientStep() {
  gradNow = {
    r: (gradNow.r + gradVector.r),
    g: (gradNow.g + gradVector.g),
    b: (gradNow.b + gradVector.b)
  };
  unicorn.writeProperty('color', roundColor(gradNow));
  if (gradNow.r === gradNext.r && gradNow.g === gradNext.g && gradNow.b === gradNext.b) {
    gradNow = gradient[gradIndex];
    gradIndex = ++gradIndex % gradient.length;
    gradNext = gradient[gradIndex];
    console.log('> step new index ' + gradIndex);
    gradVector = {
      r: (gradNext.r - gradNow.r) / 20,
      g: (gradNext.g - gradNow.g) / 20,
      b: (gradNext.b - gradNow.b) / 20
    };
  }
}

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
