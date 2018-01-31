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


const useBuiltInParser : boolean = true;

export function parseTDObject(td: Object): ThingDescription {
  return plainToClass(ThingDescription, td);
}


function stringToThingDescription(tdJson: string) : ThingDescription {
  let tdPlain = JSON.parse(tdJson);
  let td: ThingDescription = new ThingDescription();

  for (var fieldNameRoot in tdPlain) {
    if (tdPlain.hasOwnProperty(fieldNameRoot)) {
        switch(fieldNameRoot) {
        case "@context":
          if(typeof tdPlain[fieldNameRoot] === "string" && (
              tdPlain[fieldNameRoot] === TD.DEFAULT_HTTP_CONTEXT ||
              tdPlain[fieldNameRoot] === TD.DEFAULT_HTTPS_CONTEXT
          )) {
            // default set in constructor already
          } else if(Array.isArray(tdPlain[fieldNameRoot])) {
            for (let contextEntry of tdPlain[fieldNameRoot]) {
              if(typeof contextEntry === "string" && (
                contextEntry === TD.DEFAULT_HTTP_CONTEXT ||
                contextEntry === TD.DEFAULT_HTTPS_CONTEXT
              )) {
                // default set in constructor already
              } else if(typeof contextEntry === "string") {
                td.context.push(contextEntry);
              } else if(typeof contextEntry === "object") {
                td.context.push(contextEntry);
              } else {
                console.error("@context field entry of array of unknown type");
              }
            }
          } else {
            console.error("@context field neither of type array nor string");
          }
          break;
        case "name":
          if(typeof tdPlain[fieldNameRoot] === "string") {
            td.name = tdPlain[fieldNameRoot];
          } else {
            console.error("name field not of type string");
          }
          break;
        case "base":
          if(typeof tdPlain[fieldNameRoot] === "string") {
            td.base = tdPlain[fieldNameRoot];
          } else {
            console.error("base field not of type string");
          }
          break;
        case "@type": 
          if(typeof tdPlain[fieldNameRoot] === "string" && tdPlain[fieldNameRoot] === TD.DEFAULT_THING_TYPE) {
            // default, additional @types to "Thing" only
          } else if(Array.isArray(tdPlain[fieldNameRoot])) {
            for (let typeEntry of tdPlain[fieldNameRoot]) {
              if(typeof typeEntry === "string" && typeEntry === TD.DEFAULT_THING_TYPE ) {
                // default, additional @types to "Thing" only
              } else if(typeof tdPlain[fieldNameRoot] === "string") {
                td.semanticType.push(typeEntry);
              }
            }
          } else {
            console.error("@type field neither of type array nor string");
          }
          break;
        case "security": 
          td.security = tdPlain[fieldNameRoot];
          break;
        case "interaction": 
          if(Array.isArray(tdPlain[fieldNameRoot])) {
            for (let interactionEntry of tdPlain[fieldNameRoot]) {
              if(typeof interactionEntry === "object") {
                let inter = new TD.Interaction();
                td.interaction.push(inter);    
                for (var fieldNameInteraction in interactionEntry) {
                  if (interactionEntry.hasOwnProperty(fieldNameInteraction)) {
                    switch(fieldNameInteraction) {
                    case "name":
                      if(typeof interactionEntry[fieldNameInteraction] === "string") {
                        inter.name = interactionEntry[fieldNameInteraction];
                      } else {
                        console.error("name field of interaction not of type string");
                      }
                      break;
                    case "@type":
                      if(typeof interactionEntry[fieldNameInteraction] === "string") {
                        inter.semanticTypes.push(interactionEntry[fieldNameInteraction]);
                      } else if(Array.isArray(interactionEntry[fieldNameInteraction])) {
                        for (let typeInteractionEntry of interactionEntry[fieldNameInteraction]) {
                          if(typeof typeInteractionEntry === "string") {
                            inter.semanticTypes.push(typeInteractionEntry);
                          } else {
                            console.error("interaction @type field not of type string");
                          }
                        } 
                      } else {
                        console.error("@type field of interaction neither of type array nor string");
                      }
                      break;
                    case "outputData":
                      inter.outputData = interactionEntry[fieldNameInteraction];
                      break;
                    case "writable":
                      if(typeof interactionEntry[fieldNameInteraction] === "boolean") {
                        inter.writable = interactionEntry[fieldNameInteraction];
                      } else {
                        console.error("writable field of interaction not of type boolean");
                      }
                      break;
                    case "observable":
                      if(typeof interactionEntry[fieldNameInteraction] === "boolean") {
                        inter.observable = interactionEntry[fieldNameInteraction];
                      } else {
                        console.error("observable field of interaction not of type boolean");
                      }
                      break;
                    case "link": /* link replaced by form */
                    case "form":
                      // InteractionLink
                      if(Array.isArray(interactionEntry[fieldNameInteraction])) {
                        for (let formInteractionEntry of interactionEntry[fieldNameInteraction]) {
                          if(typeof formInteractionEntry === "object") {
                            let interLink = new TD.InteractionLink();
                            inter.link.push(interLink);
                            for (var fieldNameForm in formInteractionEntry) {
                              if (formInteractionEntry.hasOwnProperty(fieldNameForm)) {
                                switch(fieldNameForm) {
                                case "href":
                                  if(typeof formInteractionEntry[fieldNameForm] === "string") {
                                    interLink.href = formInteractionEntry[fieldNameForm];
                                  } else {
                                    console.error("interaction form/link href field entry not of type string");
                                  }
                                  break;
                                case "mediaType":
                                  if(typeof formInteractionEntry[fieldNameForm] === "string") {
                                    interLink.mediaType = formInteractionEntry[fieldNameForm];
                                  } else {
                                    console.error("interaction form/link mediaType field entry not of type string");
                                  }
                                  break;
                                default:
                                  break;
                                }
                              }
                            }
                          } else {
                            console.error("interaction form/link field entry not of type object");
                          }
                        } 
                      } else {
                        console.error("form/link field of interaction not of type array");
                      }
                      break;
                    default:
                      // TODO prefix/context parsing metadata
                      let md  : WoT.SemanticMetadata = {
                        type: {
                          name: fieldNameInteraction,
                          context: "TODO"
                          // ,
                          // prefix: "p" 
                        },
                        value: interactionEntry[fieldNameInteraction]
                      };
                      inter.metadata.push(md);
                      break;
                    }
                  }
                }
              } else {
                console.error("interactionEntry field not of type object");
              }
            }
          } else {
            console.error("interaction field not of type array");
          }
          break;
        default:
          // metadata
          // TODO prefix/context parsing metadata
          let md  : WoT.SemanticMetadata = {
            type: {
              name: fieldNameRoot,
              context: "TODO"
              // ,
              // prefix: "p" 
            },
            value: tdPlain[fieldNameRoot]
          };
          td.metadata.push(md);
          break;
        }
    }
  }

  return td;
}

function thingDescriptionToString(td: ThingDescription) : string {
  let tdObj : any = {};
  // @context
  tdObj["@context"] = td.context;
  // name
  tdObj.name = td.name;
  // base
  tdObj.base = td.base;
  // @type + "Thing"
  tdObj["@type"] = [TD.DEFAULT_THING_TYPE];
  for(let semType of td.semanticType) {
    tdObj["@type"].push(semType);
  }
  // security
  tdObj.security = td.security;
  // interaction
  tdObj.interaction = [];
  for(let inter of td.interaction) {
    let interObj : any = {};
    tdObj.interaction.push(interObj);

    // name
    interObj.name = inter.name;
    // @type
    if(inter.pattern == TD.InteractionPattern.Property) {
      interObj["@type"] = ["Property"];
    } else if(inter.pattern == TD.InteractionPattern.Action) {
      interObj["@type"] = ["Action"];
    } else if(inter.pattern == TD.InteractionPattern.Event) {
      interObj["@type"] = ["Event"];
    }
    for(let semType of inter.semanticTypes) {
      if(semType != "Property" && semType != "Action" && semType != "Event") {
        interObj["@type"].push(semType);
      }
    }
    // outputData
    if(inter.outputData) {
      interObj.outputData = inter.outputData;
    }
    // writable
    interObj.writable = inter.writable;
    // observable
    interObj.observable = inter.observable;
    // form (link)
    interObj.form = [];
    for(let linkEntry of inter.link) {
      let linkEntryObj : any = {};
      if(linkEntry.href) {
        linkEntryObj.href = linkEntry.href;
      }
      if(linkEntry.mediaType) {
        linkEntryObj.mediaType = linkEntry.mediaType;
      } else {
        linkEntryObj.mediaType = "application/json";
      }
      interObj.form.push(linkEntryObj);
    }

    // metadata
    for(let md of inter.metadata) {
      // TODO align with parsing method
      interObj[md.type.name] = md.value;
    }
  }
  // metadata
  for(let md of td.metadata) {
    // TODO align with parsing method
    tdObj[md.type.name] = md.value;
  }

  return JSON.stringify(tdObj);
}

export function parseTDString(json: string, normalize?: boolean): ThingDescription {
  console.log(`parseTDString() parsing\n\`\`\`\n${json}\n\`\`\``);
  // declare type as single instance because plainToClass has multiple signatures
  // see https://github.com/typestack/class-transformer/issues/97
  let td: ThingDescription = useBuiltInParser ? stringToThingDescription(json) :  plainToClass(ThingDescription, JSON.parse(json) as ThingDescription);

  if (td.security) console.log(`parseTDString() found security metadata`);

  console.log(`parseTDString() found ${td.interaction.length} Interaction${td.interaction.length === 1 ? '' : 's'}`);
  // for each interaction assign the Interaction type (Property, Action, Event)
  // and, if "base" is given, normalize each Interaction link
  for (let interaction of td.interaction) {

    // moving Interaction Pattern information to 'pattern' field
    let indexProperty = interaction.semanticTypes.indexOf(TD.InteractionPattern.Property.toString());
    let indexAction = interaction.semanticTypes.indexOf(TD.InteractionPattern.Action.toString());
    let indexEvent = interaction.semanticTypes.indexOf(TD.InteractionPattern.Event.toString());
    if (indexProperty !== -1) {
      console.log(` * Property '${interaction.name}'`);
      interaction.pattern = TD.InteractionPattern.Property;
      interaction.semanticTypes.splice(indexProperty, 1);
    } else if (indexAction !== -1) {
      console.log(` * Action '${interaction.name}'`);
      interaction.pattern = TD.InteractionPattern.Action;
      interaction.semanticTypes.splice(indexAction, 1);
    } else if (indexEvent !== -1) {
      console.log(` * Event '${interaction.name}'`);
      interaction.pattern = TD.InteractionPattern.Event;
      interaction.semanticTypes.splice(indexEvent, 1);
    } else {
      console.error(`parseTDString() found no Interaction pattern`);
    }

    if (normalize == null || normalize) {
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

  // merging Interaction Pattern with semantic annotations
  for (let interaction of td.interaction) {
    interaction.semanticTypes.unshift(interaction.pattern.toString());
  }

  let json : string;
  if (useBuiltInParser) {
    json = thingDescriptionToString(td);
  } else {
    let jsonc = useBuiltInParser ? thingDescriptionToString : classToPlain(td);
    json = JSON.stringify(jsonc);
  }

  console.log(`serializeTD() produced\n\`\`\`\n${json}\n\`\`\``);

  return json;
}
