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

import { InteractionForm } from "@node-wot/td-tools";

export { default as HttpServer } from './http-server'
export { default as HttpClient } from './http-client'
export { default as HttpClientFactory } from './http-client-factory'
export { default as HttpsClientFactory } from './https-client-factory'
export * from './http-server'
export * from './http-client'
export * from './http-client-factory'
export * from './https-client-factory'

export class HttpForm extends InteractionForm {
    public "http:methodName"?: string; // "GET", "PUT", "POST", "DELETE"
    public "http:headers"?: Array<HttpHeader> | HttpHeader;
}

export class HttpHeader {
    public "http:fieldName": number;
    public "http:fieldValue": any;
}
