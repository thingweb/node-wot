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

import * as TDTransformer from "node-wot-td-tools";
// var prettyjson = require("prettyjson");

/* sample TD json-ld string from the CP page */
let td1_V2 = JSON.parse('{"@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],"@type": "Thing","name": "MyTemperatureThing","interactions": [{"@type": ["Property"],"name": "temperature","outputData":{ "type": "number" },"writable": false,"links": [{"href" : "coap://mytemp.example.com:5683/temp","mediaType": "application/json"}]}]}');

let td2_V2 = JSON.parse('{"@context":["http://w3c.github.io/wot/w3c-wot-td-context.jsonld",{"actuator":"http://example.org/actuator#"}],"@type":"Thing","name":"MyLEDThing","base":"coap://myled.example.com:5683/","security":{"cat":"token:jwt","alg":"HS256","as":"https://authority-issuing.example.org"},"interactions":[{"@type":["Property","actuator:onOffStatus"],"name":"status","outputData":{"type":"boolean"},"writable":true,"links":[{"href":"pwr","mediaType":"application/exi"},{"href":"http://mytemp.example.com:8080/status","mediaType":"application/json"}]},{"@type":["Action","actuator:fadeIn"],"name":"fadeIn","inputData":{"type":"integer"},"actuator:unit":"actuator:ms","links":[{"href":"in","mediaType":"application/exi"},{"href":"http://mytemp.example.com:8080/in","mediaType":"application/json"}]},{"@type":["Action","actuator:fadeOut"],"name":"fadeOut","inputData":{"type":"integer"},"actuator:unit":"actuator:ms","links":[{"href":"out","mediaType":"application/exi"},{"href":"http://mytemp.example.com:8080/out","mediaType":"application/json"}]},{"@type":["Event","actuator:alert"],"name":"criticalCondition","outputData":{"type":"string"},"links":[{"href":"ev","mediaType":"application/exi"}]}]}');


console.log('########## EXAMPLE 1');
console.log('From V2: ');
console.log(JSON.stringify(td1_V2, null, 4));
let td1_V1 = TDTransformer.transformTDV2ObjToV1Obj(td1_V2);
console.log('To V1:');
console.log(JSON.stringify(td1_V1, null, 4));


console.log('########## EXAMPLE 2');
console.log('From V2: ');
console.log(JSON.stringify(td2_V2, null, 4));
let td2_V1 = TDTransformer.transformTDV2ObjToV1Obj(td2_V2);
console.log('To V1:');
console.log(JSON.stringify(td2_V1, null, 4));

// PrettyPrint Tests
// var data = {
//   username: 'rafeca',
//   url: 'https://github.com/rafeca',
//   twitter_account: 'https://twitter.com/rafeca',
//   projects: ['prettyprint', 'connfu']
// };

// var options = {
//   noColor: false
// };

// console.log(prettyjson.render(data, options));
