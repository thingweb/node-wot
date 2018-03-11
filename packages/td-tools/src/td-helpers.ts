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
 * Generic TD helper functions used across the code
 * These Helpers are used like this:
 * ```
 * import * as TDHelpers from './tdhelpers'
 *
 */

import ThingDescription from './thing-description';
import * as TD from './thing-description';

/**
 * Find interaction by name
 * @param td ThingDescription instance that keeps the interactions
 * @param name of the interaction which is searched for
 */
export function findInteractionByName(td: ThingDescription, name: string) {
  let res = td.interaction.filter((ia) => ia.name === name)
  return (res.length > 0) ? res[0] : null;
}

/**
 * Find interaction by name AND interaction type
 * @param td ThingDescription instance that keeps the interactions
 * @param name of the interaction which is searched for
 */
export function findInteractionByNameType(td: ThingDescription, name: string, pattern: TD.InteractionPattern) {
  let res = td.interaction.filter((ia) => ia.pattern === pattern && ia.name === name)
  return (res.length > 0) ? res[0] : null;
}

/**
 * Find interaction by semantic characteristics / vocabularies
 * @param td ThingDescription instance that keeps the interactions
 * @param vocabularies list of vocabularies which has to be annotated the resource interacion
 */
export function findInteractionBySemantics(td: ThingDescription, vocabularies: Array<string>) {
  // let res = td.interactions.filter((ia) => ia.rdfType.filter((v)=> v.match(vocabularies)))

  // TODO

  return '';
}

//need two tests
export function findProtocol(td : ThingDescription) : string {
	let base:string = td.base;
	let columnLoc:number = base.indexOf(":");
	return base.substring(0,columnLoc);
}

export function findPort(td : ThingDescription) : number { 
	let base:string = td.base;
	let columnLoc:number= base.indexOf(':',6);
	let divLoc:number = base.indexOf('/',columnLoc);
	let returnString:string = base.substring(columnLoc+1, divLoc);
	return parseInt(returnString);
}