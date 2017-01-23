import HttpClientFactory from "../protocols/http/http-client-factory";
import CoapClientFactory from "../protocols/coap/coap-client-factory";

let myHttpFactory = new HttpClientFactory();
let myCoapFactory = new CoapClientFactory();

runHttp("http://localhost:8081/test", myHttpFactory.getClient(), () => { runCoap("coap://localhost:5683/test", myCoapFactory.getClient()); });


function runHttp(uri : string, client : ProtocolClient, next : Function) {
    console.log("\n=== HttpClient ===\n");

    client.start();
    client.readResource(uri).then( res => {
        console.log(res.toString());
        client.writeResource(uri, new Buffer("http-client")).then( () => {
            console.log("Write returned");
            client.readResource(uri).then( res => {
                console.log(res.toString());
                client.invokeResource(uri, null).then( res => {
                    console.log(res.toString());
                    client.unlinkResource(uri).then( () => {
                        console.log("Unlink returned");
                        client.stop();
                        next();
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}

function runCoap(uri : string, client : ProtocolClient) {
    console.log("\n=== CoapClient ===\n");

    client.start();
    client.readResource(uri).then( res => {
        console.log(res.toString());
        client.writeResource(uri, new Buffer("coap-client")).then( () => {
            console.log("Write returned");
            client.readResource(uri).then( res => {
                console.log(res.toString());
                client.invokeResource(uri, null).then( res => {
                    console.log(res.toString());
                    client.unlinkResource(uri).then( () => {
                        console.log("Unlink returned");
                        client.stop();
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}