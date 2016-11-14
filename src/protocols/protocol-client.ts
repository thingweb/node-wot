module Thingweb {
    export interface ProtocolClient {
        readResource(uri: string): Object;
        writeResource(uri: string, payload: Object): Object;
        executeResource(uri: String, payload: Object): Object;
        unlinkResource(uri: string): Object;
        start() : boolean;
        stop() : boolean;
    }
}