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

"use strict";

// global W3C WoT Scripting API definitions
import _, { WoTFactory } from "wot-typescript-definitions";
// node-wot implementation of W3C WoT Servient 
import Servient from "@node-wot/core";
// protocols used
import { CoapServer } from "@node-wot/binding-coap";
import { CoapClientFactory } from "@node-wot/binding-coap";

export default class MyServient extends Servient {

    private static readonly defaultServientConf = {
        servient: {
            scriptDir: ".",
            scriptAction: false
        },
        coap: {
            port: 5683
        }
    }

    public readonly config : any = MyServient.defaultServientConf;

    public constructor(config? : any) {
        super();

        Object.assign(this.config, config);
        console.info("MyServient configured with", this.config);
        
        let coapServer = (typeof this.config.coap.port === "number") ? new CoapServer(this.config.coap.port) : new CoapServer();
        this.addServer(coapServer);
        this.addClientFactory(new CoapClientFactory());
        
        // loads credentials from the configuration
        this.addCredentials(this.config.credentials);
    }

    /**
     * start
     */
    public start(): Promise<WoTFactory> {

        return new Promise<WoTFactory>( (resolve, reject) => {
            super.start().then( WoT => {
                console.info("MyServient started");
    
                WoT.expose({ name: "servient" }).then(thing => {
    
                    thing
                        .addAction({ name: "log",
                                    inputSchema: `{ type: "string" }`,
                                    outputSchema: `{ type: "string" }`,
                                    action: (msg: string) => {
                                        console.info(msg);
                                        return `logged '${msg}`;
                                    }
                                })
                        .addAction({ name: "shutdown",
                                    outputSchema: `{ type: "string" }`,
                                    action: () => {
                                        console.info("shutting down by remote");
                                        this.shutdown();
                                    }
                                });
    
                    if (this.config.servient.scriptAction)
                        thing
                            .addAction({ name: "runScript",
                                    inputSchema: `{ type: "string" }`,
                                    outputSchema: `{ type: "string" }`,
                                    action: (script: string) => {
                                        console.log("runnig script", script);
                                        return this.runScript(script);
                                    }
                                });
                });

                // pass WoTFactory on
                resolve(WoT);

            }).catch( err => reject(err));
        });
    }
}
