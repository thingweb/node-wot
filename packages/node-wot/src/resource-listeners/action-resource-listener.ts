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

import {ResourceListener,Content} from "node-wot-protocols"
import BasicResourceListener from "./basic-resource-listener";
import ExposedThing from "../exposed-thing";
import * as TD from "node-wot-td-tools";
import ContentSerdes from "node-wot-content-serdes";

/**
 * Interaction resource that provides an Action
 */
export default class ActionResourceListener extends BasicResourceListener implements ResourceListener {

    private readonly thing : ExposedThing;
    private readonly description : TD.Interaction;
    private readonly name : string;

    constructor(thing: ExposedThing, action: TD.Interaction) {
        super();
        this.thing = thing;
        this.description = action;
        this.name = action.name;
    }

    public onInvoke(value: Content): Promise<Content> {
        let param = ContentSerdes.bytesToValue(value);
        return this.thing.invokeAction(this.name, param).then((value) => {
            // TODO do assertion with this.description and spit warning?
            if (value === undefined) {
                // action without outputData - skip ContentSerdes
                return { mediaType: null, body: null };
                // TODO set status code (TODO) to 2.04
            } else {
                return ContentSerdes.valueToBytes(value);
            }
        });
    }
}
