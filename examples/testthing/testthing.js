// just an example script - to be moved into other repo

WoT.createThing("TestThing")
    .then(function (thing) {
        console.log("created " + thing.name);

        thing
            .addProperty("bool", { type: "boolean" })
            .setProperty("bool", false);

        thing
            .addProperty("int", { type: "integer" })
            .setProperty("int", 0);

        thing
            .addProperty("num", { type: "number" })
            .setProperty("num", 0);

        thing
            .addProperty("string", { type: "string" })
            .setProperty("string", "unset");

        thing
            .addProperty("array", { type: "array" })
            .setProperty("array", [2, ""]);

        thing
            .addProperty("object", { "type": "object",
                "properties": {
                    "prop1": {"type": "integer"},
                    "prop2": {"type": "string"}
                },
                "required": [
                    "prop1",
                    "prop2"
                ]})
            .setProperty("object", {"prop1": 123, "prop2" : "abc"});

        // Property checks
        thing
            .onUpdateProperty("num", (param) => {
                let inputtype = typeof param;
                console.log("Property num written with " + inputtype);
            });

        // Actions
        thing
            .addAction("void-void")
            .onInvokeAction("void-void", function (param) {
                console.log("Action void-void invoked with " + param);
            });

        thing
            .addAction("void-int", null, { type: "integer" })
            .onInvokeAction("void-int", function (param) {
                console.log("Action void-int invoked with " + param);
                return 0
            });

        thing
            .addAction("int-void", { type: "integer" })
            .onInvokeAction("int-void", function (param) {
                let inputtype = typeof param;
                console.log("Action int-void invoked with " + inputtype);
            });

        thing
            .addAction("int-int", { type: "integer" }, { type: "integer" })
            .onInvokeAction("int-int", function (param) {
                let inputtype = typeof param;
                console.log("Action int-int invoked with " + inputtype);
                return param+1;
            });

        thing
            .addAction("int-string", { type: "string" })
            .onInvokeAction("int-string", function (param) {
                let inputtype = typeof param;
                console.log("Action int-string invoked with " + inputtype);
                if (inputtype=="string") {
                    return new String(param)
                                    .replace(/0/g,"zero-")
                                    .replace(/1/g,"one-")
                                    .replace(/2/g,"two-")
                                    .replace(/3/g,"three-")
                                    .replace(/4/g,"four-")
                                    .replace(/5/g,"five-")
                                    .replace(/6/g,"six-")
                                    .replace(/7/g,"seven-")
                                    .replace(/8/g,"eight-")
                                    .replace(/9/g,"nine-")
                } else {
                    return "ERROR";
                }
            });
        
        thing
            .addAction("void-complex", null, { "type": "object",
                "properties": {
                    "prop1": {"type": "integer"},
                    "prop2": {"type": "string"}
                },
                "required": [
                    "prop1",
                    "prop2"
                ]})
            .onInvokeAction("void-complex", function (param) {
                console.log("Action void-complex invoked with " + param);
                return {"prop1": 123, "prop2" : "abc"};
            });

        thing
            .addAction("complex-void", { "type": "object",
                "properties": {
                    "prop1": {"type": "integer"},
                    "prop2": {"type": "string"}
                },
                "required": [
                    "prop1",
                    "prop2"
                ]})
            .onInvokeAction("complex-void", function (param) {
                let inputtype = typeof param;
                console.log("Action complex-void invoked with " + inputtype);
            });
    });
