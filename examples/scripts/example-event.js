try {
    var counter = 0;

    var thing = WoT.produce({ name: "EventSource" });
    // manually add Interactions
    thing.addAction({
        name: "reset",
        // no input, no output
      }).addEvent({
      name: "onchange",
      schema: '{ "type": "number" }'
    });
    // add server functionality
    thing.setActionHandler("reset", () => {
      console.log("Resetting");
      counter = 0;
    });
    
    thing.start();
    
    setInterval( async () => {
      ++counter;
      thing.emitEvent("onchange", counter);
    }, 5000);
    
  } catch (err) {
     console.log("Script error: " + err);
  }
  