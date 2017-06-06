 //just an example script - to be moved into other repo

 WoT.createThing("counter")
    .then(function(thing) {
        console.log("created " + thing.name);

        thing
        .addProperty("count", { type: "integer" })
        .setProperty("count",0);
        
        thing
        .onUpdateProperty("count",
            function(newValue, oldValue) {
                console.log(oldValue + " -> " + newValue);
                var message = (oldValue < newValue)? "increased " : "decreased";
                console.log("counter " + message + " to " + newValue);
            }
         );

         thing
         .addAction("increment")
         .onInvokeAction("increment", function() {
            console.log("incrementing counter");
            return thing.getProperty("count").then(function(count){
                var value = count + 1;
                thing.setProperty("count", value);
                return value;
            })
         });

        thing
        .addAction("decrement")
        .onInvokeAction("decrement", function() {
             console.log("decrementing counter");
             return thing.getProperty("count").then(function(count){
                var value = count - 1;
                thing.setProperty("count", value);
                return value;
            })
        });
    });
