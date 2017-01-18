/**
 * defines the crontract between the servient and each registered server 
 * methods are using booleans to nindicate success, could be migrated to Promises
 */
declare interface ProtocolServer {
    addResource(path: string, res: ResourceListener) : boolean;
    removeResourceListener(path: string): boolean;
    start(): boolean;
    stop(): boolean;
}

/**
 * defines the behaviour for a Resource 
 * expected implementations are e.g. actionlistener, propertylistener etc.
 * 
 * mkovatsc: we probably need to pass around an object with Media Type info, Buffer, and maybe error code
 * mkovatsc: not sure if we need a promise here. The calls should be non-blocking IIRC
 * mkovatsc: we need some adapter that uses TD information to convert between our Scripting API valueType objects and the Buffer/mediaType. Where should this go?
 */
declare interface ResourceListener {
    onRead(): Promise<Buffer>;
    onWrite(value: Buffer) : Promise<void>;
    onInvoke(value: Buffer): Promise<Buffer>;
    onUnlink(): Promise<void>;
}