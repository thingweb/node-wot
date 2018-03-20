//just an example script - to be moved into other repo
const NAME_PROPERTY_COUNT = "count";
const NAME_ACTION_INCREMENT = "increment";
const NAME_ACTION_DECREMENT = "decrement";
const NAME_ACTION_RESET = "reset";

let thing = WoT.produce({
    name: "counter"
});

console.log("Created thing " + thing.name);

thing.addProperty({
	name : NAME_PROPERTY_COUNT,
	schema : '{ "type": "number"}',
	value : 0,
	observable : true,
	writeable : true
})

thing.setPropertyWriteHandler( 
	NAME_PROPERTY_COUNT,
	(value) => {
		console.log("Setting '" + NAME_PROPERTY_COUNT + "' value to " + value);
	}
);

thing.addAction({
    name : NAME_ACTION_INCREMENT
})

thing.addAction({
    name : NAME_ACTION_DECREMENT
})

thing.addAction({
    name : NAME_ACTION_RESET
})

thing.setActionHandler( 
	NAME_ACTION_RESET,
	(parameters) => {
		console.log("Resetting");
		thing.writeProperty(NAME_PROPERTY_COUNT, 0);
	}
);

thing.setActionHandler(
	NAME_ACTION_INCREMENT,
	(parameters) => {
		console.log("Incrementing");
		return thing.readProperty(NAME_PROPERTY_COUNT).then(function(count){
			let value = count + 1;
			thing.writeProperty(NAME_PROPERTY_COUNT, value);
		});
	}
);

thing.setActionHandler(
	NAME_ACTION_DECREMENT,
	(parameters) => {
		console.log("Decrementing");
		return thing.readProperty(NAME_PROPERTY_COUNT).then(function(count){
			let value = count - 1;
			thing.writeProperty(NAME_PROPERTY_COUNT, value);
		});
	}
);

thing.start();
