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


"use strict"

// global W3C WoT Scripting API definitions
import _ from "wot-typescript-definitions";
// node-wot implementation of W3C WoT Servient 
import Servient from "../servient";
// protocols used
import HttpServer from "node-wot-protocols-http-server";
import HttpClientFactory from "node-wot-protocols-http-client";
// tools
import logger from "node-wot-logger";

export default class DefaultServient extends Servient {

    private static readonly defaultServientConf = {
        servient: {
            scriptDir: ".",
            scriptAction: true
        },
        http: {
            port: 8080
        },
        log : {
            level : "info"
        }
    }

    public readonly config : any = DefaultServient.defaultServientConf;

    public constructor(config? : any) {
        super();

        Object.assign(this.config, config);
        logger.level = this.config.log.level;
        logger.info("configured servient", this.config);

        let httpServer = (typeof this.config.http.port === "number") ? new HttpServer(this.config.http.port) : new HttpServer();
        this.addServer(httpServer);
        this.addClientFactory(new HttpClientFactory());
    }

    /**
     * start
     */
    public start() {
        let WoT = super.start();
        logger.info("started servient");

        WoT.createThing("servient").then(thing => {

            thing
                .addAction("log", { type: "string" })
                .onInvokeAction("log", (msg) => {
                    logger.info(msg);
                    return `logged '${msg}`;
                });
            
            thing
                .addAction("shutdown")
                .onInvokeAction("shutdown", () => {
                    logger.info("shutting down by remote");
                    this.shutdown();
                });

            if (this.config.servient.scriptAction)
            thing
                .addAction("runScript", { type: "string" })
                .onInvokeAction("runScript", (script) => {
                    logger.debug("runnig script", script);
                    return this.runScript(script);
                });

        });
        return WoT;
    }
}
