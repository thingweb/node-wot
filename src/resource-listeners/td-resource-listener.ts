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

import ExposedThing from "../exposed-thing";
import * as TD from "../td/thing-description";
import ContentSerdes from "../types/content-serdes"
/**
 * Resource that provides a Thing Description
 */
export default class TDResourceListener {
    private readonly thing : ExposedThing;

    constructor(thing : ExposedThing) {
        this.thing = thing;
    }

    public onRead() : Promise<Buffer> {
        return Promise.resolve(ContentSerdes.valueToBytes(this.thing.getDescription()))
    }

    public onWrite(value : Buffer) : Promise<void> {
        return Promise.reject(new Error("not implemented yet"))
    }

    public onInvoke(value : Buffer) : Promise<Buffer> {
        return Promise.reject(new Error("not implemented yet"))
    }

    public onUnlink() : Promise<void> {
        return Promise.reject(new Error("not implemented yet"))
    }
}
