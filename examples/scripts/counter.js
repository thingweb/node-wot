//just an example script - to be moved into other repo
const NAME_PROPERTY_COUNT = "count";
const NAME_ACTION_INCREMENT = "increment";
const NAME_ACTION_DECREMENT = "decrement";

WoT.expose({name: "counter", url: "", description : undefined})
    .then(function(thing) {
        console.log("created " + thing.name);

		fnOnWrite = function(newValue, oldValue) {
                console.log(NAME_PROPERTY_COUNT + ": " + oldValue + " -> " + newValue);
                var message = (oldValue < newValue)? "increased" : "decreased";
                console.log("counter " + message + " to " + newValue);
            };
		
        thing
        .addProperty({
			name : NAME_PROPERTY_COUNT,
			description: JSON.stringify({ type: "integer" }),
			onWrite : fnOnWrite,
			value : 5
		})
        // .onUpdateProperty({"request" : {name : NAME_PROPERTY_COUNT},
        //     "callback" : fnOnWrite
        // })
		;

        thing
        .addAction({
			name : NAME_ACTION_INCREMENT,
			action : (newValue, oldValue) => {
                console.log("incrementing counter");
                return thing.getProperty(NAME_PROPERTY_COUNT).then(function(count){
                    let value = count + 1;
                    thing.setProperty(NAME_PROPERTY_COUNT, value);
                    return value;
                })
			}
		})
        // .onInvokeAction({"request" : {name : NAME_ACTION_INCREMENT},
        //     "callback" : () => {
        //         console.log("incrementing counter");
        //         return thing.getProperty(NAME_PROPERTY_COUNT).then(function(count){
        //             let value = count + 1;
        //             thing.setProperty(NAME_PROPERTY_COUNT, value);
        //             return value;
        //         })
        // }})
		;

        thing
        .addAction({
			name : NAME_ACTION_DECREMENT,
			action : (newValue, oldValue) => {
                console.log("decrementing counter");
                return thing.getProperty(NAME_PROPERTY_COUNT).then(function(count){
                    let value = count - 1;
                    thing.setProperty(NAME_PROPERTY_COUNT, value);
                    return value;
                })
			}
		})
        // .onInvokeAction({"request" : {name : NAME_ACTION_DECREMENT},
        //     "callback" : () => {
        //         console.log("decrementing counter");
        //         return thing.getProperty(NAME_PROPERTY_COUNT).then(function(count){
        //             let value = count - 1;
        //             thing.setProperty(NAME_PROPERTY_COUNT, value);
        //             return value;
        //         })
        // }})
		;
		
		thing.start();
    });
