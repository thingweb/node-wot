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

import Servient from "./servient";
import ExposedThing from "./exposed-thing";
import ConsumedThing from "./consumed-thing";
import * as Helpers from "./helpers";
import * as TDParser from "node-wot-td-tools";

import * as WoT from 'wot-typescript-definitions';
import { ThingDescription } from 'node-wot-td-tools';

import {Observable} from 'rxjs/Observable';

export default class WoTImpl implements WoT.WoTFactory {
    private srv: Servient;

    constructor(srv: Servient) {
        this.srv = srv;
    }

    /** @inheritDoc */
    discover(filter?: WoT.ThingFilter): Observable<ConsumedThing> {
        return new Observable<ConsumedThing>(subscriber => {
            //find things
            //for each found thing
            //subscriber.next(thing);
            subscriber.complete();
        });
    }

    /** @inheritDoc */
    consume(url: USVString): Promise<ConsumedThing> {
        // HACK to identify string representation vs URL
        url = url.trim();

        if(url.startsWith("{")) {
            // JSON object
            return this.consumeDescription(url);
        } else {
            // URL
            return new Promise<ConsumedThing>((resolve, reject) => {
                let client = this.srv.getClientFor(Helpers.extractScheme(url));
                console.info(`WoTImpl consuming TD from ${url} with ${client}`);
                client.readResource(url)
                    .then((content) => {
                        if (content.mediaType !== "application/json")
                            console.warn(`WoTImpl parsing TD from '${content.mediaType}' media type`);
                        let td = TDParser.parseTDString(content.body.toString());
                        let thing = new ConsumedThing(this.srv, td);
                        client.stop();
                        resolve(thing);
                    })
                    .catch((err) => { console.error(err); });
            });
        }
    }

    /**
     * consume a thing description from an string and return a client representation object
     *
     * @param thingDescription a thing description
     */
    consumeDescription(thingDescription: string): Promise<ConsumedThing> {
        return new Promise<ConsumedThing>((resolve, reject) => {
            console.info(`WoTImpl consuming TD from object`);
            let td = TDParser.parseTDString(thingDescription);
            let thing = new ConsumedThing(this.srv, td);
            resolve(thing);
        });
    }

    /**
     * create a new Thing
     *
     * @param name name/identifier of the thing to be created
     */
    // createThing(name: string): Promise<WoT.DynamicThing> {
    expose(init: WoT.ThingInit): Promise<ExposedThing> {
        return new Promise<ExposedThing>((resolve, reject) => {
            console.info(`WoTImpl creating new ExposedThing '${init.name}'`);
            let mything = new ExposedThing(this.srv, init.name);
            if (this.srv.addThing(mything)) {
                resolve(mything);
            } else {
                reject(new Error("WoTImpl could not create Thing: " + mything))
            }
        });
    }

// <<<<<<< HEAD
    // /**
    //  * create a new Thing based on a thing description, given by a URI
    //  *
    //  * @param uri URI of a thing description to be used as "template"
    //  */
    // createFromDescriptionUri(uri: string): Promise<WoT.ExposedThing> {
    //     return new Promise((resolve, reject) => {
    //         let client = this.srv.getClientFor(uri);
    //         console.info(`WoTImpl creating new ExposedThing from TD at ${uri} with ${client}`);
    //         client.readResource(uri).then((content) => {
    //             if (content.mediaType !== "application/json")
    //                 console.warn(`WoTImpl parsing TD from '${content.mediaType}' media type`);
    //                 let thingDescription :ThingDescription= TDParser.parseTDString(content.body.toString());//ThingDescription type doesnt work for some reason
                
    //                 //this.createFromDescription(thingDescription);
    //         }).catch((err) => console.error("WoTImpl failed fetching TD", err));
    //     });
    // }
// =======
//     /**
//      * create a new Thing based on a thing description, given by a URI
//      *
//      * @param uri URI of a thing description to be used as "template"
//      */
//     createFromDescriptionUri(uri: string): Promise<WoT.ExposedThing> {
//         return new Promise((resolve, reject) => {
//             let client = this.srv.getClientFor(uri);
//             console.info(`WoTImpl creating new ExposedThing from TD at ${uri} with ${client}`);
//             client.readResource(uri).then((content) => {
//                 if (content.mediaType !== "application/json")
//                     console.warn(`WoTImpl parsing TD from '${content.mediaType}' media type`);
//                 let thingDescription: ThingDescription = TDParser.parseTDString(content.body.toString());//ThingDescription type doesnt work for some reason

//                 //this.createFromDescription(thingDescription);
//             }).catch((err) => console.error("WoTImpl failed fetching TD", err));
//         });
//     }
// >>>>>>> b8fdb1c903090bbd87eded2345f05f757364e8a0

    createFromDescription(thingDescription: ThingDescription): Promise<WoT.ExposedThing> {
        return new Promise((resolve, reject) => {
            //not necessary to parse if it is already obj
            //let thingdesc = TDParser.parseTDObject(thingDescription);
            console.info(`WoTImpl creating new ExposedThing from object`);
            let myThing = new ExposedThing(this.srv, thingDescription.name);
            if (this.srv.addThing(myThing)) {
                //add base field
                //add actions:
                //get the interactions
                //for each interaction, add it like event, action or property (first actions)
                let interactions: Array<any> = thingDescription.interaction;
                for (var i = 0; i < interactions.length; i++) {
                    let currentInter = interactions[i];
                    let interTypes = currentInter['semanticTypes'];
                    if (interTypes.indexOf("Action") > -1) {
                        let actionName: string = currentInter.name;
// <<<<<<< HEAD
                        // try{
                            let inputValueType: Object = currentInter.inputData.valueType;
                            let outputValueType: Object = currentInter.outputData.valueType;
                            let init: WoT.ThingActionInit;
                            init.name = actionName;
                            // TODO inputValueType,outputValueType
                            myThing.addAction(init); // actionName,inputValueType,outputValueType
                        // }catch(err){
                        //     //it means that we couldn't find the input AND output, we'll try individual cases
                        //     try{
                        //         let inputValueType: Object = currentInter.inputData.valueType;
                        //         myThing.addAction(actionName,inputValueType);
                        //     } catch (err2){
                        //         try{
                        //             let outputValueType: Object = currentInter.outputData.valueType;
                        //             myThing.addAction(actionName,{},outputValueType);
                        //         }catch(err3){
                        //             //worst case, we just create with the name
                        //                     //should there be the semantics case as well?
                        //             myThing.addAction(actionName);
                        //         }
                        //     }      
                        // } 
// =======
//                         try {
//                             let inputType: Object = currentInter.inputData;
//                             let outputType: Object = currentInter.outputData;
//                             myThing.addAction(actionName, inputType, outputType);
//                         } catch (err) {
//                             //it means that we couldn't find the input AND output, we'll try individual cases
//                             try {
//                                 let inputType: Object = currentInter.inputData;
//                                 myThing.addAction(actionName, inputType);
//                             } catch (err2) {
//                                 try {
//                                     let outputType: Object = currentInter.outputData;
//                                     myThing.addAction(actionName, {}, outputType);
//                                 } catch (err3) {
//                                     //worst case, we just create with the name
//                                     //should there be the semantics case as well?
//                                     myThing.addAction(actionName);
//                                 }
//                             }
//                         }
// >>>>>>> b8fdb1c903090bbd87eded2345f05f757364e8a0

                    } else if (interTypes.indexOf("Property") > -1) {
                        //maybe there should be more things added?
                        let propertyName: string = currentInter.name;
// <<<<<<< HEAD
                        let outputValueType: Object = currentInter.outputData.valueType;
                        let init : WoT.ThingPropertyInit;
                        init.name = propertyName;
                        myThing.addProperty(init); // propertyName, outputValueType
                        
                        
                    } else if (interTypes.indexOf("Event") > -1) {
                        //currently there isnt much implemented that's why I add only the name and nothing else
                        let eventName: string = currentInter.name;
                        let init : WoT.ThingEventInit;
                        init.name = eventName;
                        myThing.addEvent(init); // eventName
                       
// =======
//                         let outputType: Object = currentInter.outputData;
//                         myThing.addProperty(propertyName, outputType);
//                         myThing.setWritable(propertyName, currentInter.writable);


//                     } else if (interTypes.indexOf("Event") > -1) {
//                         //currently there isnt much implemented that's why I add only the name and nothing else
//                         let eventName: string = currentInter.name;
//                         myThing.addEvent(eventName);

// >>>>>>> b8fdb1c903090bbd87eded2345f05f757364e8a0
                    } else {
                        console.info("Wrong interaction type for number ", i);
                    }

                }
                resolve(myThing);
            } else {
                reject(new Error("WoTImpl could not create Thing from object: " + myThing))
            }
        });
    }
}
