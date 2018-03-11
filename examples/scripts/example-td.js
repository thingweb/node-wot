let thingDescription = '{ "@context": [ "https://w3c.github.io/wot/w3c-wot-td-context.jsonld", "https://w3c.github.io/wot/w3c-wot-common-context.jsonld" ], "@type": [ "Thing", "Sensor" ], "name": "mySensor", "geo:location": "testspace", "interaction": [ { "@type": [ "Property", "Temperature" ], "name": "prop1", "schema": { "type": "number" }, "saref:TemperatureUnit": "degree_Celsius" } ] }';

// try in case thingDescription or script is erroneous
try {
  // WoT.procude() adds Interactions from TD
  let thing = WoT.produce(thingDescription);
  // add server functionality
  thing.setPropertyReadHandler( (propertyName) => {
    console.log("Handling read request for " + propertyName);
    return new Promise((resolve, reject) => {
      resolve(Math.random(100));
    })
  }, "prop1");
  thing.start();
} catch(err) {
  console.log("Script error: " + err);
}
