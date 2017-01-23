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

import HttpServer from "../protocols/http/http-server";
import CoapServer from "../protocols/coap/coap-server";
import AssetResourceListener from "../resource-listeners/asset-resource-listener";

import { logger } from "../logger";

logger.level = "debug";

var res1 = new AssetResourceListener("Hello World");
var res2 = new AssetResourceListener("Goodbye World")

var hServer = new HttpServer(8081);
hServer.addResource("/test", res1);
hServer.addResource("/exit", res2);
hServer.start();
console.log("HTTP listening on port " + hServer.getPort());

var cServer = new CoapServer();
cServer.addResource("/test", res1);
cServer.addResource("/exit", res2);
cServer.start();
console.log("CoAP listening on port " + cServer.getPort());