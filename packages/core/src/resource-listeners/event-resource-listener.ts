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
 * Interaction resource that provides an Event
 */

import { Observable } from 'rxjs/Observable';
import { PartialObserver } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import * as TD from "@node-wot/td-tools";

import BasicResourceListener from "./basic-resource-listener";
import { ResourceListener } from "./protocol-interfaces";
import ExposedThing from "../exposed-thing";
import { ContentSerdes, Content } from "../content-serdes";

/**
 * Interaction resource that provides an Action
 */
export default class EventResourceListener extends BasicResourceListener implements ResourceListener {

    public readonly name: string;
    private readonly subject: Subject<Content>;

    constructor(name: string, subject: Subject<Content>) {
        super();
        this.name = name;
        this.subject = subject;
    }

    public getType(): string {
        return "Event";
    }

    public subscribe(obs: PartialObserver<Content>): Subscription  {
        return this.subject.subscribe(obs);
    }
}
