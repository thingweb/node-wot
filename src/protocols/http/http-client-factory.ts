/**
 * HTTP client Factory
 */

import {logger} from "../../logger";
import HttpClient from "./http-client";

export default class HttpClientFactory implements ProtocolClientFactory {

    public static readonly schemes : Array<string> = ["http"];

    public getClient() : ProtocolClient {
        console.log("getClient for scheme 'http'");
        return new HttpClient();
    }
    
    public init() : boolean {
        console.log("init client-factory for scheme 'http'");
        return true;
    }

    public destroy() : boolean {
        console.log("destroy client-factory for scheme 'http'");
        return true;
    }
   
    public getSchemes() : Array<string> {
        return HttpClientFactory.schemes;
    }
}
