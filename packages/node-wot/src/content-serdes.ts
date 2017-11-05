/*
 * W3C Software License
 *
 * Copyright (c) 2017 the thingweb community
 *
 * THIS WORK IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR
 * WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF
 * MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE
 * SOFTWARE OR DOCUMENT WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS,
 * TRADEMARKS OR OTHER RIGHTS.
 *
 * COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR
 * CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENT.
 *
 * The name and trademarks of copyright holders may NOT be used in advertising or
 * publicity pertaining to the work without specific, written prior permission. Title
 * to copyright in this work will at all times remain with copyright holders.
 */

/** is a plugin for ContentSerdes for a specific format (such as JSON or EXI) */
export interface ContentCodec {
  getMediaType(): string
  bytesToValue(bytes: Buffer): any
  valueToBytes(value: any): Buffer
}

export class Content {
  public mediaType: string;
  public body: Buffer;

  constructor(mediaType: string, body: Buffer) {
    this.mediaType = mediaType;
    this.body = body;
  }
}



/** default implementation offerin Json de-/serialisation */
class JsonCodec implements ContentCodec {
  getMediaType(): string {
    return 'application/json'
  }

  bytesToValue(bytes: Buffer): any {
    //console.log(`JsonCodec parsing '${bytes.toString()}'`);
    let parsed: any;
    try {
      parsed = JSON.parse(bytes.toString());
    } catch (err) {
      if (err instanceof SyntaxError) {
        if (bytes.byteLength == 0) {
          // empty payload -> void/undefined
          parsed = undefined;
        } else {
          // be relaxed about what is received -> string without quotes
          parsed = bytes.toString();
        }
      } else {
        throw err;
      }
    }
    // remove legacy wrapping and use RFC 7159
    if (parsed && parsed.value!==undefined) {
      console.warn(`JsonCodec removing { value: ... } wrapper`);
      parsed = parsed.value;
    }
    return parsed;
  }

  valueToBytes(value: any): Buffer {
    console.log(`JsonCodec serializing '${value}'`);
    let body = "";
    if(value !== undefined) {
      body = JSON.stringify(value);
    }
    return new Buffer(body);
  }
}

class TextCodec implements ContentCodec {
  getMediaType(): string {
    return 'text/plain'
  }

  bytesToValue(bytes: Buffer): any {
    console.log(`TextCodec parsing '${bytes.toString()}'`);
    let parsed: any;
    parsed = bytes.toString();
    return parsed;
  }

  valueToBytes(value: any): Buffer {
    console.log(`TextCodec serializing '${value}'`);
    let body = "";
    if(value !== undefined) {
      body = value;
    }

    return new Buffer(body);
  }
}


/**
 * is a singleton that is used to serialize and deserialize data
 * it can accept multiple serializers and decoders
 */
export class ContentSerdes {
  private static instance: ContentSerdes;

  public static readonly DEFAULT: string = 'application/json';
  private codecs: Map<string, ContentCodec> = new Map();
  private constructor() { }

  public static get(): ContentSerdes {
    if (!this.instance) {
      this.instance = new ContentSerdes();
      this.instance.addCodec(new JsonCodec());
       this.instance.addCodec(new TextCodec());
    }
    return this.instance;
  }

  public addCodec(codec: ContentCodec) {
    ContentSerdes.get().codecs.set(codec.getMediaType(), codec);
  }

  public getSupportedMediaTypes(): Array<string> {
    return Array.from(ContentSerdes.get().codecs.keys());
  }

  public bytesToValue(content: Content): any {

    if (content.mediaType === undefined) {
      if (content.body.byteLength > 0) {
        // default to application/json
        content.mediaType = ContentSerdes.DEFAULT;
      } else {
        // empty payload without media type -> void/undefined (note: e.g., empty payload with text/plain -> "")
        return;
      }
    }

    //console.log(`ContentSerdes deserializing from ${content.mediaType}`);

    // choose codec based on mediaType
    let isolMediaType: string = this.isolateMediaType(content.mediaType);

    if (!this.codecs.has(isolMediaType)) {
      
      throw new Error(`Unsupported serialisation format: ${content.mediaType}`);
    }
    let codec = this.codecs.get(isolMediaType)

    // use codec to deserialize
    let res = codec.bytesToValue(content.body);

    return res;
  }
  public isolateMediaType(mediaTypeValue:string):string {
        let semiColumnIndex = mediaTypeValue.indexOf(';');
        if (semiColumnIndex > 0) {
            return mediaTypeValue.substring(0,semiColumnIndex);    
        } else {
            return mediaTypeValue;
        }
  }

  public valueToBytes(value: any, mediaType = ContentSerdes.DEFAULT): Content {

    if (value === undefined) console.warn("ContentSerdes valueToBytes got no value");

    console.log(`ContentSerdes serializing to ${mediaType}`);
    // choose codec based on mediaType
    if (!this.codecs.has(mediaType)) {
      throw new Error(`Unsupported serialization format: ${mediaType}`)
    }
    let codec = this.codecs.get(mediaType);

    // use codec to serialize
    let bytes = codec.valueToBytes(value);

    return { mediaType: mediaType, body: bytes };
  }
}

export default ContentSerdes.get();
