import Thing from './thing';
//import * from './protocols/protocols';
import WoTImpl from './wot-impl';

export class Servient {
    private servers : Array<ProtocolServer> = [];
    private clients : Array<ProtocolClient> = [];

    public addServer(server: ProtocolServer): boolean {
        this.servers.push(server);
        return true;
    }

    public addClient(client: ProtocolClient): boolean {
        this.clients.push(client);
        return true;
    }

    public addThing(thing : Thing) : boolean {
        return false;
    }

    public getThing(name : string) : Thing {
        return null;
    }

    //will return WoT object
    public start(): WoT.WoTFactory {
        this.servers.forEach((server) => server.start());
        this.clients.forEach((client) => client.start());            
        return new WoTImpl(this);
    }

    public shutdown(): void {
        this.clients.forEach((client) => client.stop());
        this.servers.forEach((server) => server.stop());
        }
}