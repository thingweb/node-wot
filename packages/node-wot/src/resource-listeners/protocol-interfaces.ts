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

export interface ProtocolClient {

  /** this client is requested to perform a "read" on the resource with the given URI */
  readResource(uri: string): Promise<Content>;

  /** this cliet is requested to perform a "write" on the resource with the given URI  */
  writeResource(uri: string, content: Content): Promise<void>;

  /** this client is requested to perform an "invoke" on the resource with the given URI */
  invokeResource(uri: String, content: Content): Promise<Content>;

  /** this client is requested to perform an "unlink" on the resource with the given URI */
  unlinkResource(uri: string): Promise<void>;

  /** start the client (ensure it is ready to send requests) */
  start(): boolean;
  /** stop the client */
  stop(): boolean;

  /** apply TD security metadata */
  setSecurity(metadata: any, credentials?: any): boolean;
}

export interface ProtocolClientFactory {
  getClient(): ProtocolClient;
  init(): boolean;
  destroy(): boolean;

  /** get the protocol types supported by this client - identified by its scheme (e.g. http, https etc.) */
  getSchemes(): Array<string>;
}

export interface ProtocolServer {
  addResource(path: string, res: ResourceListener): boolean;
  removeResource(path: string): boolean;
  start(): boolean;
  stop(): boolean;
  getPort(): number;
  getScheme(): string;
}

export interface Content {
  mediaType: string,
  body: Buffer
}

/**
 * defines the behaviour for a Resource 
 * expected implementations are e.g. actionlistener, propertylistener etc.
 * 
 * mkovatsc: we probably need to pass around an object with Media Type info, Buffer, and maybe error code
 * mkovatsc: not sure if we need a promise here. The calls should be non-blocking IIRC
 * mkovatsc: we need some adapter that uses TD information to convert between our Scripting API valueType
 *           objects and the Buffer/mediaType. Where should this go?
 */
export interface ResourceListener {
  onRead(): Promise<Content>;
  onWrite(value: Content): Promise<void>;
  onInvoke(value: Content): Promise<Content>;
  onUnlink(): Promise<void>;
}

export { default as BasicResourceListener } from './basic-resource-listener'
export { default as AssetResourceListener } from './asset-resource-listener'
