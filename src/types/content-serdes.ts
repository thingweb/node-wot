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

import logger from "../logger";

/** is a plugin for ContentSerdes for a specific format (such as JSON or EXI) */
export interface ContentCodec {
    getMediaType() : string
    bytesToValue(bytes : Buffer) : any
    valueToBytes(value : any) : Buffer
}

/** default implementation offerin Json de-/serialisation */
class JsonCodec implements ContentCodec {
    getMediaType() : string {
        return "application/json"
    }

    bytesToValue(bytes : Buffer) : any {
        logger.debug(`JsonCodec parsing '${bytes.toString()}'`);
        let parsed : string;
        try {
            parsed = JSON.parse(bytes.toString());
        } catch(err) {
            if (err instanceof SyntaxError) {
                // be relaxed about what is received (-> string without quotes)
                parsed = bytes.toString();
            } else {
                throw err;
            }
        }
        return parsed;
    }

    valueToBytes(value : any) : Buffer {
        logger.debug(`JsonCodec serializing '${value}'`);
        let content = JSON.stringify(value);
        return new Buffer(content);
    }
}

/**
 * is a singleton that is used to serialize and deserialize data
 * it can accept multiple serializers and decoders
 */
export class ContentSerdes {
    private codecs : Map<string,ContentCodec>= new Map();
    private static instance : ContentSerdes

    private constructor() {}

    public static get() : ContentSerdes {
        if (!this.instance)  {
            this.instance = new ContentSerdes();
            this.instance.addCodec(new JsonCodec());
        }
        return this.instance;
    }

    public addCodec(codec : ContentCodec) {
        this.codecs.set(codec.getMediaType(),codec)
    }

    public getSupportedMediaTypes() : Array<string> {
        return Array.from(this.codecs.keys())
    }

    public bytesToValue(bytes : Buffer, mediaType = "application/json") : any {
        //choose codec based on mediaType
        if(!this.codecs.has(mediaType)) {
            throw new Error(`Unsupported serialisation format: ${mediaType}`)
        }
        let codec = this.codecs.get(mediaType)

        //use codec to deserialize
        let res = codec.bytesToValue(bytes);

        return res;
    }

    public valueToBytes(value : any, mediaType= "application/json") : Buffer {
        //choose codec based on mediaType
        if(!this.codecs.has(mediaType)) {
            throw new Error(`Unsupported serialisation format: ${mediaType}`)
        }
        let codec = this.codecs.get(mediaType)

        //use codec to serialize
        let res = codec.valueToBytes(value)

        return res;
    }
}

export default ContentSerdes.get();
