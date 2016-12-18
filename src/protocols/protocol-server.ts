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
 */
declare interface ResourceListener {
    onRead(): Object;
    onWrite(payload: Object): Object;
    onInvoke(payload: Object): Object;
    onUnlink(): Object;
}
