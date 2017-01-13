/**
 * Basic test suite for TD parsing
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import {expect} from 'chai'
import ThingDescription from "../src/thingdescription";
import * as TDParser from "../src/tdparser"

/** sample TD json-ld string from the CP page*/
let td_cpexample_jsonld = '{"@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],"@type": "Thing","name": "MyTemperatureThing","interactions": [{"@type": ["Property"],"name": "temperature","outputData": {"valueType": { "type": "number" }},"writable": false,"links": [{"href" : "coap://mytemp.example.com:5683/temp","mediaType": "application/json"}]}]}';


@suite("tests to verify td parsing/serialising")
class TDParserTest {
    
    @test("should parse the example from CP")
    cp_ex_parsing() {
        let td : ThingDescription = TDParser.parseTDString(td_cpexample_jsonld)
        expect(td.name).to.eq("MyTemperatureThing")
        expect(td.interactions[0].name).to.eq("temperature")
        expect(td.interactions[0].links[0].href).to.eq("coap://mytemp.example.com:5683/temp")
        expect(td.interactions[0].links[0].mediaType).to.eq("application/json")
    }
    
    @test("should return same td in round-trip")
    cp_ex_roundtrip() {
        let td : ThingDescription = TDParser.parseTDString(td_cpexample_jsonld)
        let newJson = TDParser.serializeTD(td);
        
        let json_expected = JSON.parse(td_cpexample_jsonld);
        let json_actual = JSON.parse(newJson);

        expect(json_actual).to.deep.equal(json_expected);
    }
    
}