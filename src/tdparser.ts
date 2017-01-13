import ThingDescription from './thingdescription'
import ServedThing from './servedthing'
import Servient from './servient'

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

        /* if a base uri is used normalize all relative hrefs in links */
        if(base!=null) {

          /** normalize each link information of the interaction */
          for (let interaction of td_obj.interactions) {

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

export function serializeTD(thing : ThingDescription) : string {
           return TypedJSON.stringify(thing);
}
