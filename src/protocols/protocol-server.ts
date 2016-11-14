module Thingweb {
    export interface ProtocolServer {
        addResource(path: string, res: Resource): Resource;
        removeResource(path: string): boolean;
        start(): boolean;
        stop(): boolean;
    }
    
    export interface Resource {
        read(): Object;
        write(payload: Object): Object;
        execute(payload: Object): Object;
        unlink(): Object;
    }
}