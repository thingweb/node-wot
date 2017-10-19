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

import {Servient} from "node-wot";
import {HttpServer} from "node-wot-protocol-http";
import {CoapServer} from "node-wot-protocol-coap";
import {ThingDescription} from "node-wot-td-tools";
import {HttpClientFactory} from "node-wot-protocol-http"
import {CoapClientFactory} from "node-wot-protocol-coap"
import * as TDParser from "node-wot-td-tools";
import * as TD from "node-wot-td-tools";
const net = require('net');


function main() {

  let srv = new Servient();
  let WoT: WoT.WoTFactory;

  console.info('created servient for a client consumer ');

  srv.addServer(new HttpServer())
  //  srv.addServer(new CoapServer());
  srv.addClientFactory(new HttpClientFactory())
  //  srv.addClientFactory(new CoapClientFactory())

  console.info('added servers and HttpClientFactory')


  WoT = srv.start();
  console.info('started servient')


  console.info('Try to find a node: ');
  //  WoT.consumeDescriptionUri("http://192.168.0.152/td").then(thing => {
  //WoT.consumeDescriptionUri("http://plugfest.thingweb.io:8088/things/counter").then(thing => {
  /* panasonic TD */
  WoT.consume('http://w3c-ubuntu.cloudapp.net/client/jsonld/airConditioner_p1.jsonld').then(thing => {
    //      logger.info("Things base " + );


    // let tdObj = thing.getDescription()
    let tdObj = thing.description;
    let td: ThingDescription = TDParser.parseTDObject(tdObj)

    console.info('TD name = ' + td.name)
    console.info('number of interactions =' + td.interaction.length)

    for (let interaction of td.interaction) {
      console.info(' name of interaction = ' + interaction.name + ' --> ' + interaction.pattern)

      if (interaction.pattern === TD.InteractionPattern.Property) {

        console.info('call  = ' + thing.getProperty(interaction.name))
      }


    }

  }).catch((err) => console.error('Hier knallts ', err))


}

main();
