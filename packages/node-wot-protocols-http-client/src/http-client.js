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
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
exports.__esModule = true;
/**
 * HTTP client based on http
 */
var node_wot_logger_1 = require("node-wot-logger");
var http = require("http");
var https = require("https");
var url = require("url");
var HttpClient = (function () {
    function HttpClient(secure) {
        if (secure === void 0) { secure = false; }
        this.agent = secure ? new https.Agent({ keepAlive: true }) : new http.Agent({ keepAlive: true });
    }
    HttpClient.prototype.getContentType = function (res) {
        var header = res.headers['content-type']; // note: node http uses lower case here
        if (Array.isArray(header)) {
            // this should never be the case as only cookie headers are returned as array
            // but anyways...
            return (header.length > 0) ? header[0] : "";
        }
        else
            return header;
    };
    HttpClient.prototype.toString = function () {
        return "[HttpClient]";
    };
    HttpClient.prototype.readResource = function (uri) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var options = _this.uriToOptions(uri);
            // TODO get explicit binding from TD
            options.method = 'GET';
            node_wot_logger_1["default"].verbose("HttpClient sending GET to " + uri);
            var req = http.request(options, function (res) {
                node_wot_logger_1["default"].verbose("HttpClient received " + res.statusCode + " from " + uri);
                var mediaType = _this.getContentType(res);
                node_wot_logger_1["default"].debug("HttpClient received Content-Type: " + mediaType);
                node_wot_logger_1["default"].silly("HttpClient received headers: " + JSON.stringify(res.headers));
                var body = [];
                res.on('data', function (data) { body.push(data); });
                res.on('end', function () {
                    resolve({ mediaType: mediaType, body: Buffer.concat(body) });
                });
            });
            req.on('error', function (err) { return reject(err); });
            req.end();
        });
    };
    HttpClient.prototype.writeResource = function (uri, content) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var options = _this.uriToOptions(uri);
            // TODO get explicit binding from TD
            options.method = 'PUT';
            options.headers = { 'Content-Type': content.mediaType, 'Content-Length': content.body.byteLength };
            node_wot_logger_1["default"].verbose("HttpClient sending PUT to " + uri);
            var req = http.request(options, function (res) {
                node_wot_logger_1["default"].verbose("HttpClient received " + res.statusCode + " from " + uri);
                node_wot_logger_1["default"].silly("HttpClient received headers: " + JSON.stringify(res.headers));
                // Although 204 without payload is expected, data must be read 
                // to complete request (http blocks socket otherwise)
                // TODO might have response on write for future HATEOAS concept
                var body = [];
                res.on('data', function (data) { body.push(data); });
                res.on('end', function () {
                    resolve();
                });
            });
            req.on('error', function (err) { return reject(err); });
            req.write(content.body);
            req.end();
        });
    };
    HttpClient.prototype.invokeResource = function (uri, content) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var options = _this.uriToOptions(uri);
            // TODO get explicit binding from TD
            options.method = 'POST';
            if (content) {
                options.headers = { 'Content-Type': content.mediaType, 'Content-Length': content.body.byteLength };
            }
            node_wot_logger_1["default"].verbose("HttpClient sending POST to " + uri);
            var req = http.request(options, function (res) {
                node_wot_logger_1["default"].verbose("HttpClient received " + res.statusCode + " from " + uri);
                var mediaType = _this.getContentType(res);
                node_wot_logger_1["default"].debug("HttpClient received Content-Type: " + mediaType);
                node_wot_logger_1["default"].silly("HttpClient received headers: " + JSON.stringify(res.headers));
                var body = [];
                res.on('data', function (data) { body.push(data); });
                res.on('end', function () {
                    resolve({ mediaType: mediaType, body: Buffer.concat(body) });
                });
            });
            req.on('error', function (err) { return reject(err); });
            if (content) {
                req.write(content.body);
            }
            req.end();
        });
    };
    HttpClient.prototype.unlinkResource = function (uri) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var options = _this.uriToOptions(uri);
            // TODO get explicit binding from TD
            options.method = 'DELETE';
            node_wot_logger_1["default"].verbose("HttpClient sending DELETE to " + uri);
            var req = http.request(options, function (res) {
                node_wot_logger_1["default"].verbose("HttpClient received " + res.statusCode + " from " + uri);
                node_wot_logger_1["default"].silly("HttpClient received headers: " + JSON.stringify(res.headers));
                // Although 204 without payload is expected, data must be read
                //  to complete request (http blocks socket otherwise)
                // TODO might have response on unlink for future HATEOAS concept
                var body = [];
                res.on('data', function (data) { body.push(data); });
                res.on('end', function () {
                    resolve();
                });
            });
            req.on('error', function (err) { return reject(err); });
            req.end();
        });
    };
    HttpClient.prototype.start = function () {
        return true;
    };
    HttpClient.prototype.stop = function () {
        this.agent.destroy();
        return true;
    };
    HttpClient.prototype.uriToOptions = function (uri) {
        var requestUri = url.parse(uri);
        var options = {};
        options.agent = this.agent;
        options.hostname = requestUri.hostname;
        options.port = parseInt(requestUri.port, 10);
        options.path = requestUri.path;
        // TODO auth and headers
        return options;
    };
    return HttpClient;
}());
exports["default"] = HttpClient;
