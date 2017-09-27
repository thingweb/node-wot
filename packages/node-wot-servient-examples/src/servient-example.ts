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

import Servient from 'node-wot';
import {HttpClientFactory} from "node-wot-protocol-http";
import {CoapClientFactory} from "node-wot-protocol-coap";
import {HttpServer} from "node-wot-protocol-http";
import {CoapServer} from "node-wot-protocol-coap";

import {ThingDescription} from 'node-wot-td-tools';
import * as TD from 'node-wot-td-tools';

const async = require('async');

// for level only - use console for output
// import logger from '../../logger';
// logger.level = 'silly';
// 
// logger.info('INFO');
// logger.debug('DEBUG');
// logger.silly('SILLY');

console.log(`\n# Setting up Servient with HTTP and CoAP\n`);

let servient = new Servient();

servient.addClientFactory(new HttpClientFactory());
servient.addClientFactory(new CoapClientFactory());

console.log('Starting servient');
let wot = servient.start();

async.series([
  (next: Function) => {

    console.log(`\n# Consuming Thing over HTTP\n`);

    wot.consumeDescriptionUri('http://people.inf.ethz.ch/mkovatsc/test/thing/td.jsonld').then((thing) => {
      console.log(`### Thing name: ${thing.name}`);
      thing.getProperty('myProp').then((res) => {
        console.log(`### myProp value: ${res}`);
        thing.setProperty('myProp', '4711').then((res) => {
          console.log(`### myProp set successfully`);
          thing.getProperty('myProp').then((res) => {
            console.log(`### myProp value: ${res}`);
            thing.invokeAction('myAction', '').then((res) => {
              console.log(`### myAction result: ${res}`);
              next();
            }).catch((err) => console.error(err));
          }).catch((err) => console.error(err));
        }).catch((err) => console.error(err));
      }).catch((err) => console.error(err));
    }).catch((err) => console.error(err));
  },
  (next: Function) => {

    console.log(`\n# Consuming Thing over CoAP\n`);

    let td = {
      '@context': ['http://w3c.github.io/wot/w3c-wot-td-context.jsonld'],
      '@type': 'Thing',
      'name': 'PlugtestServer',
      'interactions': [
        {
          '@type': ['Property'],
          'name': 'coapProp',
          'outputData': { 'valueType': { 'type': 'string' } },
          'writable': false,
          'links': [
            { 'href': 'coap://californium.eclipse.org:5683/path/sub1', 'mediaType': 'application/json' }
          ]
        },
        {
          '@type': ['Action'],
          'name': 'coapAction',
          'outputData': { 'valueType': { 'type': 'string' } },
          'inputData': { 'valueType': { 'type': 'string' } },
          'links': [
            { 'href': 'coap://californium.eclipse.org:5683/large-post', 'mediaType': 'application/json' }
          ]
        }

      ]
    };

    wot.consumeDescription(td).then((thing) => {
      console.log(`### Thing name: ${thing.name}`);
      thing.getProperty('coapProp').then((res) => {
        console.log(`### coapProp value: ${res}`);
        thing.setProperty('coapProp', '4711').then((res) => {
          console.log(`### coapProp set successfully`);
          thing.getProperty('coapProp').then((res) => {
            console.log(`### coapProp value: ${res}`);
            thing.invokeAction('coapAction', 'lower').then((res) => {
              console.log(`### coapAction result: ${res}`);
              next();
            }).catch((err) => console.error(err));
          }).catch((err) => console.error(err));
        }).catch((err) => console.error(err));
      }).catch((err) => console.error(err));
    }).catch((err) => console.error(err));
  },
  (next: Function) => {

    console.log(`\n# Exposing Thing\n`);

    let srv = new Servient();
    console.info('created servient');

    srv.addServer(new HttpServer());
    srv.addServer(new CoapServer());

    console.info('added servers');

    let WoT = srv.start();
    console.info('started servient')

    WoT.createThing('led').then(led => {
      led
        .addProperty('brightness', { type: 'integer', minimum: 0, maximum: 255 })
        .addProperty('color', {
          type: 'object',
          properties: {
            r: { type: 'integer', minimum: 0, maximum: 255 },
            g: { type: 'integer', minimum: 0, maximum: 255 },
            b: { type: 'integer', minimum: 0, maximum: 255 }
          }
        })
        .addAction('gradient');
      led.onUpdateProperty('brightness', (nu, old) => {
        console.log('New brightness: ' + nu);
      });
      led.onUpdateProperty('color', (nu, old) => {
        console.log('New color: ' + nu);
      });
      led.setProperty('brightness', 0);
      led.setProperty('color', { r: 0, g: 0, b: 0 });

      next();
    });
  }
]);
