'use strict'

import {Servient} from 'node-wot';
import {HttpClientFactory} from "node-wot-protocol-http";;

let serv = new Servient();
serv.addClientFactory(new HttpClientFactory())
let WoT = serv.start();
let bright = 0;

WoT.consume('http://192.168.0.23:8080/unicorn').then(thing => {
  setInterval(() => {
    bright += 10;
    if (bright >= 255) bright = 0;
    thing.setProperty('brightness', bright)
  }, 1000)
})
