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
import ProtocolClient from "node-wot";
import {HttpClientFactory} from "node-wot-protocol-http";
import {CoapClientFactory} from "node-wot-protocol-coap";

// for level only - use console for output
// import logger from '../../logger';
// logger.level = 'debug';

let myHttpFactory = new HttpClientFactory();
let myCoapFactory = new CoapClientFactory();

runHttp('http://localhost:8081/test', myHttpFactory.getClient(), () => { runCoap('coap://localhost:5683/test', myCoapFactory.getClient()); });


function runHttp(uri: string, client: ProtocolClient, next: Function) {
  console.log('\n=== HttpClient ===\n');

  client.start();
  client.readResource(uri).then(res => {
    console.log(res.body.toString());
    client.writeResource(uri, { mediaType: 'text/plain', body: new Buffer('http-client') }).then(() => {
      console.log('Write returned');
      client.readResource(uri).then(res => {
        console.log(res.body.toString());
        client.invokeResource(uri, null).then(res => {
          console.log(res.body.toString());
          client.unlinkResource(uri).then(() => {
            console.log('Unlink returned');
            client.stop();
            next();
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
}

function runCoap(uri: string, client: ProtocolClient) {
  console.log('\n=== CoapClient ===\n');

  client.start();
  client.readResource(uri).then(res => {
    console.log(res.body.toString());
    client.writeResource(uri, { mediaType: 'text/plain', body: new Buffer('coap-client') }).then(() => {
      console.log('Write returned');
      client.readResource(uri).then(res => {
        console.log(res.body.toString());
        client.invokeResource(uri, null).then(res => {
          console.log(res.body.toString());
          client.unlinkResource(uri).then(() => {
            console.log('Unlink returned');
            client.stop();
          }).catch(err => console.log(err));
        }).catch(err => console.log(err));
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
}
