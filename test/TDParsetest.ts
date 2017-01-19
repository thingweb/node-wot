/**
 * Basic test suite for TD parsing
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import {expect,should} from 'chai'
import ThingDescription from "../src/td/thingdescription";
import * as TDParser from "../src/td/tdparser"
should()

/** sample TD json-ld string from the CP page*/
let td_cpexample_jsonld = '{"@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],"@type": "Thing","name": "MyTemperatureThing","interactions": [{"@type": ["Property"],"name": "temperature","outputData": {"valueType": { "type": "number" }},"writable": false,"links": [{"href" : "coap://mytemp.example.com:5683/temp","mediaType": "application/json"}]}]}';


@suite("tests to verify td parsing/serialising")
class TDParserTest {

    @test("should parse the example from CP")
    cp_ex_parsing() {
        let td : ThingDescription = TDParser.parseTDString(td_cpexample_jsonld)

        //BDD style expect
        expect(td.name).to.equal("MyTemperatureThing")
        expect(td.interactions).to.have.lengthOf(1);
        expect(td.interactions[0]).to.have.property('name').that.equals("temperature")

        //BDD style should
        td.interactions[0].links.should.have.lengthOf(1)
        td.interactions[0].links[0].should.have.property('mediaType').equal("application/json")
        td.interactions[0].links[0].href.should.equal("coap://mytemp.example.com:5683/temp")
    }

/*    @test("should return same td in round-trip")
    cp_ex_roundtrip() {
        let td : ThingDescription = TDParser.parseTDString(td_cpexample_jsonld)
        let newJson = TDParser.serializeTD(td);

        let json_expected = JSON.parse(td_cpexample_jsonld);
        let json_actual = JSON.parse(newJson);

        expect(json_actual).to.deep.equal(json_expected);
    }*/

}
