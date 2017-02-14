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

/**
 * Helper class for interface addresses
 */

import logger from "../logger";

const os = require("os");

export default class AddressHelper {

    public static getAddresses(requestHost? : string) : Array<string> {
        let addresses : Array<any> = [];

        let interfaces = os.networkInterfaces();

        for (let iface in interfaces) {
            interfaces[iface].forEach( (entry : any) => {
                logger.silly(`AddressHelper found ${entry.address}`);
                if (entry.internal === false) {
                    if (entry.family === "IPv4") addresses.push(entry.address);
                    else if (entry.scopeid == 0) addresses.push(entry.address);
                }
            });
        }

        addresses.push("127.0.0.1");

        if(requestHost && addresses.indexOf(requestHost)===-1) {
            addresses.push(requestHost)
        }

        logger.verbose(`AddressHelper identified ${addresses}`);

        return addresses;
    }

    public static toUriLiteral(address : string) : string {
        if (address.indexOf(":")!=-1) address = `[${address}]`;
        return address;
    }
}
