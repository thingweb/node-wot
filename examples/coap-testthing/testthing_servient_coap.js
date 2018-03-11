// const node_wot = require('node-wot')
// const CoapServer =  require('node-wot-protocol-coap').default
// const HttpServer =  require('node-wot-protocol-http').default

const node_wot = require('../../node-wot')
const CoapServer = require('../../node-wot-protocol-coap').default
const HttpServer = require('../../node-wot-protocol-http').default
const fs = require('fs')

const srv =  new node_wot.Servient()
srv.addServer(new CoapServer())
srv.addServer(new HttpServer())
const wot = srv.start()

// '../testthing/testthing.js'
fs.readFile('examples/testthing/testthing.js', "utf8", (err, data) => {
    if (err) {
        console.error("error while reading script", err);
    } else {
        //console.log("running script", data);
        srv.runPriviledgedScript(data);
    }
});
