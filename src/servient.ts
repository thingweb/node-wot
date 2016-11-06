module Thingweb {
    export interface ProtocolClient {
        readResource(uri: string): Object;
        writeResource(uri: string, payload: Object): Object;
        executeResource(uri: String, payload: Object): Object;
        unlinkResource(uri: string): Object;
    }

    export class Servient {
                public addServer(server : ProtocolServer) : boolean {
        return false;
    }
    public addClient(client : ProtocolClient) : boolean {
        return false;
    }

    //will return WoT object
    public start() : WoT.WoTFactory {
     return new WoTImpl();
    }
    
    public shutdown() : void {}
    }
}