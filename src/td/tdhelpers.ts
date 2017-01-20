/**
 * Generic TD helper functions used across the code
 * These Helpers are used like this:
 * ```
 * import * as TDHelpers from './tdhelpers'
 *

 */

 import * as TD from './thingdescription'
 import ThingDescription from './thingdescription'

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
 function findInteractionByNameType(td : ThingDescription,  name: string, type: TD.interactionTypeEnum) {
     let res = td.interactions.filter((ia) => ia.interactionType === type && ia.name === name)
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
