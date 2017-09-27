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

import {HttpServer} from "node-wot-protocol-http";
import {CoapServer} from "node-wot-protocol-coap";
import {AssetResourceListener} from 'node-wot';

// for level only - use console for output
// import logger from '../../logger';
// logger.level = 'debug';

let res1 = new AssetResourceListener('"Hello World"', 'application/json');
let res2 = new AssetResourceListener('true', 'application/json');

let hServer = new HttpServer(8081);
hServer.addResource('/test', res1);
hServer.addResource('/exit', res2);
hServer.start();
console.log('HTTP listening on port ' + hServer.getPort());

let cServer = new CoapServer();
cServer.addResource('/test', res1);
cServer.addResource('/exit', res2);
cServer.start();
console.log('CoAP listening on port ' + cServer.getPort());
