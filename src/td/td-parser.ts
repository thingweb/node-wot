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

import logger from "../logger";

import ThingDescription from "./thing-description";
import * as TD from "./thing-description";
import Servient from "../servient";
import ExposedThing from "../exposed-thing";

import { JsonMember, JsonObject, TypedJSON } from "typedjson";

export function generateTD(thing : ExposedThing, servient : Servient ) : ThingDescription {
    return null;
}

export function parseTDObject(td : Object) : ThingDescription {

    // FIXME Is this the best way to verify?
    return parseTDString(TypedJSON.stringify(td, {enableTypeHints: false})); // false, otherwise __type member is added
}

export function parseTDString(json : string) : ThingDescription {

    logger.silly(`parseTDString() parsing\n\`\`\`\n${json}\n\`\`\``);

    let td : ThingDescription = TypedJSON.parse(json, ThingDescription);

    logger.silly(`>>> TD base: ${td.base}`);

    logger.debug(`parseTDString() found ${td.interactions.length} Interaction${td.interactions.length==1?"":"s"}`);

    /** for each interaction assign the Interaction type (Property, Action, Event)
     * and, if "base" is given, normalize each Interaction link */
    for (let interaction of td.interactions) {

        // FIXME @mkovatsc Why does array.includes() not work?
        if (interaction.semanticTypes.indexOf(TD.InteractionPattern.Property.toString())!==-1) {
            logger.debug(` * Property '${interaction.name}'`);
            interaction.pattern = TD.InteractionPattern.Property;
        } else if (interaction.semanticTypes.indexOf(TD.InteractionPattern.Action.toString())!==-1) {
            logger.debug(` * Action '${interaction.name}'`);
            interaction.pattern = TD.InteractionPattern.Action;
        } else if (interaction.semanticTypes.indexOf(TD.InteractionPattern.Event.toString())!==-1) {
            logger.debug(` * Event '${interaction.name}'`);
            interaction.pattern = TD.InteractionPattern.Event;
        } else {
            logger.error(`parseTDString() found unknown Interaction pattern '${interaction.semanticTypes}'`);
        }

        /* if a base uri is used normalize all relative hrefs in links */
        if (td.base !== undefined) {
            logger.debug(`parseTDString() applying base '${td.base}' to href '${interaction.links[0].href}'`);

            var href:string = interaction.links[0].href;

            var url = require('url');

            /* url modul works only for http --> so replace any protocol to
            http and after resolving replace orign protocol back*/
            var n:number = td.base.indexOf(":");
            var pr:string = td.base.substr(0, n+1); // save origin protocol
            var uri_temp:string = td.base.replace(pr, "http:"); // replace protocol
            uri_temp = url.resolve(uri_temp, href) // URL resolving
            uri_temp = uri_temp.replace("http:", pr ); // replace protocol back to origin
            interaction.links[0].href = uri_temp;
        }
    }

    return td;
}

export function serializeTD(td : ThingDescription) : string {

    let json = TypedJSON.stringify(td);


    // FIXME #8 TypedJSON also stringifies undefined/null optional members
    let raw = JSON.parse(json)
    if (td.base===null || td.base===undefined) {
        delete raw.base
    }
    for (let interaction of raw.interactions) {
        if (interaction.inputData===null) delete interaction.inputData;
    }
    json = JSON.stringify(raw);
    

    logger.silly(`serializeTD() produced\n\`\`\`\n${json}\n\`\`\``);

    return json;
}
