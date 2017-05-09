
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
