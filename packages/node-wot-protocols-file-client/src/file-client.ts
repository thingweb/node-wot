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
 * File protocol binding
 */
import {ProtocolClientFactory, ProtocolClient, Content} from "node-wot-protocols"
import logger from "node-wot-logger";

import fs = require('fs');

export class FileClientFactory implements ProtocolClientFactory {
    public static readonly schemes : Array<string> = ["file"];

    public getClient() : ProtocolClient {
        return new FileClient();
    }
    
    public init() : boolean {
        return true;
    }

    public destroy() : boolean {
        return true;
    }
   
    public getSchemes() : Array<string> {
        return FileClientFactory.schemes;
    }
}

class FileClient implements ProtocolClient {
    constructor() {
        //console.log("File: new client created");
    }

    public readResource(uri : string) : Promise<Content> {
        return new Promise<Content>((resolve, reject) => {
            var filepath = uri.split("//");
            var resource = fs.readFileSync(filepath[1], 'utf8');
            resolve({ mediaType : "application/json", body : new Buffer(resource) });
        });
    }

    public writeResource(uri : string, content : Content) : Promise<any> {
        return;
    }

    public invokeResource(uri: String, payload: Object): Promise<any> {
        return new Promise<Object>((resolve, reject) => {
            resolve("POST_" + uri + "_" + new Date())
        })
    }

    public unlinkResource(uri: string): Promise<any> {
        return new Promise<Object>((resolve, reject) => {
            resolve("DELETE_" + uri + "_" + new Date())
        })
    }

    public start() : boolean {
        return true;
    }

    public stop() : boolean {
        return true;
    }
}
