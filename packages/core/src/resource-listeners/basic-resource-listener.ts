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
import { ResourceListener, Content } from "./protocol-interfaces"

export default class BasicResourceListener implements ResourceListener {

    constructor() { }

    public getType(): string {
        return "Basic";
    }

    public onRead(): Promise<Content> {
        return Promise.reject(new Error("Method Not Allowed"));
    }

    public onWrite(content: Content): Promise<void> {
        return Promise.reject(new Error("Method Not Allowed"));
    }

    public onInvoke(content: Content): Promise<Content> {
        return Promise.reject(new Error("Method Not Allowed"));
    }

    public onUnlink(): Promise<void> {
        return Promise.reject(new Error("Method Not Allowed"));
    }
}
