"use strict"

WoT.consume("http://127.0.0.1:8080/TestThing").then(thing => {
        thing.getProperty("bool")
            .then( res => {
                console.log("READ bool: " + res);
                thing.setProperty("bool", true).then( ret => {
                thing.setProperty("bool", false).then( ret => {
                thing.setProperty("bool", "true").then( ret => {
                })})});
            })
            .catch(err => console.error(err));
        
        thing.getProperty("int")
            .then( res => {
                console.log("READ int: " + res);
                thing.setProperty("int", 4711);
                thing.setProperty("int", 3.1415);
                thing.setProperty("int", "true");
            })
            .catch(err => console.error(err));
        
        thing.getProperty("num")
            .then( res => {
                console.log("READ num: " + res);
                thing.setProperty("num", 4711);
                thing.setProperty("num", 3.);
                thing.setProperty("num", "true");
            })
            .catch(err => console.error(err));
        
        thing.getProperty("string")
            .then( res => {
                console.log("READ string: " + res);
                thing.setProperty("string", "client");
                thing.setProperty("string", null);
                thing.setProperty("string", 12);
            })
            .catch(err => console.error(err));
    })
    .catch(err => console.error(err));