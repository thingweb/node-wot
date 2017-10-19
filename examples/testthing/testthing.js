"use strict"

function checkPropertyWrite(expected, actual) {
    let output = "Property " + expected + " written with " + actual;
    if (expected === actual) {
        console.info("PASS: " + output);
    } else {
        throw new Error("FAIL: " + output);
    }
}

function checkActionInvocation(name, expected, actual) {
    let output = "Action " + name + " invoked with " + actual;
    if (expected === actual) {
        console.info("PASS: " + output);
    } else {
        throw new Error("FAIL: " + output);
    }
}

WoT.expose({name: "TestThing", url: "", description : {}})
    .then(function (thing) {
        console.info(thing.name + " running");

        thing.addProperty( {name : "bool", value : false}); // type

        thing.addProperty( {name : "int", value : 42}); // type

        thing.addProperty( {name : "num", value : 3.14}); // type

        thing.addProperty( {name : "string", value : "unset"}); // type

        thing.addProperty( {name : "array", value : [2, ""]}); // type: "array"

        thing.addProperty( {name : "object", value : {"prop1": 123, "prop2" : "abc"}}); // "type": "object"
        // thing
        //     .addProperty("object", { "type": "object",
        //         "properties": {
        //             "prop1": {"type": "integer"},
        //             "prop2": {"type": "string"}
        //         },
        //         "required": [
        //             "prop1",
        //             "prop2"
        //         ]})
        //     .setProperty("object", {"prop1": 123, "prop2" : "abc"});

        // Property checks
        thing
        .onUpdateProperty({"request" : {name : "bool"},
            "callback" : (param) => {
                checkPropertyWrite("boolean", typeof param);
            }
        })
        .onUpdateProperty({"request" : {name : "int"},
            "callback" : (param) => {
                let inputtype = typeof param;
                if (param === Math.floor(param)) inputtype = "integer";
                checkPropertyWrite("integer", inputtype);
            }
        })
        .onUpdateProperty({"request" : {name : "num"},
            "callback" : (param) => {
                checkPropertyWrite("number", typeof param);
            }
        })
        .onUpdateProperty({"request" : {name : "string"},
            "callback" : (param) => {
                checkPropertyWrite("string", typeof param);
            }
        })
        .onUpdateProperty({"request" : {name : "array"},
            "callback" : (param) => {
                let inputtype = typeof param;
                if (Array.isArray(param)) inputtype = "array";
                checkPropertyWrite("array", inputtype);
            }
        })
        .onUpdateProperty({"request" : {name : "object"},
            "callback" : (param) => {
                let inputtype = typeof param;
                if (Array.isArray(param)) inputtype = "array";
                checkPropertyWrite("object", inputtype);
            }
        })
        ;

        // Actions
        thing
        .addAction({name : "void-void"})
        .onInvokeAction({"request" : {name : "void-void"},
            "callback" : (param) => {
                checkActionInvocation("void-void", "undefined", typeof param);
        }});

        thing
        .addAction({name : "void-int"}) // ("void-int", null, { type: "integer" })
        .onInvokeAction({"request" : {name : "void-int"},
            "callback" : function (param) {
                checkActionInvocation("void-int", "undefined", typeof param);
                return 0;
        }});

        thing
        .addAction({name : "int-void"}) // "int-void", { type: "integer" })
        .onInvokeAction({"request" : {name : "int-void"},
            "callback" :  function (param) {
                let inputtype = typeof param;
                if (param === Math.floor(param)) inputtype = "integer";
                checkActionInvocation("int-void", "integer", inputtype);
        }});

        thing
        .addAction({name : "int-int"})  // "int-int", { type: "integer" }, { type: "integer" })
        .onInvokeAction({"request" : {name : "int-int"},
            "callback" : function (param) {
                let inputtype = typeof param;
                if (param === Math.floor(param)) inputtype = "integer";
                checkActionInvocation("int-int", "integer", inputtype);
                return param+1;
        }});

        thing
        .addAction({name : "int-string"}) // "int-string", { type: "string" })
        .onInvokeAction({"request" : {name : "int-string"},
            "callback" : function (param) {
                let inputtype = typeof param;
                if (param === Math.floor(param)) inputtype = "integer";
                checkActionInvocation("int-string", "integer", inputtype);
                if (inputtype=="integer") {
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
        }});
        
        thing
        .addAction({name : "void-complex"}) // "void-complex", null, { "type": "object",
            // "properties": {
            //     "prop1": {"type": "integer"},
            //     "prop2": {"type": "string"}
            // },
            // "required": [
            //     "prop1",
            //     "prop2"
            // ]})
        .onInvokeAction({"request" : {name : "void-complex"},
            "callback" : function (param) {
                checkActionInvocation("void-complex", "undefined", typeof param);
                return {"prop1": 123, "prop2" : "abc"};
        }});

        thing
        .addAction({name : "complex-void"}) // "complex-void", { "type": "object",
            // "properties": {
            //     "prop1": {"type": "integer"},
            //     "prop2": {"type": "string"}
            // },
            // "required": [
            //     "prop1",
            //     "prop2"
            // ]})
        .onInvokeAction({"request" : {name : "complex-void"},
            "callback" : function (param) {
                checkActionInvocation("complex-void", "object", typeof param);
        }});
    });
