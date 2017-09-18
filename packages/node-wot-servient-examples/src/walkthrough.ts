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

import fs = require('fs');
import Servient from '../../servient';
import { DummyClientFactory } from '../../protocols/dummy/dummy-protocol-client';
import ConsumedThing from '../../consumed-thing';
import ThingDescription from '../../td/thing-description';

/**
 * Servient control for scripts
 * The lifecycle of a script should be. start up Servient
 * Obtain WoT object from servient
 * Use WoT object to Script
 */
class MyServient extends Servient {
  public readConf(): void {
    fs.readFile('.wotconfig', 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
      }
      console.log('config:\n');
      console.dir(data);
    });
  }
}

let srv = new MyServient();

// ...import servers and clients and add them...
let dcf = new DummyClientFactory();
srv.addClientFactory(dcf);

let wot = srv.start();

console.log('starting servient');

wot.createThing('bla').then((thing) => {
  console.log('there is a thing called ' + thing.name);

  thing
    .addAction('wuu')
    .onInvokeAction('wuu',
    () => {
      console.log('Woo was called');
    }
    );

  thing
    .addProperty('bar', { 'type': 'number' })
    .onUpdateProperty('bar', (nV, oV) => {
      'bar changed from ' + oV + ' to ' + nV;
    })
    .setProperty('bar', 0)
    .catch(console.error);

  console.log('things are up, now check it');

  let t = srv.getThing('bla');
  console.log(t.getProperty('bar'));
  t.invokeAction('wuu');
});

// client factory tests
let dc = dcf.getClient();
console.log(dcf.getSchemes());
dc.readResource('dummy://foo').then(console.log).catch(console.error);

// console.log();
// console.log(dc.readResource("unknown://foo"));

// async calls
console.log('start async calls...');
for (let i = 0; i < 5; i++) {
  dc.readResource('dummy://foo_' + i).then(function (val) {
    console.log(val);
  }).catch(function (err) {
    console.error('readResourceAsync error', err.message)
  });
}
console.log('all async calls started (wait for responses)');


// consumed thing tests
// let servient: Servient, let td: ThingDescription;
let td = new ThingDescription();
td.name = 'test';
let pt = new ConsumedThing(srv, td);
pt.invokeAction('foo');
