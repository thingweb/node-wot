import ThingDescription from "../thingdescription";
import * as TDParser from "../tdparser"

/** sample TD json-ld string from the CP page*/
var td_jsonld = '{"@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],"@type": "Thing","name": "MyTemperatureThing","interactions": [{"@type": ["Property"],"name": "temperature","outputData": {"valueType": { "type": "number" }},"writable": false,"links": [{"href" : "coap://mytemp.example.com:5683/temp","mediaType": "application/json"}]}]}';

var  td:ThingDescription = TDParser.parseTDString(td_jsonld)

console.log("\nTD as Object:")
console.log(" Thing name: " + td.name)
console.log(" Interaction name: "+ td.interactions[0].name);
console.log(" Interaction link: "+ td.interactions[0].links[0].href);
/** ... */

console.log("\nTD as JSON Sting:")
/* back to JSON string */
console.log(TDParser.serializeTD(td))


/* test uri composition with base and local relativ path */
td_jsonld = '{"@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],"@type": "Thing","name": "MyTemperatureThing","base":"coap://mytemp.example.com:5683","interactions": [{"@type": ["Property"],"name": "temperature","outputData": {"valueType": { "type": "number" }},"writable": false,"links": [{"href" : "temp","mediaType": "application/json"}]}]}';

var  td:ThingDescription = TDParser.parseTDString(td_jsonld)

console.log("\nTest URI resolutions:")
console.log(" Thing name: " + td.name)
console.log(" Interaction name: "+ td.interactions[0].name);
console.log(" Interaction link: "+ td.interactions[0].links[0].href);
/** ... */
