/*
 * W3C Software License
 *
 * Copyright (c) 2018 the thingweb community
 *
 * THIS WORK IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR
 * WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF
 * MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE
 * SOFTWARE OR DOCUMENT WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS,
 * TRADEMARKS OR OTHER RIGHTS.
 *
 * COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR
 * CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENT.
 *
 * The name and trademarks of copyright holders may NOT be used in advertising or
 * publicity pertaining to the work without specific, written prior permission. Title
 * to copyright in this work will at all times remain with copyright holders.
 */

/**
 * CoAP client based on coap by mcollina
 */

let coap = require("coap");
import * as url from "url";

import { ProtocolClient, Content } from "@node-wot/core";
import { CoapForm, CoapRequestConfig, CoapOption } from "./coap";

export default class CoapClient implements ProtocolClient {

  // FIXME coap Agent closes socket when no messages in flight -> new socket with every request
  private readonly agent: any = new coap.Agent();

  constructor() {
    // Intentionally blank
  }

  public toString(): string {
    return "[CoapClient]";
  }

  public readResource(form: CoapForm): Promise<Content> {
    return new Promise<Content>((resolve, reject) => {

      let req = this.generateRequest(form, "GET");

      console.log(`CoapClient sending ${req.statusCode} to ${form.href}`);

      req.on("response", (res: any) => {
        console.log(`CoapClient received ${res.code} from ${form.href}`);
        console.debug(`CoapClient received Content-Format: ${res.headers["Content-Format"]}`);
        console.debug(`CoapClient received headers: ${JSON.stringify(res.headers)}`);
        let mediaType = res.headers["Content-Format"];
        resolve({ mediaType: mediaType, body: res.payload });
      });
      req.on("error", (err: Error) => reject(err));
      req.end();
    });
  }

  public writeResource(form: CoapForm, content: Content): Promise<any> {
    return new Promise<void>((resolve, reject) => {

      let req = this.generateRequest(form, "PUT");

      // TODO set Content-FOrmat

      console.log(`CoapClient sending ${req.statusCode} to ${form.href}`);

      req.on("response", (res: any) => {
        console.log(`CoapClient received ${res.code} from ${form.href}`);
        console.debug(`CoapClient received headers: ${JSON.stringify(res.headers)}`);
        resolve();
      });
      req.on("error", (err: Error) => reject(err));
      req.setOption("Content-Format", content.mediaType);
      req.write(content.body);
      req.end();
    });
  }

  public invokeResource(form: CoapForm, content?: Content): Promise<Content> {
    return new Promise<Content>((resolve, reject) => {

      let req = this.generateRequest(form, "POST");

      console.log(`CoapClient sending ${req.statusCode} to ${form.href}`);

      req.on("response", (res: any) => {
        console.log(`CoapClient received ${res.code} from ${form.href}`);
        console.debug(`CoapClient received Content-Format: ${res.headers["Content-Format"]}`);
        console.debug(`CoapClient received headers: ${JSON.stringify(res.headers)}`);
        let mediaType = res.headers["Content-Format"];
        resolve({ mediaType: mediaType, body: res.payload });
      });
      req.on("error", (err: Error) => reject(err));
      if (content) {
        req.setOption("Content-Format", content.mediaType);
        req.write(content.body);
      }
      req.end();
    });
  }

  public unlinkResource(form: CoapForm): Promise<any> {
    return new Promise<void>((resolve, reject) => {

      let req = this.generateRequest(form, "DELETE");

      console.log(`CoapClient sending ${req.statusCode} to ${form.href}`);

      req.on("response", (res: any) => {
        console.log(`CoapClient received ${res.code} from ${form.href}`);
        console.debug(`CoapClient received headers: ${JSON.stringify(res.headers)}`);
        resolve();
      });
      req.on("error", (err: Error) => reject(err));
      req.end();
    });
  }

  public start(): boolean {
    return true;
  }

  public stop(): boolean {
    // FIXME coap does not provide proper API to close Agent
    return true;
  }
  public setSecurity = (metadata: any) => true;

  private uriToOptions(uri: string): CoapRequestConfig {
    let requestUri = url.parse(uri);
    let options: CoapRequestConfig = {
      agent: this.agent,
      hostname: requestUri.hostname,
      port: parseInt(requestUri.port, 10),
      pathname: requestUri.pathname,
      query: requestUri.query,
      observe: false,
      multicast: false,
      confirmable: true
    };

    // TODO auth

    return options;
  }

  private generateRequest(form: CoapForm, dflt: string): any {

    let options: CoapRequestConfig = this.uriToOptions(form.href);

    options.method = dflt;

    if (typeof form["coap:methodCode"] === "number") {
      console.log("CoapClient got Form 'methodCode'", form["coap:methodCode"]);
      switch (form["coap:methodCode"]) {
        case 1: options.method = "GET"; break;
        case 2: options.method = "POST"; break;
        case 3: options.method = "PUT"; break;
        case 4: options.method = "DELETE"; break;
        default: console.warn("CoapClient got invalid 'methodCode', using default", options.method);
      }
    }

    let req = this.agent.request(options);

    console.log(`CoapClient applying form`);
    //console.dir(form);

    // apply form data
    if (typeof form.mediaType === "string") {
      console.log("CoapClient got Form 'mediaType'", form.mediaType);
      req.setOption("Accept", form.mediaType);
    }
    if (Array.isArray(form["coap:options"])) {
      console.log("CoapClient got Form 'options'", form["coap:options"]);
      let options = form["coap:options"] as Array<CoapOption>;
      for (let option of options) {
        req.setOption(option["coap:optionCode"], option["coap:optionValue"]);
      }
    } else if (typeof form["coap:options"] === "object") {
      console.warn("CoapClient got Form SINGLE-ENTRY 'options'", form["coap:options"]);
      let option = form["coap:options"] as CoapOption;
      req.setHeader(option["coap:optionCode"], option["coap:optionValue"]);
    }

    return req;
  }
}
