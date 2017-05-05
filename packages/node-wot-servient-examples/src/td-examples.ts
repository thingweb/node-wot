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

import ThingDescription from '../../td/thing-description';
import * as TDParser from '../../td/td-parser';

/* sample TD json-ld string from the CP page*/
let td_jsonld = '{"@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],"@type": "Thing","name": "MyTemperatureThing","interactions": [{"@type": ["Property"],"name": "temperature","outputData": {"valueType": { "type": "number" }},"writable": true,"links": [{"href" : "coap://mytemp.example.com:5683/temp","mediaType": "application/json"}]}]}';

let td: ThingDescription = TDParser.parseTDString(td_jsonld)

console.log('\nTD as Object:')
console.log(' Thing name: ' + td.name)
console.log(' Interaction name: ' + td.interactions[0].name);
console.log(' Interaction link: ' + td.interactions[0].links[0].href);
console.log(' Is writable: ' + td.interactions[0].writable);
/* ... */

console.log('\nTD as JSON Sting:')
/* back to JSON string */
console.log(TDParser.serializeTD(td))

/* test uri composition with base and local relativ path */
td_jsonld = '{"@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],"@type": "Thing","name": "MyTemperatureThing","base":"coap://mytemp.example.com:5683","interactions": [{"@type": ["Property"],"name": "temperature","outputData": {"valueType": { "type": "number" }},"writable": false,"links": [{"href" : "temp","mediaType": "application/json"}]}]}';

let td: ThingDescription = TDParser.parseTDString(td_jsonld)

console.log('\nTest URI resolutions:')
console.log(' Thing name: ' + td.name)
console.log(' Interaction name: ' + td.interactions[0].name);
console.log(' Interaction link: ' + td.interactions[0].links[0].href)
console.log(' Is writable: ' + td.interactions[0].writable);
/* ... */
