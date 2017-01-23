declare interface ProtocolClient {

    /** this client is requested to perform a "read" on the resource with the given URI */
    readResource(uri : string) : Promise<Buffer>;

    /** this cliet is requested to perform a "write" on the resource with the given URI  */
    writeResource(uri : string, payload : Buffer) : Promise<void>;

    /** this client is requested to perform an "invoke" on the resource with the given URI */
    invokeResource(uri : String, payload : Buffer) : Promise<Buffer>;

    /** this client is requested to perform an "unlink" on the resource with the given URI */
    unlinkResource(uri : string) : Promise<void>;

    /** start the client (ensure it is ready to send requests) */
    start() : boolean;
    /**stop the client */
    stop() : boolean;

}

declare interface ProtocolClientFactory {
    getClient() : ProtocolClient;
    init() : boolean;
    destroy() : boolean;
    
    /** get the protocol types supported by this client - identified by its scheme (e.g. http, https etc.) */
    getSchemes() : Array<string>;
}