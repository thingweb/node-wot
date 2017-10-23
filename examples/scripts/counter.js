//just an example script - to be moved into other repo
const NAME_PROPERTY_COUNT = "count";
const NAME_ACTION_INCREMENT = "increment";
const NAME_ACTION_DECREMENT = "decrement";

WoT.expose({name: "counter", url: "", description : {}})
    .then(function(thing) {
        console.log("created " + thing.name);

        thing
        .addProperty( {name : NAME_PROPERTY_COUNT, value : 5})
        .onUpdateProperty({"request" : {name : NAME_PROPERTY_COUNT},
            "callback" : function(newValue, oldValue) {
                console.log(NAME_PROPERTY_COUNT + ": " + oldValue + " -> " + newValue);
                var message = (oldValue < newValue)? "increased" : "decreased";
                console.log("counter " + message + " to " + newValue);
            }
        });

        thing
        .addAction({name : NAME_ACTION_INCREMENT})
        .onInvokeAction({"request" : {name : NAME_ACTION_INCREMENT},
            "callback" : () => {
                console.log("incrementing counter");
                return thing.getProperty(NAME_PROPERTY_COUNT).then(function(count){
                    let value = count + 1;
                    thing.setProperty(NAME_PROPERTY_COUNT, value);
                    return value;
                })
        }});

        thing
        .addAction({name : NAME_ACTION_DECREMENT})
        .onInvokeAction({"request" : {name : NAME_ACTION_DECREMENT},
            "callback" : () => {
                console.log("incrementing counter");
                return thing.getProperty(NAME_PROPERTY_COUNT).then(function(count){
                    let value = count - 1;
                    thing.setProperty(NAME_PROPERTY_COUNT, value);
                    return value;
                })
        }});
		
		thing.start();
    });
