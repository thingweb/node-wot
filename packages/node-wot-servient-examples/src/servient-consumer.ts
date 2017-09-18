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

import Servient from '../servient';
import HttpServer from '../protocols/http/http-server';
import CoapServer from '../protocols/coap/coap-server';
import logger from '../logger';
import ThingDescription from '../td/thing-description'
import HttpClientFactory from '../protocols/http/http-client-factory'
import CoapClientFactory from '../protocols/coap/coap-client-factory'
import * as TDParser from '../td/td-parser'
import * as TD from '../td/thing-description'
const net = require('net');


function main() {

  let srv = new Servient();
  let WoT: WoT.WoTFactory;

  logger.info('created servient for a client consumer ');

  srv.addServer(new HttpServer())
  //  srv.addServer(new CoapServer());
  srv.addClientFactory(new HttpClientFactory())
  //  srv.addClientFactory(new CoapClientFactory())

  logger.info('added servers and HttpClientFactory')


  WoT = srv.start();
  logger.info('started servient')


  logger.info('Try to find a node: ');
  //  WoT.consumeDescriptionUri("http://192.168.0.152/td").then(thing => {
  //WoT.consumeDescriptionUri("http://plugfest.thingweb.io:8088/things/counter").then(thing => {
  /* panasonic TD */
  WoT.consumeDescriptionUri('http://w3c-ubuntu.cloudapp.net/client/jsonld/airConditioner_p1.jsonld').then(thing => {
    //      logger.info("Things base " + );

    let tdObj = thing.getDescription()
    let td: ThingDescription = TDParser.parseTDObject(tdObj)

    logger.info('TD name = ' + td.name)
    logger.info('number of interactions =' + td.interactions.length)

    for (let interaction of td.interactions) {
      logger.info(' name of interaction = ' + interaction.name + ' --> ' + interaction.pattern)

      if (interaction.pattern === TD.InteractionPattern.Property) {

        logger.info('call  = ' + thing.getProperty(interaction.name))
      }


    }

  }).catch((err) => logger.error('Hier knallts ', err))


}

main();
