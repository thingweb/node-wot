'use strict'

import {Servient} from 'node-wot';
import {HttpClientFactory} from "node-wot-protocol-http";;
import * as WoT from 'wot-typescript-definitions';

let serv = new Servient();
serv.addClientFactory(new HttpClientFactory())
let WoTs = serv.start();
let bright = 0;

WoTs.fetchTD('http://192.168.0.23:8080/unicorn').then(td => {
  let thing = WoTs.consume(td);
  setInterval(() => {
    bright += 10;
    if (bright >= 255) bright = 0;
    thing.setProperty('brightness', bright)
  }, 1000)
})
