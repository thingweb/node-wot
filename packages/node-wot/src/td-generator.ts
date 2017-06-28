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

import logger from "node-wot-logger";
import Servient from "./servient"
import ExposedThing from "./exposed-thing"
import {ThingDescription} from "node-wot-td-tools"
import * as TD from "node-wot-td-tools"
import * as Helpers from "node-wot-helpers"


//@h0ru5: temporarely moved here to avoid circular dependencies

/** Based on the current definition of things'S/servient's  a TD represent is
* generated
* @param thing
* @param servient
*/
export function generateTD(thing : ExposedThing, servient : Servient ) : ThingDescription {

    logger.silly(`generateTD() \n\`\`\`\n${thing}\n\`\`\``);



    /* new td model instance */
    let genTD:ThingDescription = new ThingDescription()



    logger.debug(`generateTD() assign name ${thing.name}`);
    genTD.name = thing.name

    /* assign all interactions from ExposedThing */
    genTD.interaction = thing.getInteractions()

    logger.debug(`generateTD() found ${genTD.interaction.length} Interaction${genTD.interaction.length==1?"":"s"}`);
    for (let interaction of   genTD.interaction) {
      /* empty semantic type array*/
      interaction.semanticTypes = []
      /* assign interaction pattern to the rdf @type*/
      if(interaction.pattern === TD.InteractionPattern.Property) {

            interaction.semanticTypes.push("Property")
      }
      else if(interaction.pattern === TD.InteractionPattern.Action) {
            interaction.semanticTypes.push("Action")

      }
      if(interaction.pattern === TD.InteractionPattern.Event) {
          interaction.semanticTypes.push("Event")
      }


      let l = 0
      /* for each address, supported protocol, and media type an intreaction resouce is generated */
      for (let add of   Helpers.getAddresses()) {
        for(let ser of servient.getServers()) {
          for(let med of servient.getSupportedMediaTypes()) {

            /* if server is online !==-1 assign the href information */
            if(ser.getPort()!==-1) {
                let href:string = ser.getScheme()+"://" +add+":"+ser.getPort()+"/" + thing.name

          
                /* depending of the resource pattern, uri is constructed */
                if(interaction.pattern === TD.InteractionPattern.Property) {
                      interaction.link[l] = new TD.InteractionLink()
                      interaction.link[l].href = href+"/properties/" + interaction.name
                      interaction.link[l].mediaType = med
                }
                else if(interaction.pattern === TD.InteractionPattern.Action) {
                      interaction.link[l] = new TD.InteractionLink()
                      interaction.link[l].href = href+"/actions/" + interaction.name
                      interaction.link[l].mediaType = med
                }
                if(interaction.pattern === TD.InteractionPattern.Event) {
                      interaction.link[l] = new TD.InteractionLink()
                      interaction.link[l].href = href+"/events/" + interaction.name
                      interaction.link[l].mediaType = med
                }
                logger.debug(`generateTD() assign href  ${interaction.link[l].href } for interaction ${interaction.name}`);
                l++
              }
          }

        }

      }
      l=0 /* reset for next interactions */


    }



    return genTD;
}
