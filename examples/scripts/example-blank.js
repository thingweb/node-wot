try {
  var thing = WoT.produce({ name: "tempSensor" });
  // manually add Interactions
  thing.addProperty({
    name: "temperature",
    value: 0.0,
    schema: '{ "type": "number" }'
    // use default values for the rest
  }).addProperty({
    name: "max",
    value: 0.0,
    schema: '{ "type": "number" }'
    // use default values for the rest
  }).addAction({
    name: "reset",
    // no input, no output
  }).addEvent({
    name: "onchange",
    schema: '{ "type": "number" }'
  });
  // add server functionality
  thing.setActionHandler("reset", () => {
    console.log("Resetting maximum");
    thing.writeProperty("max", 0.0);
  });
  
  thing.start();
  
  setInterval( async () => {
    let mock = Math.random()*100;
    thing.writeProperty("temperature", mock);
    let old = await thing.readProperty("max");
    if (old < mock) {
      thing.writeProperty("max", mock);
      thing.emitEvent("onchange");
    }
  }, 1000);
  
} catch (err) {
   console.log("Script error: " + err);
}
