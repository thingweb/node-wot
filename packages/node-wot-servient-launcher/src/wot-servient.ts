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

import DefaultServient from "./default-servient"
import HttpClientFactory from "node-wot-protocols-http-client"
import HttpServer from "node-wot-protocols-http-server"
import logger from "node-wot-logger"
import _ from 'wot-typescript-definitions';

const basedir = '.'

let readConf = function (): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(basedir, ".wot.conf.json"), 'utf-8', (err, data) => {
            if (err) {
                logger.warn("could not read config", err);
                reject(err)
            }
            if (data) {
                const config = JSON.parse(data);
                logger.info("using config", config)
                resolve(config)
            }
        });
    });
}

logger.info("I am running from", basedir)

let srv: DefaultServient = null;

readConf()
    .then((conf) => {
        return srv = new DefaultServient(conf)
    })
    .catch(err => {
        return srv = new DefaultServient()
    }).then(srv => {
        srv.start()
        logger.info("looking for scripts")
        return runAllScripts(srv)
    })
    .catch(err => console.error(err))

const runAllScripts = function (srv: DefaultServient): void {
    fs.readdir(basedir, (err, files) => {
        if (err) {
            logger.warn("autorun of scripts encountered error", err)
            return
        }

        logger.info("found scripts", files.length)
        files.forEach((file) => {
            if (file.substr(0, 1) !== '.') {
                let fname = path.join(basedir, file)
                logger.info("running file ", fname)
                fs.readFile(fname, 'utf8', (err, data) => {
                    if (err) logger.error("cannot read script", err)
                    logger.info("read code from file", file, data)
                    srv.runPriviledgedScript(data)
                })

            }
        })
    })

}





