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
 * HTTP Server based on http
 */
var node_wot_logger_1 = require("node-wot-logger");
var http = require("http");
var url = require("url");
var node_wot_content_serdes_1 = require("node-wot-content-serdes");
var deasync = require('deasync');
var HttpServer = (function () {
    function HttpServer(port, address) {
        var _this = this;
        this.port = 8080;
        this.address = undefined;
        this.server = http.createServer(function (req, res) { _this.handleRequest(req, res); });
        this.running = false;
        this.failed = false;
        this.resources = {};
        if (port !== undefined) {
            this.port = port;
        }
        if (address !== undefined) {
            this.address = address;
        }
        this.server.on('error', function (err) {
            node_wot_logger_1["default"].error("HttpServer for port " + _this.port + " failed: " + err.message);
            _this.failed = true;
        });
    }
    HttpServer.prototype.getScheme = function () {
        return 'http';
    };
    HttpServer.prototype.addResource = function (path, res) {
        if (this.resources[path] !== undefined) {
            node_wot_logger_1["default"].warn("HttpServer on port " + this.getPort() + " already has ResourceListener '" + path + "' - skipping");
            return false;
        }
        else {
            node_wot_logger_1["default"].debug("HttpServer on port " + this.getPort() + " addeding resource '" + path + "'");
            this.resources[path] = res;
            return true;
        }
    };
    HttpServer.prototype.removeResource = function (path) {
        node_wot_logger_1["default"].debug("HttpServer on port " + this.getPort() + " removing resource '" + path + "'");
        return delete this.resources[path];
    };
    HttpServer.prototype.start = function () {
        var _this = this;
        node_wot_logger_1["default"].info("HttpServer starting on " + (this.address !== undefined ? this.address + ' ' : '') + "port " + this.port);
        this.server.listen(this.port, this.address);
        // converting async listen API to sync start function
        this.server.once('listening', function () { _this.running = true; });
        while (!this.running && !this.failed) {
            deasync.runLoopOnce();
        }
        return this.running;
    };
    HttpServer.prototype.stop = function () {
        node_wot_logger_1["default"].info("HttpServer stopping on port " + this.getPort() + " (running=" + this.running + ")");
        var closed = this.running;
        this.server.once('close', function () { closed = true; });
        this.server.close();
        while (!closed && !this.failed) {
            deasync.runLoopOnce();
        }
        this.running = false;
        return closed;
    };
    HttpServer.prototype.getPort = function () {
        if (this.running) {
            return this.server.address().port;
        }
        else {
            return -1;
        }
    };
    HttpServer.prototype.handleRequest = function (req, res) {
        var _this = this;
        node_wot_logger_1["default"].verbose("HttpServer on port " + this.getPort() + " received " + req.method + " " + req.url
            + (" from " + req.socket.remoteAddress + " port " + req.socket.remotePort));
        res.on('finish', function () {
            node_wot_logger_1["default"].verbose("HttpServer replied with " + res.statusCode + " to "
                + (req.socket.remoteAddress + " port " + req.socket.remotePort));
            node_wot_logger_1["default"].debug("HttpServer sent Content-Type: '" + res.getHeader('Content-Type') + "'");
        });
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'content-type, *');
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        var requestUri = url.parse(req.url);
        var requestHandler = this.resources[requestUri.pathname];
        var contentTypeHeader = req.headers["content-type"];
        var mediaType = Array.isArray(contentTypeHeader) ? contentTypeHeader[0] : contentTypeHeader;
        // FIXME must be rejected with 415 Unsupported Media Type, guessing not allowed -> debug/testing flag
        if (!mediaType || mediaType.length == 0)
            mediaType = node_wot_content_serdes_1["default"].DEFAULT;
        if (requestHandler === undefined) {
            res.writeHead(404);
            res.end('Not Found');
        }
        else {
            if (req.method === 'GET') {
                requestHandler.onRead()
                    .then(function (content) {
                    if (!content.mediaType) {
                        node_wot_logger_1["default"].warn("HttpServer got no Media Type from '" + requestUri.pathname + "'");
                    }
                    else {
                        res.setHeader('Content-Type', content.mediaType);
                    }
                    res.writeHead(200);
                    res.end(content.body);
                })["catch"](function (err) {
                    node_wot_logger_1["default"].error("HttpServer on port " + _this.getPort() + " got internal error on read " +
                        ("'" + requestUri.pathname + "': " + err.message));
                    res.writeHead(500);
                    res.end(err.message);
                });
            }
            else if (req.method === 'PUT') {
                var body_1 = [];
                req.on('data', function (data) { body_1.push(data); });
                req.on('end', function () {
                    node_wot_logger_1["default"].debug("HttpServer on port " + _this.getPort() + " completed body '" + body_1 + "'");
                    requestHandler.onWrite({ mediaType: mediaType, body: Buffer.concat(body_1) })
                        .then(function () {
                        res.writeHead(204);
                        res.end('');
                    })["catch"](function (err) {
                        node_wot_logger_1["default"].error("HttpServer on port " + _this.getPort() + " got internal error on "
                            + ("write '" + requestUri.pathname + "': " + err.message));
                        res.writeHead(500);
                        res.end(err.message);
                    });
                });
            }
            else if (req.method === 'POST') {
                var body_2 = [];
                req.on('data', function (data) { body_2.push(data); });
                req.on('end', function () {
                    node_wot_logger_1["default"].debug("HttpServer on port " + _this.getPort() + " completed body '" + body_2 + "'");
                    requestHandler.onInvoke({ mediaType: mediaType, body: Buffer.concat(body_2) })
                        .then(function (content) {
                        // Actions may have a void return (no outputData)
                        if (content.body === null) {
                            res.writeHead(204);
                        }
                        else {
                            if (!content.mediaType) {
                                node_wot_logger_1["default"].warn("HttpServer got no Media Type from '" + requestUri.pathname + "'");
                            }
                            else {
                                res.setHeader('Content-Type', content.mediaType);
                            }
                            res.writeHead(200);
                        }
                        res.end(content.body);
                    })["catch"](function (err) {
                        node_wot_logger_1["default"].error("HttpServer on port " + _this.getPort() + " got internal error on "
                            + ("invoke '" + requestUri.pathname + "': " + err.message));
                        res.writeHead(500);
                        res.end(err.message);
                    });
                });
            }
            else if (req.method === 'DELETE') {
                requestHandler.onUnlink()
                    .then(function () {
                    res.writeHead(204);
                    res.end('');
                })["catch"](function (err) {
                    node_wot_logger_1["default"].error("HttpServer on port " + _this.getPort() + " got internal error on "
                        + ("unlink '" + requestUri.pathname + "': " + err.message));
                    res.writeHead(500);
                    res.end(err.message);
                });
            }
            else {
                res.writeHead(405);
                res.end('Method Not Allowed');
            }
        }
    };
    return HttpServer;
}());
exports["default"] = HttpServer;
