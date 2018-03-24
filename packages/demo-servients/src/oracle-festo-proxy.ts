/*
 * W3C Software License
 *
 * Copyright (c) 2018 the thingweb community
 *
 * THIS WORK IS PROVIDED "AS IS," AND COPYRIGHT HOLDERS MAKE NO REPRESENTATIONS OR
 * WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF
 * MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE
 * SOFTWARE OR DOCUMENT WILL NOT INFRINGE ANY THIRD PARTY PATENTS, COPYRIGHTS,
 * TRADEMARKS OR OTHER RIGHTS.
 *
 * COPYRIGHT HOLDERS WILL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR
 * CONSEQUENTIAL DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENT.
 *
 * The name and trademarks of copyright holders may NOT be used in advertising or
 * publicity pertaining to the work without specific, written prior permission. Title
 * to copyright in this work will at all times remain with copyright holders.
 */

"use strict";

// global W3C WoT Scripting API definitions
import _ from "@node-wot/core";

// node-wot implementation of W3C WoT Servient 
import { Servient } from "@node-wot/core";

// exposed protocols
import { OracleServer } from "@node-wot/binding-oracle";
import { HttpServer } from "@node-wot/binding-http";

// consuming protocols
import { CoapClientFactory } from "@node-wot/binding-coap";
import { FileClientFactory } from "@node-wot/binding-file";

console.debug = () => {};
console.log = () => {};

let servient = new Servient();

servient.addServer(new HttpServer());
servient.addServer(new OracleServer());
servient.addClientFactory(new CoapClientFactory());
servient.addClientFactory(new FileClientFactory());

// get WoT object for privileged script
servient.start().then(async (WoT) => {

  console.info("OracleServient started");


  //let tdPumpP101 = await WoT.fetch("coap://192.168.2.198:5683/PumpP101/td");
  let tdPumpP101 = await WoT.fetch("file://./tdPumpP101.jsonld");
  //let tdValve = await WoT.fetch("coap://192.168.2.199:5683/td");
  let tdValveV102 = await WoT.fetch("file://./tdValveV102.jsonld");

  //let tdUltrasonicSensorB101 = await WoT.fetch("coap://192.168.2.127:5683/UltrasonicSensorB101/td");
  let tdUltrasonicSensorB101 = await WoT.fetch("file://./tdUltrasonicSensorB101.jsonld");

  //let tdB113 = await WoT.fetch("coap://192.168.2.136:5683/B113/td");
  let tdB113 = await WoT.fetch("file://./tdB113.jsonld");
  //let tdB114 = await WoT.fetch("coap://192.168.2.136:5683/B114/td");
  let tdB114 = await WoT.fetch("file://./tdB114.jsonld");

  let tdS111 = await WoT.fetch("file://./tdS111.jsonld");
  // S112 Tank102OverflowStatus
  let tdS112 = await WoT.fetch("file://./tdS112.jsonld");
  
  let PumpP101 = WoT.consume(tdPumpP101); // Status
  let ValveV102 = WoT.consume(tdValveV102); // Status

  let UltrasonicSensorB101 = WoT.consume(tdUltrasonicSensorB101); // level
  let B114 = WoT.consume(tdB114); // maxlevel101
  let B113 = WoT.consume(tdB113); // minlevel101

  let S111 = WoT.consume(tdS111); // overflow101
  let S112 = WoT.consume(tdS112); // overflow102

  setInterval( () => {
    PumpP101.readProperty("Status")
      .then( value => {
        console.info("+++ PumpStatus " + value);
        thing.writeProperty("PumpStatus", value==="ON"?true:false);
      })
      .catch( err => { console.error("+++ PumpStatus read error: " + err); });

    ValveV102.readProperty("Status")
      .then( value => {
        console.info("+++ ValveStatus " + value);
        thing.writeProperty("ValveStatus", value==="OPEN"?true:false);
      })
      .catch( err => { console.error("+++ ValveStatus read error: " + err); });

    UltrasonicSensorB101.readProperty("level")
      .then( value => {
        console.info("+++ Tank102LevelValue " + value);
        thing.writeProperty("Tank102LevelValue", value);
      })
      .catch( err => { console.error("+++ Tank102LevelValue read error: " + err); });
    S112.readProperty("overflow102")
    .then( value => {
      console.info("+++ Tank102OverflowStatus " + value);
      thing.writeProperty("Tank102OverflowStatus", value);
    })
    .catch( err => { console.error("+++ Tank102OverflowStatus read error: " + err); });

    B114.readProperty("maxlevel101")
      .then( value => {
        console.info("+++ Tank101MaximumLevelStatus " + value);
        thing.writeProperty("Tank101MaximumLevelStatus", value);
      })
      .catch( err => { console.error("+++ Tank101MaximumLevelStatus read error: " + err); });
    B113.readProperty("minlevel101")
      .then( value => {
        console.info("+++ Tank101MinimumLevelStatus " + value);
        thing.writeProperty("Tank101MinimumLevelStatus", value);
      })
      .catch( err => { console.error("+++ Tank101MinimumLevelStatus read error: " + err); });
    S111.readProperty("overflow101")
      .then( value => {
        console.info("+++ Tank101OverflowStatus " + value);
        thing.writeProperty("Tank101OverflowStatus", value);
      })
      .catch( err => { console.error("+++ Tank101OverflowStatus read error: " + err); });

  }, 2000);





  let thing = WoT.produce({ name: "FestoLive" });

  console.info(thing.name + " created");

  thing
    .addProperty({ name: "PumpStatus", schema: `{ "type": "boolean" }`, value: false, writable: true })
    .addProperty({ name: "ValveStatus", schema: `{ "type": "boolean" }`, value: false, writable: true })

    // upper tank (102)
    .addProperty({ name: "Tank102LevelValue", schema: `{ "type": "number" }`, value: 0.0, writable: false })
    .addProperty({ name: "Tank102OverflowStatus", schema: `{ "type": "boolean" }`, value: false, writable: false })

    // lower tank (101)
    .addProperty({ name: "Tank101MaximumLevelStatus", schema: `{ "type": "boolean" }`, value: false, writable: false })
    .addProperty({ name: "Tank101MinimumLevelStatus", schema: `{ "type": "boolean" }`, value: false, writable: false })
    .addProperty({ name: "Tank101OverflowStatus", schema: `{ "type": "boolean" }`, value: false, writable: false })
    
    // actuators
    .addAction({ name: "OpenValve" })
    .addAction({ name: "CloseValve" })
    .addAction({ name: "StartPump" })
    .addAction({ name: "StopPump" })
    .addAction({ name: "EmergencyStop" })

    .setActionHandler("OpenValve", () => {
        return new Promise((resolve, reject) => {
          console.warn(">>> Opening valve!");
          ValveV102.invokeAction("OpenPneumaticValve")
            .catch( err => { console.error("+++ OpenValve invoke error: " + err); });
          resolve();
        });
      }
    )
    .setActionHandler("CloseValve", () => {
        return new Promise((resolve, reject) => {
          console.warn(">>> Closing valve!");
          ValveV102.invokeAction("ClosePneumaticValve")
            .catch( err => { console.error("+++ CloseValve invoke error: " + err); });
          resolve();
        });
      }
    )

    .setActionHandler("StartPump", () => {
        return new Promise((resolve, reject) => {
          console.warn(">>> Startung pump!");
          PumpP101.invokeAction("On")
            .catch( err => { console.error("+++ StartPump invoke error: " + err); });
          resolve();
        });
      }
    )
    .setActionHandler("StopPump", () => {
        return new Promise((resolve, reject) => {
          console.warn(">>> Stopping pump!");
          PumpP101.invokeAction("Off")
            .catch( err => { console.error("+++ StopPump invoke error: " + err); });
          resolve();
        });
      }
    )

    .setActionHandler("EmergencyStop", (param) => {
        return new Promise((resolve, reject) => {
          console.warn(">>> EMERGENCY STOP!");
          console.dir(param);
          resolve();
        });
      }
    );

    console.info(thing.name + " ready");

}).catch( err => { console.error("Servient start error: " + err); });
