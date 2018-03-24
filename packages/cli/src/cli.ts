#!/usr/bin/env node
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
// using core definitions instead of 'wot-typescript-definitions' to avoid typing error
import _ from "@node-wot/core";
// node-wot implementation of W3C WoT Servient 
import { Servient } from "@node-wot/core";

// default implementation of W3C WoT Servient (http(s) and file bindings)
import DefaultServient from "./default-servient";

// tools
import fs = require("fs");
import * as path from "path";

const confFile = "wot-servient.conf.json";
const baseDir = ".";

const readConf = function () : Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(baseDir, confFile), "utf-8", (err, data) => {
            if (err) {
                reject(err);
            }
            if (data) {
                const config = JSON.parse(data);
                console.info("WoT-Servient using conf file", confFile);
                resolve(config);
            }
        });
    });
}

const runScripts = function(srv : DefaultServient, scripts : Array<string>) : void {
    scripts.forEach((fname) => {
        console.info("WoT-Servient reading script", fname);
        fs.readFile(fname, "utf8", (err, data) => {
            if (err) {
                console.error("WoT-Servient experienced error while reading script", err);
            } else {
                // limit printout to first line
                console.info(`WoT-Servient running script '${data.substr(0, data.indexOf("\n"))}...'`);
                srv.runPrivilegedScript(data, fname);
            }
        });
    });
}

const runAllScripts = function(srv : DefaultServient) : void {
    const scriptDir = path.join(baseDir, srv.config.servient.scriptDir);
    fs.readdir(scriptDir, (err, files) => {
        if (err) {
            console.warn("WoT-Servient experienced error while loading directory", err);
            return;
        }

        // unhidden .js files
        let scripts = files.filter( (file) => {
            return (file.substr(0, 1) !== "." && file.slice(-3) === ".js");
        });
        console.info(`WoT-Servient loading directory '${scriptDir}' with ${scripts.length} script${scripts.length>1 ? "s" : ""}`);
        
        runScripts(srv, scripts.map(value => path.join(scriptDir, value)));
    });
}

// main
if (process.argv.length>2) {
    process.argv.slice(2).forEach( (arg) => {
        if (arg.match(/^(-h|--help|\/?|\/h)$/i)) {
            console.log(`Usage: wot-servient [SCRIPT]...
Run a WoT Servient in the current directory. Automatically loads all .js files in the directory.
If wot-servient.conf.json exists, that configuration is applied and scripts in 'scriptDir' are loaded.
If one or more SCRIPT is given, these files are loaded instead of the directory.
If no script is found, the Servient is still started and provides a 'runScript' Action.
Examples: wot-servient
          wot-servient autorun/hello-world.js

wot-servient.conf.json:
{
    "servient": {
        "scriptDir": AUTORUN,
        "scriptAction": RUNSCRIPT
    },
    "http": {
        "port": HPORT,
        "proxy": PROXY,
        "allowSelfSigned": ALLOW
    },
    "credentials": {
        THING_ID1: {
            "token": TOKEN
        },
        THING_ID2: {
            "username": USERNAME,
            "password": PASSWORD
        }
    }
}
  AUTORUN is a path string for the directory to load at startup
  RUNSCRIPT is a boolean indicating whether to provide the 'runScript' Action
  HPORT is a number defining the HTTP listening port
  PROXY is an object with "href" for the proxy URI, "authorization" for "Basic" or "Bearer", and then corresponding credential fields "username"/"password" or "token" as defined below
  ALLOW is a boolean indicating whether self-signed certificates should be allowed
  THING_IDx is a TD @id for which credentials should be configured
  TOKEN is an OAuth (Bearer) token
  USERNAME is an HTTP Basic Auth username
  PASSWORD is an HTTP Basic Auth password`);
            process.exit(0);
        }
    });
}
readConf()
    .then((conf) => {
        return new DefaultServient(conf);
    })
    .catch(err => {
        if (err.code == 'ENOENT') {
            console.warn("WoT-Servient using defaults as 'wot-servient.conf.json' does not exist");
            return new DefaultServient();
        } else {
            console.error("WoT-Servient config file error: " + err.message);
            process.exit(err.errno);
        }
    })
    .then(servient => {
        servient.start()
            .then( () => {
                if (process.argv.length>2) {
                    console.info(`WoT-Servient loading ${process.argv.length-2} command line script${process.argv.length-2>1 ? "s" : ""}`);
                    return runScripts(servient, process.argv.slice(2));
                } else {
                    return runAllScripts(servient);
                }
            })
        .catch( err => {
            console.error("WoT-Servient cannot start: " + err.message);
        });
    })
    .catch(err => console.error(err));
