//just an example script - to be moved into other repo
const NAME_PROPERTY_COUNT = "count";
const NAME_ACTION_INCREMENT = "increment";
const NAME_ACTION_DECREMENT = "decrement";

let thing = WoT.expose({
		name: "counter",
		semanticTypes : undefined,
		metadata : undefined
});
	
console.log("Created thing " + thing.name);

thing.addProperty({
	name : NAME_PROPERTY_COUNT,
	type: JSON.stringify({ type: "integer" }),
	initValue : 5,
	onWrite : function(newValue, oldValue) {
		console.log(NAME_PROPERTY_COUNT + ": " + oldValue + " -> " + newValue);
		var message = (oldValue < newValue)? "increased" : "decreased";
		console.log("counter " + message + " to " + newValue);
	}
})

thing.addAction({
	name : NAME_ACTION_INCREMENT,
	action : (newValue, oldValue) => {
		console.log("incrementing counter");
		return thing.readProperty(NAME_PROPERTY_COUNT).then(function(count){
			let value = count + 1;
			thing.writeProperty(NAME_PROPERTY_COUNT, value);
			return value;
		})
	}
})

thing.addAction({
	name : NAME_ACTION_DECREMENT,
	action : (newValue, oldValue) => {
		console.log("decrementing counter");
		return thing.readProperty(NAME_PROPERTY_COUNT).then(function(count){
			let value = count - 1;
			thing.writeProperty(NAME_PROPERTY_COUNT, value);
			return value;
		})
	}
})

thing.start();
