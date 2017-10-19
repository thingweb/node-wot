'use strict'

/// <reference path="../../protocols/protocol-client.ts" />


import Servient from "node-wot";
import {HttpServer} from "node-wot-protocol-http";
import {CoapClientFactory} from "node-wot-protocol-coap"
// import logger from '../../logger'

let serv = new Servient();
serv.addClientFactory(new CoapClientFactory())
serv.addServer(new HttpServer(3000))

let WoT = serv.start();

let pump: WoT.ConsumedThing = null;
let valve: WoT.ConsumedThing = null;
let lvlMeter: WoT.ConsumedThing = null;

let tlvl = 0;

//setInterval(() => logger.info("i got ", pump, valve, level),1000)

// logger.level = 'silly'

WoT.consume('coap://w3cwot.sytes.net:5688/tdv2')
  .then(thing => pump = thing)
  .then(() => WoT.consume('coap://w3cwot.sytes.net:5689/tdv2'))
  .then(thing => valve = thing)
  .then(() => WoT.consume('coap://w3cwot.sytes.net:5686/tdv2'))
  .then(thing => lvlMeter = thing)
  .then(() => {
  //   WoT.createThing('siemens-demo')
  //     .then(thing => {
  //       thing
  //         .addProperty('level', { 'type': 'number' })
  //         .addProperty('valveOpen', { 'type': 'string' })
  //         .addProperty('pumpRunning', { 'type': 'string' })
  //         .addAction('fill')
  //         .addAction('drain')
  //         .addAction('fillUpTo', { 'type': 'number' })
  //         .addAction('drainTo', { 'type': 'number' })
  //         .addAction('stop')

  //       thing.onInvokeAction('fillUpTo', (target) => {
  //         pump.invokeAction('start')
  //         //TODO stop pumping when target
  //       });

  //       thing.onInvokeAction('drainTo', (target) => {
  //         valve.invokeAction('open')
  //         //TODO close valve when target reached
  //       });

  //       thing.onInvokeAction('fill', () => {
  //         console.warn('invoking fill')
  //         return pump.invokeAction('on', null)
  //       });

  //       thing.onInvokeAction('drain', () => {
  //         return valve.invokeAction('open', null)
  //       });

  //       thing.onInvokeAction('stop', () => {
  //         return Promise.all([
  //           valve.invokeAction('close', null),
  //           pump.invokeAction('off', null)
  //         ])
  //       });

  //       setInterval(() => {
  //         Promise.all([
  //           valve.getProperty('status').then(status => thing.setProperty('valveOpen', status)),
  //           pump.getProperty('status').then(status => thing.setProperty('pumpRunning', status)),
  //           lvlMeter.getProperty('level').then(level => { tlvl = level; thing.setProperty('level', level) })
  //         ])
  //           .catch((err) => console.error('error occured', err))
  //       }, 500)


  //     })
  })
  .catch((err) => console.error('error occured', err))
