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
import ProtocolClient from "node-wot";
import {HttpClientFactory} from "node-wot-protocol-http";
import {CoapClientFactory} from "node-wot-protocol-coap";

// for level only - use console for output
// import logger from '../../logger';
// logger.level = 'debug';

let myHttpFactory = new HttpClientFactory();
let myCoapFactory = new CoapClientFactory();

// TODO @dape fix example
// runHttp('http://localhost:8081/test', myHttpFactory.getClient(), () => { runCoap('coap://localhost:5683/test', myCoapFactory.getClient()); });


function runHttp(uri: string, client: ProtocolClient, next: Function) {
  console.log('\n=== HttpClient ===\n');

  client.start();
  // client.readResource(uri).then(res => {
  //   console.log(res.body.toString());
  //   client.writeResource(uri, { mediaType: 'text/plain', body: new Buffer('http-client') }).then(() => {
  //     console.log('Write returned');
  //     client.readResource(uri).then(res => {
  //       console.log(res.body.toString());
  //       client.invokeResource(uri, null).then(res => {
  //         console.log(res.body.toString());
  //         client.unlinkResource(uri).then(() => {
  //           console.log('Unlink returned');
  //           client.stop();
  //           next();
  //         }).catch(err => console.log(err));
  //       }).catch(err => console.log(err));
  //     }).catch(err => console.log(err));
  //   }).catch(err => console.log(err));
  // }).catch(err => console.log(err));
}

function runCoap(uri: string, client: ProtocolClient) {
  console.log('\n=== CoapClient ===\n');

  client.start();
  // client.readResource(uri).then(res => {
  //   console.log(res.body.toString());
  //   client.writeResource(uri, { mediaType: 'text/plain', body: new Buffer('coap-client') }).then(() => {
  //     console.log('Write returned');
  //     client.readResource(uri).then(res => {
  //       console.log(res.body.toString());
  //       client.invokeResource(uri, null).then(res => {
  //         console.log(res.body.toString());
  //         client.unlinkResource(uri).then(() => {
  //           console.log('Unlink returned');
  //           client.stop();
  //         }).catch(err => console.log(err));
  //       }).catch(err => console.log(err));
  //     }).catch(err => console.log(err));
  //   }).catch(err => console.log(err));
  // }).catch(err => console.log(err));
}
