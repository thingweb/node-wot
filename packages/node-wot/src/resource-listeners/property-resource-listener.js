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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var basic_resource_listener_1 = require("./basic-resource-listener");
var node_wot_content_serdes_1 = require("node-wot-content-serdes");
/**
 * Interaction resource that provides a Property
 */
var PropertyResourceListener = (function (_super) {
    __extends(PropertyResourceListener, _super);
    function PropertyResourceListener(thing, property) {
        var _this = _super.call(this) || this;
        _this.thing = thing;
        _this.description = property;
        _this.name = property.name;
        return _this;
    }
    PropertyResourceListener.prototype.onRead = function () {
        return this.thing
            .getProperty(this.name)
            .then(function (value) {
            var bytes = node_wot_content_serdes_1["default"].valueToBytes(value); // TODO where to get media type
            return Promise.resolve(bytes);
        });
    };
    PropertyResourceListener.prototype.onWrite = function (input) {
        var value = node_wot_content_serdes_1["default"].bytesToValue(input); // TODO where to get media type
        return this.thing.setProperty(this.name, value);
    };
    return PropertyResourceListener;
}(basic_resource_listener_1["default"]));
exports["default"] = PropertyResourceListener;
