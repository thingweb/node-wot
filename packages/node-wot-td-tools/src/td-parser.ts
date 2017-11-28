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

import ThingDescription from './thing-description';
import * as TD from './thing-description';

import {plainToClass, classToPlain} from "class-transformer";
import "reflect-metadata";

export function parseTDObject(td: Object): ThingDescription {
  return plainToClass(ThingDescription, td);
}


export function parseTDString(json: string, normalize?: boolean): ThingDescription {
  console.log(`parseTDString() parsing\n\`\`\`\n${json}\n\`\`\``);
  // declare type as single instance because plainToClass has multiple signatures
  // see https://github.com/typestack/class-transformer/issues/97
  let td: ThingDescription = plainToClass(ThingDescription, JSON.parse(json) as ThingDescription);

  if (td.security) console.log(`parseTDString() found security metadata`);

  console.log(`parseTDString() found ${td.interaction.length} Interaction${td.interaction.length === 1 ? '' : 's'}`);
  // for each interaction assign the Interaction type (Property, Action, Event)
  // and, if "base" is given, normalize each Interaction link
  for (let interaction of td.interaction) {

    if(interaction.semanticTypes && interaction.semanticTypes.length > 0) {
      if (interaction.semanticTypes.indexOf(TD.InteractionPattern.Property.toString()) !== -1) {
        console.log(` * Property '${interaction.name}'`);
        interaction.pattern = TD.InteractionPattern.Property;
      } else if (interaction.semanticTypes.indexOf(TD.InteractionPattern.Action.toString()) !== -1) {
        console.log(` * Action '${interaction.name}'`);
        interaction.pattern = TD.InteractionPattern.Action;
      } else if (interaction.semanticTypes.indexOf(TD.InteractionPattern.Event.toString()) !== -1) {
        console.log(` * Event '${interaction.name}'`);
        interaction.pattern = TD.InteractionPattern.Event;
      } else {
        console.error(`parseTDString() found unknown Interaction pattern '${interaction.semanticTypes}'`);
      }
    } else {
      console.error(`parseTDString() found no Interaction pattern`);
    }

    if(normalize == null || normalize) {
      /* if a base uri is used normalize all relative hrefs in links */
      if (td.base !== undefined) {
        console.log(`parseTDString() applying base '${td.base}' to href '${interaction.link[0].href}'`);

        let href: string = interaction.link[0].href;

        let url = require('url');

        /* url modul works only for http --> so replace any protocol to
        http and after resolving replace orign protocol back*/
        let n: number = td.base.indexOf(':');
        let pr: string = td.base.substr(0, n + 1); // save origin protocol
        let uriTemp: string = td.base.replace(pr, 'http:'); // replace protocol
        uriTemp = url.resolve(uriTemp, href) // URL resolving
        uriTemp = uriTemp.replace('http:', pr); // replace protocol back to origin
        interaction.link[0].href = uriTemp;
      }
    }

  }

  return td;
}

export function serializeTD(td: ThingDescription): string {

  let jsonc = classToPlain(td);
  let json = JSON.stringify(jsonc);

  console.log(`serializeTD() produced\n\`\`\`\n${json}\n\`\`\``);

  return json;
}

