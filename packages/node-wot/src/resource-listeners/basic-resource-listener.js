"use strict";
exports.__esModule = true;
var BasicResourceListener = (function () {
    function BasicResourceListener() {
    }
    BasicResourceListener.prototype.onRead = function () {
        return Promise.reject(new Error("Method Not Allowed"));
    };
    BasicResourceListener.prototype.onWrite = function (content) {
        return Promise.reject(new Error("Method Not Allowed"));
    };
    BasicResourceListener.prototype.onInvoke = function (content) {
        return Promise.reject(new Error("Method Not Allowed"));
    };
    BasicResourceListener.prototype.onUnlink = function () {
        return Promise.reject(new Error("Method Not Allowed"));
    };
    return BasicResourceListener;
}());
exports["default"] = BasicResourceListener;
