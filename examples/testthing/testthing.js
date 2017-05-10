//just an example script - to be moved into other repo

WoT.createThing("testthing")
    .then(function (thing) {
        console.log("created " + thing.name);

        thing
            .addProperty("int_property", { type: "integer" })
            .setProperty("int_property", 0);

        thing
            .addProperty("num_property", { type: "number" })
            .setProperty("num_property", 0);

        thing
            .addProperty("bool_property", { type: "boolean" })
            .setProperty("bool_property", false);

        thing
            .addProperty("string_property", { type: "string" })
            .setProperty("string_property", "");

        thing
            .addProperty("array_property", { type: "array" })
            .setProperty("array_property", [2, ""]);

        thing
            .addProperty("complex_property", { "type": "object",
                "properties": {
                    "prop1": {"type": "integer"},
                    "prop2": {"type": "string"}
                },
                "required": [
                    "prop1",
                    "prop2"
                ]})
            .setProperty("complex_property", {"prop1": 123, "prop2" : "abc"});

        thing
            .onUpdateProperty("num_property", (param) => {
                let inputtype = typeof param;
                console.log("num_property called with " + inputtype);
            }
            );

        thing
            .addAction("int_void_action", { type: "integer" })
            .onInvokeAction("int_void_action", function (param) {
                let inputtype = typeof param;
                console.log("int_void_action called with " + inputtype);
            });

        thing
            .addAction("int_int_action",{ type: "integer" }, { type: "integer" })
            .onInvokeAction("int_int_action", function (param) {
                let inputtype = typeof param;
                console.log("int_int_action called with " + inputtype);
                return 0;
            });

        thing
            .addAction("string_void_action", { type: "string" })
            .onInvokeAction("string_void_action", function (param) {
                let inputtype = typeof param;
                console.log("string_void_action called with " + inputtype);
            });
        thing
            .addAction("void_complex_action", null, { "type": "object",
                "properties": {
                    "prop1": {"type": "integer"},
                    "prop2": {"type": "string"}
                },
                "required": [
                    "prop1",
                    "prop2"
                ]})
            .onInvokeAction("void_complex_action", function (param) {

                console.log("void_complex_action called  return " +  {"prop1": 123, "prop2" : "abc"});

                return {"prop1": 123, "prop2" : "abc"};
            });
            thing
            .addAction("complex_void_action", { "type": "object",
                "properties": {
                    "prop1": {"type": "integer"},
                    "prop2": {"type": "string"}
                },
                "required": [
                    "prop1",
                    "prop2"
                ]})
            .onInvokeAction("complex_void_action", function (param) {
                let inputtype = typeof param;
                console.log("complex_void_action called  " + inputtype);

                return {"prop1": 123, "prop2" : "abc"};
            });
    });
