import * as TD from './thingdescription'
import ThingDescription from './thingdescription'
import TDInteraction from './thingdescription'
import ServedThing from '../servedthing'
import Servient from '../servient'

import { JsonMember, JsonObject, TypedJSON } from 'typedjson';

export function generateTD(thing : ServedThing, servient : Servient ) : ThingDescription {
    return null;
}

export function parseTDObj(td : Object) : ThingDescription {
    return parseTDString(JSON.stringify(td))
}

export function parseTDString(td : string) : ThingDescription {

        let td_obj = TypedJSON.parse(td,ThingDescription);
        let base = td_obj.base

        /** for each interaction assign the interaction type (Property, Action,
        EVent) and, if it the case, normalize each link information of the
        interaction */
        for (let interaction of td_obj.interactions) {

          // TODO: not very nice, maybe there is a more better way (check JSON-LD module)
          var interactionType = TypedJSON.stringify(interaction)

          if(interactionType.match("\"Property\"")) {
            interaction.interactionType = TD.interactionTypeEnum.property;
          }
          else if(interactionType.match("\"Action\"")) {
            interaction.interactionType = TD.interactionTypeEnum.action;
          }
          else  {
            interaction.interactionType = TD.interactionTypeEnum.event;
          }

          /* if a base uri is used normalize all relative hrefs in links */
          if(base!=null) {


            let href = interaction.links[0].href

            /* add '/' character if it is missing at the end of the base and
            beginning of the href field*/
            if(base.charAt(base.length-1)  != '/' &&  href.charAt(0) != '/') {
              href = '/' + href;
            }
            /* remove '/' if it occurs at the end of base and
            beginning of the href field */
            else if(base.charAt(base.length-1)  == '/' &&  href.charAt(0) == '/') {
              href = href.substr(1)
            }
            interaction.links[0].href = base + href;
          }
        }



        return td_obj;
}

export function serializeTD(td : ThingDescription) : string {

            // cp td object
           let td_cp : ThingDescription  = TypedJSON.parse(TypedJSON.stringify(td),ThingDescription);

           /* remove here all helper properties in the TD model before serializiation  */
           for (let interaction of td_cp.interactions) {
             delete interaction.interactionType
          }

           return TypedJSON.stringify(td_cp);
}
