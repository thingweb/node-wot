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
