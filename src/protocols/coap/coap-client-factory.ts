/**
 * HTTP client Factory
 */

import {logger} from "../../logger";
import CoapClient from "./coap-client";

export default class CoapClientFactory implements ProtocolClientFactory {

    public static readonly schemes : Array<string> = ["coap"];

    public getClient() : ProtocolClient {
        console.log("getClient for scheme 'coap'");
        return new CoapClient();
    }
    
    public init() : boolean {
        console.log("init client-factory for scheme 'coap'");
        return true;
    }

    public destroy() : boolean {
        console.log("destroy client-factory for scheme 'coap'");
        return true;
    }
   
    public getSchemes() : Array<string> {
        return CoapClientFactory.schemes;
    }
}
