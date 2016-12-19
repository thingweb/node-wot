/**
 * Dummy Protocol code for early testing
 */

export class DummyClientFactory implements ProtocolClientFactory {

    public getClient() : ProtocolClient {
        console.log("getClient for scheme 'dummy'");
        return new DummyClient();
    }
    
    public init() : boolean {
        console.log("init client-factory for scheme 'dummy'");
        return true;
    }

    public destroy() : boolean {
        console.log("destroy client-factory for scheme 'dummy'");
        return true;
    }
}


class DummyClient implements ProtocolClient {

    public static readonly schemes : Array<string> = ["dummy"] ;

    private checkScheme(uri: string): boolean {
        if(uri != null && uri.indexOf(DummyClient.schemes[0] + "://") == 0) {
            return true;
        } else {
            return false;
        }
    }

    public readResource(uri: string): Object {
        // return uri plus time
        if (this.checkScheme(uri)) {
            return "GET_" + uri + "_" + new Date();
        } else {
            return "GET ERROR for " + uri;
        }
    }

    public readResourceAsync(uri: string): Promise<any> {
        // do some work
        return new Promise<Object>((resolve, reject)=>{
            let g = this.readResource(uri);
            let isSomeCondition = Math.random() < 0.5 ? true : false;
            if (isSomeCondition) {
                throw new Error('No reason but reject ' + uri);
            }
            setTimeout( () => {
                resolve(g);
            }, 1500);
        });

        // new Promisethis.readResource(uri);
    }

    public writeResource(uri: string, payload: Object): Object {
        return "PUT_" + uri + "_" + new Date();
    }

    public invokeResource(uri: String, payload: Object): Object {
        return "POST_" + uri + "_" + new Date();
    }

    public unlinkResource(uri: string): Object {
        return "UNLINK_" + uri + "_" + new Date();
    }

    public start() : boolean {
        return true;
    }
    
    public stop() : boolean {
        return true;
    }
    
    public getSchemes() : Array<string> {
        return DummyClient.schemes;
    }
}