/**
 * HTTP client based on http
 */

import {logger} from "../../logger";

import * as http from "http";
import * as url from "url";

export default class HttpClient implements ProtocolClient {

    private readonly agent : http.Agent;

    constructor() {
        this.agent = new http.Agent({ keepAlive: true });
    }

    private uriToOptions(uri : string) : http.RequestOptions {
        let requestUri = url.parse(uri);
        let options : http.RequestOptions = {};
        options.agent = this.agent;
        options.hostname = requestUri.hostname;
        options.port = parseInt(requestUri.port);
        options.path = requestUri.path

        // TODO auth and headers

        return options;
    }

    public readResource(uri : string) : Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            let options : http.RequestOptions = this.uriToOptions(uri);

            // TODO get explicit binding from TD
            options.method = "GET";

            logger.info(`HttpClient sending GET to ${uri}`);
            let req = http.request(options, (res) => {
                logger.info(`HttpClient received ${res.statusCode} from ${uri}`);
                logger.silly(`HttpClient received headers: ${JSON.stringify(res.headers)}`);
                let body : Array<any> = [];
                res.on("data", (data) => { body.push(data) } );
                res.on("end", () => {
                    resolve(Buffer.concat(body));
                });
            });
            req.on("error", err => reject(err));
            req.end();
        });
    }

    public writeResource(uri : string, payload : Buffer) : Promise<any> {
        return new Promise<void>((resolve, reject) => {
            
            if (!payload) payload = new Buffer("");

            let options : http.RequestOptions = this.uriToOptions(uri);

            // TODO get explicit binding from TD
            options.method = "PUT";
            options.headers = { "Content-Length": payload.byteLength };

            logger.info(`HttpClient sending PUT to ${uri}`);
            let req = http.request(options, (res) => {
                logger.info(`HttpClient received ${res.statusCode} from ${uri}`);
                logger.silly(`HttpClient received headers: ${JSON.stringify(res.headers)}`);
                // Although 204 without payload is expected, data must be read to complete request (http blocks socket otherwise)
                // TODO might have response on write for future HATEOAS concept
                let body : Array<any> = [];
                res.on("data", (data) => { body.push(data) } );
                res.on("end", () => {
                    resolve();
                });
            });
            req.on("error", err => reject(err));
            req.write(payload);
            req.end();
        });
    }

    public invokeResource(uri : string, payload : Buffer) : Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {

            if (!payload) payload = new Buffer("");

            let options : http.RequestOptions = this.uriToOptions(uri);

            // TODO get explicit binding from TD
            options.method = "POST";
            options.headers = { "Content-Length": payload.byteLength };

            logger.info(`HttpClient sending GET to ${uri}`);
            let req = http.request(options, (res) => {
                logger.info(`HttpClient received ${res.statusCode} from ${uri}`);
                logger.silly(`HttpClient received headers: ${JSON.stringify(res.headers)}`);
                let body : Array<any> = [];
                res.on("data", (data) => { body.push(data) } );
                res.on("end", () => {
                    resolve(Buffer.concat(body));
                });
            });
            req.on("error", err => reject(err));
            req.write(payload);
            req.end();
        });
    }

    public unlinkResource(uri : string) : Promise<any> {
        return new Promise<void>((resolve, reject) => {
            let options : http.RequestOptions = this.uriToOptions(uri);

            // TODO get explicit binding from TD
            options.method = "DELETE";

            logger.info(`HttpClient sending DELETE to ${uri}`);
            let req = http.request(options, (res) => {
                logger.info(`HttpClient received ${res.statusCode} from ${uri}`);
                logger.silly(`HttpClient received headers: ${JSON.stringify(res.headers)}`);
                // Although 204 without payload is expected, data must be read to complete request (http blocks socket otherwise)
                // TODO might have response on unlink for future HATEOAS concept
                let body : Array<any> = [];
                res.on("data", (data) => { body.push(data) } );
                res.on("end", () => {
                    resolve();
                });
            });
            req.on("error", err => reject(err));
            req.end();
        });
    }

    public start() : boolean {
        return true;
    }
    
    public stop() : boolean {
        this.agent.destroy();
        return true;
    }

}