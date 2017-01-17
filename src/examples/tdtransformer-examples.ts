import * as TDTransformer from '../tdtransformer'
// var prettyjson = require('prettyjson');

/** sample TD json-ld string from the CP page*/
var td1_V2 = JSON.parse('{"@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],"@type": "Thing","name": "MyTemperatureThing","interactions": [{"@type": ["Property"],"name": "temperature","outputData": {"valueType": { "type": "number" }},"writable": false,"links": [{"href" : "coap://mytemp.example.com:5683/temp","mediaType": "application/json"}]}]}');

console.log("From V2: ");
console.log(JSON.stringify(td1_V2, null, 4));
let td1_V1 = TDTransformer.transformTDV2ObjToV1Obj(td1_V2);
console.log("To V1:"); 
console.log(JSON.stringify(td1_V1, null, 4));


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