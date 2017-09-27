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

import {ResourceListener,Content} from "./protocol-interfaces"
import BasicResourceListener from "./basic-resource-listener";
import ExposedThing from "../exposed-thing";
import * as TD from "node-wot-td-tools";
import ContentSerdes from "../content-serdes";

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
