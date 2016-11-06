module Thingweb {
    export interface ProtocolServer {
        addResource(path : string, res : Resource) : Resource;
        removeResource(path : string) : boolean;
    }
}