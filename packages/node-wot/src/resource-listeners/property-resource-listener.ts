/*
 * W3C Software License
 *
 * Copyright (c) 2017 the thingweb community
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

import {Content,ResourceListener} from "./protocol-interfaces"
import BasicResourceListener from "./basic-resource-listener";
import ExposedThing from "../exposed-thing";
import * as TD from "node-wot-td-tools";
import ContentSerdes from "../content-serdes";
/**
 * Interaction resource that provides a Property
 */
export default class PropertyResourceListener extends BasicResourceListener implements ResourceListener {

    private readonly thing : ExposedThing;
    private readonly description : TD.Interaction;
    private readonly name : string;

    constructor(thing : ExposedThing, property : TD.Interaction) {
        super();
        this.thing = thing;
        this.description = property;
        this.name = property.name;
    }

    public onRead() : Promise<Content> {
        return this.thing
            .getProperty(this.name)
            .then((value) => {
                let bytes = ContentSerdes.valueToBytes(value); // TODO where to get media type
                return Promise.resolve(bytes);
            });
    }

    public onWrite(input : Content) : Promise<void> {
        let value = ContentSerdes.bytesToValue(input); // TODO where to get media type
        return this.thing.setProperty(this.name, value);
    }
}
