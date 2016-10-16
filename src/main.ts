'use strict'

import fs = require("fs");

/**
 * Servient control for scripts
 * The lifecycle of a script should be. start up Servient
 * Obtain WoT object from servient
 * Use WoT object to Script
 */
export class Servient {
    public readConf() : void {
        fs.readFile(".wotconfig", 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            }
            console.log("config:\n");
            console.dir(data);
        });
    }
    public addServer(server : ProtocolServer) : boolean {
        return false;
    }
    public addClient(client : ProtocolClient) : boolean {
        return false;
    }
    //will reuturn WoT object
    public start() : void {
        this.readConf();
    }
    public shutdown() : void {}
}

export interface Resource {
    read() : Object;
    write(payload : Object) : Object;
    execute(payload : Object) : Object;
    unlink() : Object;
}

export interface ProtocolClient {
    readResource(uri : string) : Object;
    writeResource(uri : string, payload : Object) : Object;
    executeResource(uri : String, payload : Object) : Object;
    unlinkResource(uri : string) : Object;
}

export interface ProtocolServer {
    addResource(path : string, res : Resource) : Resource;
    removeResource(path : string) : boolean;
}
