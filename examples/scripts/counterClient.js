var targetUri = "http://localhost:8080/counter";
var targetUriProperties = "http://localhost:8080/counter/properties";
var counterUri = "http://localhost:8080/counter/properties/count";

WoT.consume(targetUri).then( thing => {
	thing.getProperty("count").then( count => {
			console.log("count value is", count);
    });
	thing.invokeAction("increment").then( () => {
		thing.getProperty("count").then( count => {
			console.log("count value is", count);
    });
	});
});