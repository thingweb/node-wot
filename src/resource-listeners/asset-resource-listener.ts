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

import {logger} from "../logger";

export default class AssetResourceListener implements ResourceListener {
    private asset : string;
    constructor(asset : string) {
        this.asset = asset;
    }

    public onRead() : Promise<Buffer> {
        logger.debug(`Reading asset`);
        return new Promise<Buffer>(
            (resolve,reject) => resolve(new Buffer(this.asset))
        );
    }

    public onWrite(value : Buffer) : Promise<void> {
        logger.debug(`Writing '${value.toString()}' to asset`);
        this.asset = value.toString();
        return new Promise<void>((resolve,reject) => resolve())
    }

    public onInvoke(value : Buffer) : Promise<Buffer> {
        logger.debug(`Invoking '${value.toString()}' on asset`);
        return new Promise<Buffer>(
            (resolve,reject) => resolve(new Buffer('TODO'))
        );
    }

    public onUnlink() : Promise<void> {
        logger.debug(`Unlinking asset`);
        return new Promise<void>((resolve,reject) => reject(new Error("Unlinking assets not allowed")))
    }
}