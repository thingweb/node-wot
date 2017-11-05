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
// import * as AddressHelper from 'node-wot-helpers';

import { JsonMember, JsonObject, TypedJSON } from 'typedjson-npm';

export function parseTDObject(td: Object): ThingDescription {
  // FIXME Is this the best way to verify?
  // disable TypeHints, otherwise __type member is added
  return parseTDString(TypedJSON.stringify(td, { enableTypeHints: false }));
}

export function parseTDString(json: string): ThingDescription {

  console.log(`parseTDString() parsing\n\`\`\`\n${json}\n\`\`\``);
  let td: ThingDescription = TypedJSON.parse(json, ThingDescription);

  if (td.security) console.log(`parseTDString() found security metadata`);

  console.log(`parseTDString() found ${td.interaction.length} Interaction${td.interaction.length === 1 ? '' : 's'}`);
  // for each interaction assign the Interaction type (Property, Action, Event)
  // and, if "base" is given, normalize each Interaction link
  for (let interaction of td.interaction) {

    // FIXME @mkovatsc Why does array.includes() not work?
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

  return td;
}

export function serializeTD(td: ThingDescription): string {

//for (let i of td.interaction) console.log("######", i.outputData);

// avoid enableTypeHints
 TypedJSON.config({"enableTypeHints": false});
 let json = TypedJSON.stringify(td);

  // FIXME TypedJSON also stringifies undefined/null optional members
  let raw = JSON.parse(json)
  if (td.security === null || td.security === undefined) {
    delete raw.security;
  }
  if (td.base === null || td.base === undefined) {
    delete raw.base;
  }
  for (let interaction of raw.interaction) {
    if (interaction.inputData === null) { delete interaction.inputData; }
    if (interaction.outputData === null) { delete interaction.outputData; }
    if (interaction.writable === null) { delete interaction.writable; }
    // FIXME TypedJSON also converts Array to Object with number keys
    if (interaction.outputData && interaction.outputData.required !== undefined) {
      console.log("### HOTFIX for TypedJSON ###");
      let reqs = [];
      for (let req in interaction.outputData.required) reqs.push(interaction.outputData.required[req]);
      interaction.outputData.required = reqs;
    }
  }
  json = JSON.stringify(raw);
  // End of workaround

  console.log(`serializeTD() produced\n\`\`\`\n${json}\n\`\`\``);

  return json;
}

