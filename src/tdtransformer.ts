
// TD V1 https://w3c.github.io/wot/current-practices/wot-practices-beijing-2016.html
// TD V2 2017, USA, Santa Clara (FIXLINK http://w3c.github.io/wot/current-practices/wot-practices.html)

import { JsonMember, JsonObject, TypedJSON } from 'typedjson';

export function transformTDV1StringToV2String(td1 : string) : Object {
  var td2 = JSON.parse(td1);

  // TODO
  return td2;
}

export function transformTDV1ObjToV2Obj(td1 : Object) : Object {
  return transformTDV1StringToV2String(JSON.stringify(td1))
}

export function transformTDV2StringToV1String(td2 : string) : Object {
  var td1 = JSON.parse(td2);
  if(td1.interactions != null) {
    td1.property = td1.interactions;
    td1.interactions = null;
  }

  return td1;
}

export function transformTDV2ObjToV1Obj(td2 : Object) : Object {
  return transformTDV2StringToV1String(JSON.stringify(td2));
}

// export function generateTD(thing : ServedThing, servient : Servient ) : ThingDescription {
//     return null;
// }

// export function parseTDObj(td : Object) : ThingDescription {
//     return parseTDString(JSON.stringify(td))
// }

// export function parseTDString(td : string) : ThingDescription {

//         let td_obj = TypedJSON.parse(td,ThingDescription);
//         let base = td_obj.base

//         /* if a base uri is used normalize all relative hrefs in links */
//         if(base!=null) {

//           /** normalize each link information of the interaction */
//           for (let interaction of td_obj.interactions) {

//             let href = interaction.links[0].href

//             /* add '/' character if it is missing at the end of the base and
//             beginning of the href field*/
//             if(base.charAt(base.length-1)  != '/' &&  href.charAt(0) != '/') {
//               href = '/' + href;
//             }
//             /* remove '/' if it occurs at the end of base and
//             beginning of the href field */
//             else if(base.charAt(base.length-1)  == '/' &&  href.charAt(0) == '/') {
//               href = href.substr(1)
//             }
//             interaction.links[0].href = base + href;
//           }
//         }



//         return td_obj;
// }

// export function serializeTD(thing : ThingDescription) : string {
//            return TypedJSON.stringify(thing);
// }
