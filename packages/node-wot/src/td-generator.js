"use strict";
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
exports.__esModule = true;
var node_wot_logger_1 = require("node-wot-logger");
var node_wot_td_tools_1 = require("node-wot-td-tools");
var TD = require("node-wot-td-tools");
var Helpers = require("node-wot-helpers");
//@h0ru5: temporarely moved here to avoid circular dependencies
/** Based on the current definition of things'S/servient's  a TD represent is
* generated
* @param thing
* @param servient
*/
function generateTD(thing, servient) {
    node_wot_logger_1["default"].silly("generateTD() \n```\n" + thing + "\n```");
    /* new td model instance */
    var genTD = new node_wot_td_tools_1.ThingDescription();
    node_wot_logger_1["default"].debug("generateTD() assign name " + thing.name);
    genTD.name = thing.name;
    /* assign all interactions from ExposedThing */
    genTD.interaction = thing.getInteractions();
    node_wot_logger_1["default"].debug("generateTD() found " + genTD.interaction.length + " Interaction" + (genTD.interaction.length == 1 ? "" : "s"));
    for (var _i = 0, _a = genTD.interaction; _i < _a.length; _i++) {
        var interaction = _a[_i];
        /* empty semantic type array*/
        interaction.semanticTypes = [];
        /* assign interaction pattern to the rdf @type*/
        if (interaction.pattern === TD.InteractionPattern.Property) {
            interaction.semanticTypes.push("Property");
        }
        else if (interaction.pattern === TD.InteractionPattern.Action) {
            interaction.semanticTypes.push("Action");
        }
        if (interaction.pattern === TD.InteractionPattern.Event) {
            interaction.semanticTypes.push("Event");
        }
        var l = 0;
        /* for each address, supported protocol, and media type an intreaction resouce is generated */
        for (var _b = 0, _c = Helpers.getAddresses(); _b < _c.length; _b++) {
            var add = _c[_b];
            for (var _d = 0, _e = servient.getServers(); _d < _e.length; _d++) {
                var ser = _e[_d];
                for (var _f = 0, _g = servient.getSupportedMediaTypes(); _f < _g.length; _f++) {
                    var med = _g[_f];
                    /* if server is online !==-1 assign the href information */
                    if (ser.getPort() !== -1) {
                        var href = ser.getScheme() + "://" + add + ":" + ser.getPort() + "/" + thing.name;
                        /* depending of the resource pattern, uri is constructed */
                        if (interaction.pattern === TD.InteractionPattern.Property) {
                            interaction.link[l] = new TD.InteractionLink();
                            interaction.link[l].href = href + "/properties/" + interaction.name;
                            interaction.link[l].mediaType = med;
                        }
                        else if (interaction.pattern === TD.InteractionPattern.Action) {
                            interaction.link[l] = new TD.InteractionLink();
                            interaction.link[l].href = href + "/actions/" + interaction.name;
                            interaction.link[l].mediaType = med;
                        }
                        if (interaction.pattern === TD.InteractionPattern.Event) {
                            interaction.link[l] = new TD.InteractionLink();
                            interaction.link[l].href = href + "/events/" + interaction.name;
                            interaction.link[l].mediaType = med;
                        }
                        node_wot_logger_1["default"].debug("generateTD() assign href  " + interaction.link[l].href + " for interaction " + interaction.name);
                        l++;
                    }
                }
            }
        }
        l = 0; /* reset for next interactions */
    }
    return genTD;
}
exports.generateTD = generateTD;
