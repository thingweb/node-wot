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
 * CoAP client based on coap by mcollina
 */

import {logger} from "../../logger";

var coap = require('coap');
import * as url from "url";

export default class CoapClient implements ProtocolClient {

    // FIXME coap Agent closes socket when no messages in flight -> new socket with every request
    private readonly agent : any = new coap.Agent();

    constructor() {
    }

    private uriToOptions(uri : string) : CoapRequestConfig {
        let requestUri = url.parse(uri);
        let options : CoapRequestConfig = {
            agent: this.agent,
            hostname: requestUri.hostname,
            port: parseInt(requestUri.port),
            pathname: requestUri.pathname,
            query: requestUri.query,
            observe: false,
            multicast: false,
            confirmable: true
        };

        // TODO auth

        return options;
    }

    public readResource(uri : string) : Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            let options : CoapRequestConfig = this.uriToOptions(uri);

            // TODO get explicit binding from TD
            options.method = "GET";

            logger.info(`CoapClient sending GET to ${uri}`);
            let req = this.agent.request(options);
            req.on("response", (res : any) => {
                logger.info(`CoapClient received ${res.code} from ${uri}`);
                logger.silly(`CoapClient received headers: ${JSON.stringify(res.headers)}`);
                resolve(res.payload);
            });
            req.on("error", (err : Error) => reject(err));
            req.end();
        });
    }

    public writeResource(uri : string, payload : Buffer) : Promise<any> {
        return new Promise<void>((resolve, reject) => {
            
            if (!payload) payload = new Buffer("");

            let options : CoapRequestConfig = this.uriToOptions(uri);

            // TODO get explicit binding from TD
            options.method = "PUT";

            logger.info(`CoapClient sending PUT to ${uri}`);
            let req = this.agent.request(options);
            req.on("response", (res : any) => {
                logger.info(`CoapClient received ${res.code} from ${uri}`);
                logger.silly(`CoapClient received headers: ${JSON.stringify(res.headers)}`);
                resolve();
            });
            req.on("error", (err : Error) => reject(err));
            req.write(payload);
            req.end();
        });
    }

    public invokeResource(uri : string, payload : Buffer) : Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {

            if (!payload) payload = new Buffer("");

            let options : CoapRequestConfig = this.uriToOptions(uri);

            // TODO get explicit binding from TD
            options.method = "POST";

            logger.info(`CoapClient sending GET to ${uri}`);
            let req = this.agent.request(options);
            req.on("response", (res : any) => {
                logger.info(`CoapClient received ${res.code} from ${uri}`);
                logger.silly(`CoapClient received headers: ${JSON.stringify(res.headers)}`);
                resolve(res.payload);
            });
            req.on("error", (err : Error) => reject(err));
            req.write(payload);
            req.end();
        });
    }

    public unlinkResource(uri : string) : Promise<any> {
        return new Promise<void>((resolve, reject) => {
            let options : CoapRequestConfig = this.uriToOptions(uri);

            // TODO get explicit binding from TD
            options.method = "DELETE";

            logger.info(`CoapClient sending DELETE to ${uri}`);
            let req = this.agent.request(options);
            req.on("response", (res : any) => {
                logger.info(`CoapClient received ${res.code} from ${uri}`);
                logger.silly(`CoapClient received headers: ${JSON.stringify(res.headers)}`);
                resolve();
            });
            req.on("error", (err : Error) => reject(err));
            req.end();
        });
    }

    public start() : boolean {
        return true;
    }
    
    public stop() : boolean {
        // FIXME coap does not provide proper API to close Agent
        return true;
    }

}

declare interface CoapRequestConfig {
    agent? : Object,
    hostname? : string,
    port? : number,
    pathname?: string,
    query?: string,
    observe?: boolean,
    multicast?: boolean,
    confirmable?: boolean,
    method? : string
}