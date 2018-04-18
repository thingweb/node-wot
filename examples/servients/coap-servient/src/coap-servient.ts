/********************************************************************************
 * Copyright (c) 2018 Contributors to the Eclipse Foundation
 * 
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the W3C Software Notice and
 * Document License (2015-05-13) which is available at
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document.
 * 
 * SPDX-License-Identifier: EPL-2.0 OR W3C-20150513
 ********************************************************************************/

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
