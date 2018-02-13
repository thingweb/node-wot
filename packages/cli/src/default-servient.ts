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

"use strict";

// global W3C WoT Scripting API definitions
import _, { WoTFactory } from "wot-typescript-definitions";
// node-wot implementation of W3C WoT Servient 
import Servient from "@node-wot/core";
// protocols used
import { HttpServer } from "@node-wot/binding-http";
import { CoapServer } from "@node-wot/binding-coap";
import { FileClientFactory } from "@node-wot/binding-file";
import { HttpClientFactory } from "@node-wot/binding-http";
import { HttpsClientFactory } from "@node-wot/binding-http";
import { CoapClientFactory } from "@node-wot/binding-coap";

export default class DefaultServient extends Servient {

    private static readonly defaultServientConf = {
        servient: {
            scriptDir: ".",
            scriptAction: false
        },
        http: {
            port: 8080
        }
    }

    public readonly config : any = DefaultServient.defaultServientConf;

    public constructor(config? : any) {
        super();

        Object.assign(this.config, config);
        console.info("DefaultServient configured with", this.config);

        let httpServer = (typeof this.config.http.port === "number") ? new HttpServer(this.config.http.port) : new HttpServer();
        this.addServer(httpServer);
        this.addClientFactory(new FileClientFactory());
        this.addClientFactory(new HttpClientFactory(this.config.http.proxy));
        this.addClientFactory(new HttpsClientFactory(this.config.http.proxy));
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
                console.info("DefaultServient started");
    
                // FIXME produce() instead of expose()
                // TODO think about builder pattern that starts with produce() ends with expose(), which exposes/publishes the Thing
                let thing = WoT.expose({ name: "servient" })
                                .addAction({ name: "log",
                                    inputType: `{ type: "string" }`,
                                    outputType: `{ type: "string" }`,
                                    action: (msg: string) => {
                                        console.info(msg);
                                        return `logged '${msg}`;
                                    }
                                })
                                .addAction({ name: "shutdown",
                                    // FIXME define input/outputTypes as optional
                                    inputType: null,
                                    outputType: `{ type: "string" }`,
                                    action: () => {
                                        console.info("shutting down by remote");
                                        this.shutdown();
                                    }
                                });
    
                if (this.config.servient.scriptAction) {
                    thing
                        .addAction({ name: "runScript",
                            inputType: `{ type: "string" }`,
                            outputType: `{ type: "string" }`,
                            action: (script: string) => {
                                console.log("runnig script", script);
                                return this.runScript(script);
                            }
                        });
                }

                // pass WoTFactory on
                resolve(WoT);

            }).catch( err => reject(err));
        });
    }
}
