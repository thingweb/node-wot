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

import Servient from "./servient"
import ExposedThing from "./exposed-thing"
import {ThingDescription} from "node-wot-td-tools"
import * as TD from "node-wot-td-tools"
import * as Helpers from "./helpers";


//@h0ru5: temporarely moved here to avoid circular dependencies

/** Based on the current definition of things'S/servient's  a TD represent is
* generated
* @param thing
* @param servient
*/
export function generateTD(thing : ExposedThing, servient : Servient ) : ThingDescription {

    console.log(`generateTD() \n\`\`\`\n${thing}\n\`\`\``);

    /* new td model instance */
    let genTD:ThingDescription = new ThingDescription()

    console.log(`generateTD() assign name ${thing.name}`);
    genTD.name = thing.name

    /* assign all interactions from ExposedThing */
    genTD.interaction = thing.getInteractions()

    console.log(`generateTD() found ${genTD.interaction.length} Interaction${genTD.interaction.length==1?"":"s"}`);
    for (let interaction of genTD.interaction) {

      // empty semantic type array
      interaction.semanticTypes = []
      // assign interaction pattern to the rdf @type
      /* now done in td-parser.ts after split in pattern and semanticTypes
      if (interaction.pattern === TD.InteractionPattern.Property) {
        interaction.semanticTypes.push("Property");
      } else if(interaction.pattern === TD.InteractionPattern.Action) {
        interaction.semanticTypes.push("Action");
      } else if (interaction.pattern === TD.InteractionPattern.Event) {
        interaction.semanticTypes.push("Event");
      }
      */

      // link counter
      let l = 0;

      // for each address, supported protocol, and media type an intreaction resouce is generated
      for (let address of Helpers.getAddresses()) {
        for (let server of servient.getServers()) {
          for (let type of servient.getSupportedMediaTypes()) {

            /* if server is online !==-1 assign the href information */
            if(server.getPort() !== -1) {
              let href:string = server.scheme + "://" + address + ":" + server.getPort() + "/" + thing.name;

              /* depending of the resource pattern, uri is constructed */
              if (interaction.pattern === TD.InteractionPattern.Property) {
                interaction.link[l] = new TD.InteractionLink();
                interaction.link[l].href = href + "/properties/" + interaction.name;
                interaction.link[l].mediaType = type;
              }
              else if (interaction.pattern === TD.InteractionPattern.Action) {
                interaction.link[l] = new TD.InteractionLink();
                interaction.link[l].href = href + "/actions/" + interaction.name;
                interaction.link[l].mediaType = type;
              }
              if (interaction.pattern === TD.InteractionPattern.Event) {
                interaction.link[l] = new TD.InteractionLink();
                interaction.link[l].href = href + "/events/" + interaction.name;
                interaction.link[l].mediaType = type;
              }
              // TODO debug-level
              console.log(`generateTD() assigns href '${interaction.link[l].href}' to Interaction '${interaction.name}'`);
              ++l;
            }
          }
        }
      }

      // reset counter for next iteration
      l = 0;
    }

    return genTD;
}
