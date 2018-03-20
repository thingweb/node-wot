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

export { default as CoapServer } from "./coap-server";
export { default as CoapClientFactory } from "./coap-client-factory";
export { default as CoapClient } from "./coap-client";

export * from "./coap-server";
export * from "./coap-client-factory";
export * from "./coap-client";

export class CoapForm extends InteractionForm {
    public "coap:methodCode"?: number; // 1=0.01=GET, 2=0.02=POST, 3=0.03=PUT, 4=0.04=DELETE
    public "coap:options"?: Array<CoapOption> | CoapOption;
}

export class CoapOption {
    public "coap:optionCode": number;
    public "coap:optionValue": any;
}

export declare interface CoapRequestConfig {
    agent?: Object,
    hostname?: string,
    port?: number,
    pathname?: string,
    query?: string,
    observe?: boolean,
    multicast?: boolean,
    confirmable?: boolean,
    method?: string
}
