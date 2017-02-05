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

import fs = require("fs");
import * as path from 'path'
import Servient from "../servient";
import HttpClientFactory from "../protocols/http/http-client-factory"
import HttpServer from "../protocols/http/http-server"
import logger from '../logger'

/**
 * Servient control for scripts
 * The lifecycle of a script should be. start up Servient
 * Obtain WoT object from servient
 * Use WoT object to Script
 */
class PlugfestServient extends Servient {
    public readConf(): void {
        fs.readFile(path.join(__dirname,"wot-servient.config.json"), 'utf-8', (err, data) => {
            if (err) {
                logger.error("could not read config",err);
            }
            if(data) {
                let config = JSON.parse(data);
                logger.info("using config", config)
            }
        });
    }
}

logger.info("i am running from", __dirname)

let srv = new PlugfestServient();
logger.info("created servient")

srv.addServer(new HttpServer())
srv.addClientFactory(new HttpClientFactory())
logger.info("added servers and clientfactories")

let WoT = srv.start();
logger.info("started servient")
srv.readConf()

logger.info("looking for scripts")
fs.readdir(path.join(__dirname,'autorun'),(err,files) => {
    if(err) {
        logger.warn("autorun of scripts encountered error",err)
        return
    }

    logger.info("found scripts", files.length)
    files.forEach((file) => {
        let fname = path.join(__dirname,'autorun',file)
        logger.info("running file ",fname)
        fs.readFile(fname,'utf8',(err,data) =>
        {
            if(err) logger.error("cannot read script",err)
            logger.info("read code from file",file,data)
          //  srv.runPriviledgedScript(data) @sebastiankb does not exist yet
        })
    })

})
