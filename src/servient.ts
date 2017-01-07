import ServedThing from './servedthing';
import WoTImpl from './wot-impl';
import ThingDescription from './thingdescription'
import {Dictionary} from 'typescript-collections' //seems TS2.1 still does not support ES6 Map

export default class Servient {
    private servers : Array<ProtocolServer> = [];
    private clientFactories : Dictionary<string,ProtocolClientFactory> = new Dictionary<string,ProtocolClientFactory>();
    private things : Array<ServedThing> = [];

    public addServer(server: ProtocolServer): boolean {
        this.servers.push(server);
        return true;
    }

    public addClientFactory(clientFactory: ProtocolClientFactory): boolean {
        for(let scheme in clientFactory.getSchemes()) {
            this.clientFactories.setValue(scheme,clientFactory);
        }        
        return true;
    }

    public addThing(thing : ThingDescription) : boolean {
        return false;
    }

    public getThing(name : string) : ServedThing {
        return null;
    }

    //will return WoT object
    public start(): WoT.WoTFactory {
        this.servers.forEach((server) => server.start());
        this.clientFactories.forEach((scheme,clientFactory) => clientFactory.init());
        // Clients are to be created / started when a ConsumedThing is created            
        return new WoTImpl(this);
    }

    public shutdown(): void {
        this.clientFactories.forEach((scheme,clientFactory) => clientFactory.destroy());
        this.servers.forEach((server) => server.stop());
        }
}