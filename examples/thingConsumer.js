var targetUri = "http://localhost:8080/counter";
var targetUriProperties = "http://localhost:8080/counter/properties";
var counterUri = "http://localhost:8080/counter/properties/count";
WoT.consume(targetUri).then(function(thing) {
	thing.getProperty("count").then(function(count){
		console.log("count value is ",count);
    });
	thing.invokeAction("increment");
});