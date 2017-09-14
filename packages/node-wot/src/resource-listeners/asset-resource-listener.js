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
/**
 * Resource that provides an asset
 */
var basic_resource_listener_1 = require("./basic-resource-listener");
var node_wot_logger_1 = require("node-wot-logger");
var AssetResourceListener = (function (_super) {
    __extends(AssetResourceListener, _super);
    function AssetResourceListener(asset, mediaType) {
        if (mediaType === void 0) { mediaType = "text/plain"; }
        var _this = _super.call(this) || this;
        _this.mediaType = mediaType;
        _this.asset = new Buffer(asset);
        return _this;
    }
    AssetResourceListener.prototype.onRead = function () {
        var _this = this;
        node_wot_logger_1["default"].debug("Reading asset");
        return new Promise(function (resolve, reject) { return resolve({ mediaType: _this.mediaType, body: new Buffer(_this.asset) }); });
    };
    AssetResourceListener.prototype.onWrite = function (content) {
        node_wot_logger_1["default"].debug("Writing '" + content.body.toString() + "' to asset");
        this.mediaType = content.mediaType;
        this.asset = content.body;
        return new Promise(function (resolve, reject) { return resolve(); });
    };
    AssetResourceListener.prototype.onInvoke = function (content) {
        var _this = this;
        node_wot_logger_1["default"].debug("Invoking '" + content.body.toString() + "' on asset");
        return new Promise(function (resolve, reject) { return resolve({ mediaType: _this.mediaType, body: new Buffer("TODO") }); });
    };
    return AssetResourceListener;
}(basic_resource_listener_1["default"]));
exports["default"] = AssetResourceListener;
