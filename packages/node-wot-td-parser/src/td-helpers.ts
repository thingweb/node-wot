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
 * Generic TD helper functions used across the code
 * These Helpers are used like this:
 * ```
 * import * as TDHelpers from './tdhelpers'
 *
 */

import logger from 'node-wot-logger';
import ThingDescription from "./thing-description";
import * as TD from "./thing-description";

/**
* Find interaction by name
* @param td ThingDescription instance that keeps the interactions
* @param name of the interaction which is searched for
*/
 function findInteractionByName(td : ThingDescription,  name: string) {
     let res = td.interactions.filter((ia) => ia.name === name)
     return (res.length > 0) ? res[0] : null;
 }

 /**
 * Find interaction by name AND interaction type
 * @param td ThingDescription instance that keeps the interactions
 * @param name of the interaction which is searched for
 */
 function findInteractionByNameType(td : ThingDescription,  name: string, pattern: TD.InteractionPattern) {
     let res = td.interactions.filter((ia) => ia.pattern === pattern && ia.name === name)
     return (res.length > 0) ? res[0] : null;
 }

 /**
 * Find interaction by semantic characteristics / vocabularies
 * @param td ThingDescription instance that keeps the interactions
 * @param vocabularies list of vocabularies which has to be annotated the resource interacion
 */
 function findInteractionBySemantics(td : ThingDescription,  vocabularies: Array<string>) {
    // let res = td.interactions.filter((ia) => ia.rdfType.filter((v)=> v.match(vocabularies)))

    //TODO

     return  "";
 }
