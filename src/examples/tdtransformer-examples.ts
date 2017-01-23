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

import * as TDTransformer from '../td/tdtransformer'
// var prettyjson = require('prettyjson');

/** sample TD json-ld string from the CP page*/
var td1_V2 = JSON.parse('{"@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],"@type": "Thing","name": "MyTemperatureThing","interactions": [{"@type": ["Property"],"name": "temperature","outputData": {"valueType": { "type": "number" }},"writable": false,"links": [{"href" : "coap://mytemp.example.com:5683/temp","mediaType": "application/json"}]}]}');

var td2_V2 = JSON.parse('{"@context":["http://w3c.github.io/wot/w3c-wot-td-context.jsonld",{"actuator":"http://example.org/actuator#"}],"@type":"Thing","name":"MyLEDThing","base":"coap://myled.example.com:5683/","security":{"cat":"token:jwt","alg":"HS256","as":"https://authority-issuing.example.org"},"interactions":[{"@type":["Property","actuator:onOffStatus"],"name":"status","outputData":{"valueType":{"type":"boolean"}},"writable":true,"links":[{"href":"pwr","mediaType":"application/exi"},{"href":"http://mytemp.example.com:8080/status","mediaType":"application/json"}]},{"@type":["Action","actuator:fadeIn"],"name":"fadeIn","inputData":{"valueType":{"type":"integer"},"actuator:unit":"actuator:ms"},"links":[{"href":"in","mediaType":"application/exi"},{"href":"http://mytemp.example.com:8080/in","mediaType":"application/json"}]},{"@type":["Action","actuator:fadeOut"],"name":"fadeOut","inputData":{"valueType":{"type":"integer"},"actuator:unit":"actuator:ms"},"links":[{"href":"out","mediaType":"application/exi"},{"href":"http://mytemp.example.com:8080/out","mediaType":"application/json"}]},{"@type":["Event","actuator:alert"],"name":"criticalCondition","outputData":{"valueType":{"type":"string"}},"links":[{"href":"ev","mediaType":"application/exi"}]}]}');


console.log("########## EXAMPLE 1");
console.log("From V2: ");
console.log(JSON.stringify(td1_V2, null, 4));
let td1_V1 = TDTransformer.transformTDV2ObjToV1Obj(td1_V2);
console.log("To V1:");
console.log(JSON.stringify(td1_V1, null, 4));


console.log("########## EXAMPLE 2");
console.log("From V2: ");
console.log(JSON.stringify(td2_V2, null, 4));
let td2_V1 = TDTransformer.transformTDV2ObjToV1Obj(td2_V2);
console.log("To V1:");
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
