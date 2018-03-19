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

import Servient from "./servient"
import ExposedThing from "./exposed-thing"
import { Thing } from "@node-wot/td-tools"
import * as TD from "@node-wot/td-tools"
import * as Helpers from "./helpers";


/** Copies TD members from Thing and adds Servient metadata (security, form)
* generated
* @param thing
* @param servient
*/
export function generateTD(thing: ExposedThing, servient: Servient): Thing {

  // FIXME necessary to create a copy? security and binding data needs to be filled in...
  // Could pass Thing data and binding data separately to serializeTD()?
  let genTD: Thing = new Thing();
  genTD.semanticType = thing.semanticType.slice(0);
  genTD.name = thing.name;
  genTD.id = thing.id;
  // TODO security
  genTD.security = [{ description: "node-wot development Servient, no security" }];
  genTD.metadata = thing.metadata.slice(0);
  genTD.interaction = thing.interaction.slice(0); // FIXME: not a deep copy
  genTD.link = thing.link.slice(0); // FIXME: not a deep copy

  // fill in binding data
  console.debug(`generateTD() found ${genTD.interaction.length} Interaction${genTD.interaction.length == 1 ? "" : "s"}`);
  for (let interaction of genTD.interaction) {

    // reset as slice() does not make a deep copy
    interaction.form = [];

    // a form is generated for each address, supported protocol, and mediatype
    for (let address of Helpers.getAddresses()) {
      for (let server of servient.getServers()) {
        for (let type of servient.getOffereddMediaTypes()) {

          /* if server is online !==-1 assign the href information */
          if (server.getPort() !== -1) {
            let href: string = server.scheme + "://" + address + ":" + server.getPort() + "/" + thing.name;

            /* depending of the resource pattern, uri is constructed */
            if (interaction.pattern === TD.InteractionPattern.Property) {
              interaction.form.push(new TD.InteractionForm(href + "/properties/" + interaction.name, type));
            } else if (interaction.pattern === TD.InteractionPattern.Action) {
              interaction.form.push(new TD.InteractionForm(href + "/actions/" + interaction.name, type));
            } else if (interaction.pattern === TD.InteractionPattern.Event) {
              interaction.form.push(new TD.InteractionForm(href + "/events/" + interaction.name, type));
            }
            console.debug(`generateTD() assigns href '${interaction.form[interaction.form.length - 1].href}' to Interaction '${interaction.name}'`);
          }
        }
      }
    }
  }

  return genTD;
}
