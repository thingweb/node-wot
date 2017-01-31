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
import ContentSerdes from '../types/content-serdes'


/**
 * Interaction resource that provides a Property
 */

export default class PropertyResourceListener implements ResourceListener {
    private readonly thing : ExposedThing
    private readonly description : TD.Interaction
    private readonly name : string

    constructor(thing : ExposedThing, property : TD.Interaction) {
        this.thing = thing;
        this.description = property;
        this.name = property.name;
    }

    public onRead() : Promise<Buffer> {
        return this.thing
        .getProperty(this.name)
        .then((value) =>{
            let bytes = ContentSerdes.valueToBytes(value) // TODO where to get media type
            return Promise.resolve(bytes)
        })
    }

    public onWrite(input : Buffer) : Promise<void> {
        let value = ContentSerdes.bytesToValue(input) // TODO where to get media type
        return this.thing.setProperty(this.name,value)
    }

    public onInvoke(input : Buffer) : Promise<Buffer> {
        return Promise.reject("not applicable")
    }

    public onUnlink() : Promise<void> {
        return Promise.reject("not applicable")
    }
}
