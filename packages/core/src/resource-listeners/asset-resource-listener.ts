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
 * Resource that provides an asset
 */

import BasicResourceListener from "./basic-resource-listener";
import { Content, ResourceListener } from "./protocol-interfaces";

export default class AssetResourceListener extends BasicResourceListener implements ResourceListener {

    private asset : Buffer;
    private mediaType : string;

    constructor(asset : string, mediaType : string = "text/plain") {
        super();
        this.mediaType = mediaType;
        this.asset = new Buffer(asset);
    }

    public getType(): string {
        return "Asset";
    }

    public onRead() : Promise<Content> {
        console.log(`Reading asset`);
        return new Promise<Content>(
            (resolve,reject) => resolve({ mediaType: this.mediaType, body: new Buffer(this.asset) })
        );
    }

    public onWrite(content : Content) : Promise<void> {
        console.log(`Writing '${content.body.toString()}' to asset`);
        this.mediaType = content.mediaType;
        this.asset = content.body;
        return new Promise<void>((resolve,reject) => resolve())
    }

    public onInvoke(content : Content) : Promise<Content> {
        console.log(`Invoking '${content.body.toString()}' on asset`);
        return new Promise<Content>(
            (resolve,reject) => resolve({ mediaType: this.mediaType, body: new Buffer("TODO") })
        );
    }
}