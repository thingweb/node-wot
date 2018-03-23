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

import * as TD from "@node-wot/td-tools";

import {Content,ResourceListener} from "./protocol-interfaces"
import BasicResourceListener from "./basic-resource-listener";
import ExposedThing from "../exposed-thing";
import ContentSerdes from "../content-serdes";

/**
 * Interaction resource that provides a Property
 */
export default class PropertyResourceListener extends BasicResourceListener implements ResourceListener {

    public readonly name : string;
    private readonly thing : ExposedThing;

    constructor(thing : ExposedThing, name: string) {
        super();
        this.thing = thing;
        this.name = name;
    }

    public getType(): string {
        return "Property";
    }

    public onRead() : Promise<Content> {
        return this.thing
            .readProperty(this.name)
            .then((value) => {
                let content = ContentSerdes.valueToContent(value);
                return Promise.resolve(content);
            });
    }

    public onWrite(input : Content) : Promise<void> {
        let value;
        // FIXME: Better way than creating Promise only for reject in catch?
        try {
            value = ContentSerdes.contentToValue(input);
        } catch(err) {
            return new Promise<void>( (resolve, reject) => { reject(err); })
        }
        return this.thing.writeProperty(this.name, value);
    }
}
