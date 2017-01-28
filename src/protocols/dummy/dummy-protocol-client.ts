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
 * Dummy Protocol code for early testing
 */

import logger from "../../logger";

export class DummyClientFactory implements ProtocolClientFactory {

    public static readonly schemes : Array<string> = ["dummy"] ;

    public getClient() : ProtocolClient {
        console.log("getClient for scheme 'dummy'");
        return new DummyClient();
    }
    
    public init() : boolean {
        console.log("init client-factory for scheme 'dummy'");
        return true;
    }

    public destroy() : boolean {
        console.log("destroy client-factory for scheme 'dummy'");
        return true;
    }
   
    public getSchemes() : Array<string> {
        return DummyClientFactory.schemes;
    }
}


class DummyClient implements ProtocolClient {

    // private checkScheme(uri: string): boolean {
    //     if(uri != null && uri.indexOf(DummyClient.schemes[0] + "://") == 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    public readResource(uri: string): Promise<any> {
        // return uri plus time
        // if (this.checkScheme(uri)) {
            return this.readResourceAsync(uri)
        // } else {
        //     return "GET ERROR for " + uri;
        // }
    }

    public readResourceAsync(uri: string): Promise<any> {
        // do some work
        return new Promise<string>((resolve, reject)=>{
            //let g = this.readResource(uri);
            let g = "PUT_" + uri + "_" + new Date()
            let isSomeCondition = Math.random() < 0.5 ? true : false;
            if (isSomeCondition) {
                logger.info('Simulate rejection for testing purposes, ' + uri);
                reject(new Error('Testing fail on purpose for "' + uri + '"'));
            }
            setTimeout( () => {
                resolve(g);
            }, 1500);
        });

        // new Promisethis.readResource(uri);
    }

    public writeResource(uri: string, payload: any): Promise<any> {
        return new Promise<any>((resolve, reject)=>{
            resolve("PUT_" + uri + "_" + new Date())
        })
    }

    public invokeResource(uri: String, payload: any): Promise<any> {
        return new Promise<string>((resolve, reject)=>{
            resolve("POST_" + uri + "_" + new Date())
        })
    }

    public unlinkResource(uri: string): Promise<any> {
        return new Promise<string>((resolve, reject)=>{
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