import Thing from './thing';
import WoTImpl from './wot-impl';

export class Servient {
    private servers : Array<ProtocolServer> = [];
    private clientFactories : Array<ProtocolClientFactory> = [];
    
    public addServer(server: ProtocolServer): boolean {
        this.servers.push(server);
        return true;
    }

    public addClientFactory(clientFactory: ProtocolClientFactory): boolean {
        this.clientFactories.push(clientFactory);
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
        this.clientFactories.forEach((clientFactory) => clientFactory.init());
        // Clients are to be created / started when a ConsumedThing is created            
        return new WoTImpl(this);
    }

    public shutdown(): void {
        this.clientFactories.forEach((clientFactory) => clientFactory.destroy());
        this.servers.forEach((server) => server.stop());
        }
}