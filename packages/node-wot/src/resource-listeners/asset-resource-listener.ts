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
 * Resource that provides an asset
 */

import BasicResourceListener from "./basic-resource-listener";
import {Content,ResourceListener} from "node-wot-protocols"

export default class AssetResourceListener extends BasicResourceListener implements ResourceListener {

    private asset : Buffer;
    private mediaType : string;

    constructor(asset : string, mediaType : string = "text/plain") {
        super();
        this.mediaType = mediaType;
        this.asset = new Buffer(asset);
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