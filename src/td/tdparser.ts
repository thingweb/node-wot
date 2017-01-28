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

import * as TD from "./thingdescription";
import ThingDescription from "./thingdescription";
import TDInteraction from "./thingdescription";
import ServedThing from "../servedthing";
import Servient from "../servient";

import { JsonMember, JsonObject, TypedJSON } from "typedjson";

export function generateTD(thing : ServedThing, servient : Servient ) : ThingDescription {
    return null;
}

export function parseTDObj(td : Object) : ThingDescription {
    // @mkovatsc Why are we going back to string instead of validating the structure?
    // TODO we do not gain anything from the JSON tooling...
    return parseTDString(JSON.stringify(td))
}

export function parseTDString(td: string): ThingDescription {

    logger.silly(`parseTDString() parsing\n\`\`\`${td}\n\`\`\``);

    let tdObject = TypedJSON.parse(td, ThingDescription);

    logger.debug(`parseTDString() found ${tdObject.interactions.length} Interactions`);

    /** for each interaction assign the interaction type (Property, Action,
    EVent) and, if it the case, normalize each link information of the
    interaction */
    for (let interaction of tdObject.interactions) {

        // TODO: not very nice, maybe there is a more better way (check JSON-LD module)
        var interactionType = TypedJSON.stringify(interaction)

        if (interactionType.match("\"Property\"")) {
            interaction.interactionType = TD.interactionTypeEnum.property;
        } else if (interactionType.match("\"Action\"")) {
            interaction.interactionType = TD.interactionTypeEnum.action;
        } else if (interactionType.match("\"Event\"")) {
            interaction.interactionType = TD.interactionTypeEnum.event;
        } else {
            logger.error(`parseTDString() found unknown Interaction '${interactionType}'`);
        }

        /* if a base uri is used normalize all relative hrefs in links */
        if (tdObject.base !== undefined) {
            logger.debug(`parseTDString() applying base '${tdObject.base}' to href '${interaction.links[0].href}'`);

            let href = interaction.links[0].href;

            // FIXME implement proper URI arithmetic

            /* add '/' character if it is missing at the end of the base and
            beginning of the href field*/
            if (tdObject.base.slice(-1) !== '/' && href.charAt(0) !== '/') {
                href = '/' + href;
            }
            /* remove '/' if it occurs at the end of base and
            beginning of the href field */
            else if (tdObject.base.slice(-1) === '/' && href.charAt(0) === '/') {
                href = href.substr(1)
            }
            interaction.links[0].href = tdObject.base + href;
        }
    }
    return tdObject;
}

export function serializeTD(td: ThingDescription): string {

    // cp td object
    let td_cp: ThingDescription = TypedJSON.parse(TypedJSON.stringify(td), ThingDescription);

    /* remove here all helper properties in the TD model before serializiation  */
    for (let interaction of td_cp.interactions) {
        delete interaction.interactionType
    }

    return TypedJSON.stringify(td_cp);
}
