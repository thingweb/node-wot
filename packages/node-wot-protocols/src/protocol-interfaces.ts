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

export interface ProtocolClient {

    /** this client is requested to perform a "read" on the resource with the given URI */
    readResource(uri : string) : Promise<Content>;

    /** this cliet is requested to perform a "write" on the resource with the given URI  */
    writeResource(uri : string, content : Content) : Promise<void>;

    /** this client is requested to perform an "invoke" on the resource with the given URI */
    invokeResource(uri : String, content : Content) : Promise<Content>;

    /** this client is requested to perform an "unlink" on the resource with the given URI */
    unlinkResource(uri : string) : Promise<void>;

    /** start the client (ensure it is ready to send requests) */
    start() : boolean;
    /**stop the client */
    stop() : boolean;

}

export interface ProtocolClientFactory {
    getClient() : ProtocolClient;
    init() : boolean;
    destroy() : boolean;
    
    /** get the protocol types supported by this client - identified by its scheme (e.g. http, https etc.) */
    getSchemes() : Array<string>;
}

export interface ProtocolServer {
    addResource(path : string, res : ResourceListener) : boolean;
    removeResource(path : string) : boolean;
    start() : boolean;
    stop() : boolean;
    getPort() : number;
    getScheme() : string;
}

export interface Content {
    mediaType : string,
    body : Buffer
}

/**
 * defines the behaviour for a Resource 
 * expected implementations are e.g. actionlistener, propertylistener etc.
 * 
 * mkovatsc: we probably need to pass around an object with Media Type info, Buffer, and maybe error code
 * mkovatsc: not sure if we need a promise here. The calls should be non-blocking IIRC
 * mkovatsc: we need some adapter that uses TD information to convert between our Scripting API valueType objects and the Buffer/mediaType. Where should this go?
 */
export interface ResourceListener {
    onRead() : Promise<Content>;
    onWrite(value : Content) : Promise<void>;
    onInvoke(value : Content) : Promise<Content>;
    onUnlink() : Promise<void>;
}