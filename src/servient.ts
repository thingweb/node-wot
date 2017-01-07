import ServedThing from './servedthing';
import WoTImpl from './wot-impl';
import ThingDescription from './thingdescription'
import {Dictionary} from 'typescript-collections' //seems TS2.1 still does not support ES6 Map
import * as Helpers from './helpers'


export default class Servient {
    private servers : Array<ProtocolServer> = [];
    private clientFactories : Dictionary<string,ProtocolClientFactory> = new Dictionary<string,ProtocolClientFactory>();
    private things : Dictionary<string,ServedThing> = new Dictionary<string,ServedThing>();

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

    public getClientFor(uri: string) : ProtocolClient {
        let scheme = Helpers.extractScheme(uri);
        return this.clientFactories.getValue(scheme).getClient();
    }

    public addThingFromTD(thing : ThingDescription) : boolean {
        return false;
    }


    public addThing(thing : ServedThing) : boolean {
        if(!this.things.containsKey(thing.name)) {
            this.things.setValue(thing.name,thing);
            return true
        } else
        return false
    }

    public getThing(name : string) : ServedThing {
        if(this.things.containsKey(name)) {
            return this.things.getValue(name);
        } else return null;
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