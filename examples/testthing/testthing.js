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
            .setProperty("array_property", []);

        thing
            .onUpdateProperty("num_property", (param) => {
                let inputtype = typeof param;
                console.log("num_property called with " + inputtype);
            }
            );

        thing
            .addAction("int_void_action")
            .onInvokeAction("int_void_action", function (param) {
                let inputtype = typeof param;
                console.log("int_void_action called with " + inputtype);
            });

        thing
            .addAction("int_int_action")
            .onInvokeAction("int_int_action", function (param) {
                let inputtype = typeof param;
                console.log("int_int_action called with " + inputtype);
                return 0;
            });

        thing
            .addAction("string_void_action")
            .onInvokeAction("string_void_action", function (param) {
                let inputtype = typeof param;
                console.log("string_void_action called with " + inputtype);
            });

    });
