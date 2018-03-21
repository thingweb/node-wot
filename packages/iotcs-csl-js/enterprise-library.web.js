/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

(function () {
var name = 'iotcs';
function init(lib) {
'use strict';
//START///////////////////////////////////////////////////////////////////////

    /**
     * @global
     * @alias iotcs
     * @namespace
     */
    lib = lib || {};
    
    /**
     * @property {string} iotcs.name - the short name of this library
     */
    try {
        lib.name = lib.name || "iotcs";
    } catch(e) {}
    
    /**
     * @property {string} iotcs.description - the longer description
     */
    lib.description = "Oracle IoT Cloud Enterprise Client Library";

    /**
     * @property {string} iotcs.version - the version of this library
     */
    lib.version = "1.1";

    /**
     * Log an info message
     * @function 
     */
    lib.log = function (msg) {
        if (lib.debug) {
            _log('info', msg);
        }
    };

    /**
     * Throw and log an error message
     * @function 
     */
    lib.error = function (msg) {
        if (lib.debug && console.trace) {
            console.trace(msg);
        }
        _log('error', msg);
        throw '[iotcs:error] ' + msg;
    };

    /**
     * Log and return an error message
     * @function
     */
    lib.createError = function (msg, error) {
        if (lib.debug && console.trace) {
            console.trace(msg);
        }
        _log('error', msg);
        if (!error) {
            return new Error('[iotcs:error] ' + msg);
        }
        return error;
    };

    /** @ignore */
    function _log(level, msg) {
        var msgstr = '[iotcs:'+level+'] ' + msg;
        var logDOM = document.getElementById('iotcs-log');
        if (logDOM) {
            logDOM.innerHTML += '<span class="log-'+level+'">' + msgstr + '</span></br>';
        } else {
            console.log(msgstr);
        }
    }
    
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/@overview.js

/**
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 * @overview
 * The device and enterprise client libraries simplify working with
 * the Oracle IoT Cloud Service. These client libraries are a
 * higher-level abstraction over top of messages and REST APIs. Device
 * clients are designed to make it easy to expose device functionality
 * to the IoT Cloud Service, while enterprise clients are designed to
 * make it easy to inspect and control a device. The true state of a
 * device is within the device itself (whether the light is on or
 * off). A "virtual" device object is contained within the cloud and
 * enterprise clients that represent the last-known state of that
 * device, and allow enterprise clients to send commands and set
 * attributes of the device model (e.g., "turn the light off"). 
 *
 * <h2>Trusted Assets</h2>
 *
 * Trusted assets are defined as material that contribute to the chain
 * of trust between the client and the server. The client library
 * relies on an implementation of the
 * TrustedAssetsManager to securely manage
 * these assets on the client. The client-library has a default
 * implementation of the TrustedAssetsManager which uses a framework native
 * trust-store to secure the trust assets. To create the trust-store
 * for the default TrustedAssetsManager, the user must run the
 * TrustedAssetsProvisioner tool by using the script provided in the tools
 * depending if the provision is made for the enterprise or device
 * client library. Usage is available by running the tool without
 * arguments.
 *
 * <h2>Device Models</h2>
 *
 * A device model is a predefined specification of the attributes,
 * formats and resources of a device that can be accessed by the
 * client-library. The attributes of a device model represent the
 * basic variables that the device supports, such as temperature,
 * humidity, flow rate, valve position, and so forth. The formats of a
 * device model define the structure of a message payload. A format
 * describes the message attributes by specifying the attribute names,
 * types, optionality, and default values. The resources of a device
 * model define additional, ad-hoc REST resources which provide richer
 * REST support than what is possible with attributes and formats. 
 * <p>
 * The client library has explicit API for obtaining a device model
 * ({@link iotcs.enterprise.EnterpriseClient#getDeviceModel} or
 * {@link iotcs.device.DirectlyConnectedDevice#getDeviceModel}). This will generate for a
 * specified urn the device model associated with it and registered
 * in the cloud as JSON objects that contain all the attributes, actions
 * ant other specific information for a device model. With the generated
 * model a virtual device can be created that encapsulates all the
 * device functionality based on a specific model. If a device has more
 * than one model associated, for each model a different virtual device
 * can be crated and monitored/controlled.
 *
 * <h2>Enterprise Client</h2>
 *
 * Both enterprise and device clients share common API for getting and
 * setting values through a user-interface (in the case of an
 * enterprise-client application) and for getting and setting values
 * on a physical device (in the case of a device-client
 * application).
 * <p>
 * An enterprise-client application will create an {@link iotcs.enterprise.EnterpriseClient}
 * based on an application already created on the server using the static method
 * {@link iotcs.enterprise.EnterpriseClient.newClient}. A list of applications that the user has access to can be
 * retrieved by using the static method {@link iotcs.enterprise.EnterpriseClient.getApplications}.
 * From there, the application can list all the device models
 * that are registered with it by using {@link iotcs.enterprise.EnterpriseClient#getDeviceModels}.
 * After selecting models the list of active devices that have the selected
 * models can be retrieved by using {@link iotcs.enterprise.EnterpriseClient#getActiveDevices}.
 * After selecting combination of models/devices, using the device id's and retrieved
 * models the application can create instances of {@link iotcs.enterprise.VirtualDevice}
 * which provides access to monitor and control the devices.
 *
 * <h2>Device Client</h2>
 *
 * A device-client application will create a {@link iotcs.device.DirectlyConnectedDevice} or
 * a {@link iotcs.device.GatewayDevice} (for indirectly connected devices registration)
 * based on a device already registered on the server that has a logical ID already assigned
 * and saved in a {endpointId}.json generated based on that ID and shared secret
 * associated with the device registered by the TrustedAssetsProvisioner. If the device should
 * be checked if is activated and if is not then the activation should be done.
 * In the course of the activation trusted material used for future authentication with
 * the server will be generated by the TrustedAssetsManager and saved in the
 * {endpointId}.json. In the activation method the model URN's (and capabilities) that the client
 * is implementing (if any) must be given as parameters.
 * <p>
 * After activation (done only if needed) the client should retrieve the device models for the
 * URN's that it is implementing or that other indirectly connected device that is registering
 * in the future are implementing by using the {@link iotcs.device.DirectlyConnectedDevice#getDeviceModel}
 * or {@link iotcs.device.GatewayDevice#getDeviceModel} methods.
 * <p>
 * If the client is a {@link iotcs.device.GatewayDevice}, it can use the
 * {@link iotcs.device.GatewayDevice#registerDevice} method to register other indirectly
 * connected devices that it is using. The server will assign logical endpoint id's to
 * these devices and return them to the client.<br>
 * <b>Be aware that all endpoint id's assigned by the server to indirectly connected
 * devices must be persisted and managed by the device application to use them for creating
 * virtual devices. There is no method for retrieving them from the server side and at
 * an eventual device application restart the id's must be reused.</b><br>
 * <p>
 * After selecting combination of logical endpoint id's (including the client own id) and
 * device models, the client can create instances of {@link iotcs.device.VirtualDevice} by
 * using the constructor or the {@link iotcs.device.DirectlyConnectedDevice#createVirtualDevice}
 * and {@link iotcs.device.GatewayDevice#createVirtualDevice} methods which provides
 * access to messaging to/from the cloud for the specific logical devices.
 *
 * @example <caption>Enterprise Client Quick Start</caption>
 *
 * //The following steps must be taken to run an enterprise-client application.
 *
 * var appName;
 * var ec;
 * var model;
 * var deviceId;
 * var device;
 *
 * // 1. Select an application
 *
 * iotcs.enterprise.EnterpriseClient
 *      .getApplications()
 *      .page('first')
 *      .then(function(response){
 *          response.items.forEach(function (item) {
 *              //select and application and set appName (the application name)
 *          });
 *          initializeEnterpriseClient();
 *      }, function(error){
 *          //handle error in enumeration
 *      });
 *
 * // 2. Initialize enterprise client
 *
 * function initializeEnterpriseClient(){
 *      iotcs.enterprise.EnterpriseClient.newClient(appName, function (client, error) {
 *          if (!client || error) {
 *              //handle client creation error
 *          }
 *          ec = client;
 *          selectDeviceModel();
 *      }
 * }
 *
 * // 3. Select a device model available in the app
 *
 * function selectDeviceModel(){
 *      ec.getDeviceModels()
 *          .page('first')
 *          .then(function(response){
 *              response.items.forEach(function (item) {
 *                  //select a device model and set model
 *              });
 *              selectDevice();
 *          }, function(error){
 *              //handle error in enumeration
 *          });
 * }
 *
 * // 4. Select an active device implementing the device model
 *
 * function selectDevice(){
 *      ec.getActiveDevices(model)
 *          .page('first')
 *          .then(function(response){
 *              response.items.forEach(function (item) {
 *                  //select a device and set the deviceId
 *              });
 *              createVirtualDevice();
 *          }, function(error){
 *              //handle error in enumeration
 *          });
 * }
 *
 * // 5. Create a virtual device for this model
 *
 * function createVirtualDevice(){
 *      device = ec.createVirtualDevice(deviceId, model);
 *      monitorVirtualDevice();
 *      updateVirtualDeviceAttribute();
 *      executeVirtualDeviceAction();
 * }
 *
 * // 6. Monitor the device through the virtual device
 *
 * function monitorVirtualDevice(){
 *      device.onChange = function(onChangeTuple){
 *          //print the new value and attribute
 *          console.log('Attribute '+onChangeTuple.attribute.name+' changed to '+onChangeTuple.newValue);
 *          //process change
 *      };
 *      device.onAlerts = function(alerts){
 *          for (var key in alerts) {
 *              alerts[key].forEach(function (alert) {
 *                  //print alert
 *                  console.log('Received time '+alert.eventTime+' with data '+JSON.stringify(alert.fields));
 *                  //process alert
 *              });
 *          }
 *      };
 * }
 *
 * // 7. Update the value of an attribute
 *
 * function updateVirtualDeviceAttribute(){
 *      device.onError = function(onErrorTuple){
 *          //handle error case on update
 *      };
 *      device.attributeName.value = someValue;
 * }
 *
 * // 8. Execute action on virtual device
 *
 * function executeVirtualDeviceAction(){
 *      device.someAction.onExecute = function(response){
 *          //handle execute action response from server
 *      };
 *      device.call('someAction');
 * }
 *
 * // 9. Dispose of the device
 *
 * device.close();
 *
 * // 10. Dispose of the enterprise client
 *
 * ec.close();
 *
 * @example <caption>Device Client Quick Start</caption>
 *
 * //The following steps must be taken to run a device-client application. This
 * //sample is for a gateway device that does not implement any specific model
 * //that registers one indirectly connected device.
 * //The model must be already in the cloud registered.
 *
 * var trustedAssetsFile = '0-SOMEID.json';
 * var trustedAssetsPassword = 'changeit';
 *
 * var gateway;
 * var model;
 * var indirectDeviceId;
 * var indirectDevice;
 * var indirectDeviceSerialNumber = 'someUniqueID' ;
 * var indirectDeviceMetadata = {};
 *
 * // 1. Create the device client (gateway)
 *
 * gateway = new iotcs.device.GatewayDevice(trustedAssetsFile, trustedAssetsPassword);
 *
 * // 2. Activate the device if needed
 *
 * if (!gateway.isActivated()) {
 *      gateway.activate([], function (device, error) {
 *          if (!device || error) {
 *              //handle activation error
 *          }
 *          selectDeviceModel();
 *      });
 * } else {
 *      selectDeviceModel();
 * }
 *
 * // 3. Select the device model
 *
 * function selectDeviceModel(){
 *      gateway.getDeviceModel('urn:myModel', function (response, error) {
 *          if (!response || error) {
 *              //handle get device model error
 *          }
 *          model = response;
 *          enrollDevice();
 *      });
 * }
 *
 * // 4. Register an indirectly connected device
 *
 * function enrollDevice(){
 *      gateway.registerDevice(indirectDeviceSerialNumber, indirectDeviceMetadata, ['urn:myModel'],
 *          function (response, error) {
 *              if (!response || error) {
 *                  //handle enroll error
 *              }
 *              indirectDeviceId = response;
 *              createVirtualDevice();
 *          });
 * }
 *
 * // 5. Create a virtual device for the indirectly connected device
 *
 * function createVirtualDevice(){
 *      device = gateway.createVirtualDevice(deviceId, model);
 *      monitorVirtualDevice();
 *      updateVirtualDeviceAttribute();
 *      sendVirtualDeviceAlert();
 * }
 *
 * // 6. Monitor the device through the virtual device (it has two actions: power and reset)
 *
 * function monitorVirtualDevice(){
 *      device.onChange = function(onChangeTuple){
 *          //print the new value and attribute
 *          console.log('Attribute '+onChangeTuple.attribute.name+' changed to '+onChangeTuple.newValue);
 *          //process change
 *          throw new Error('some message'); //if some error occurred
 *      };
 *      device.power.onExecute = function(value){
 *          if (value) {
 *              //shutdown the device
 *          } else {
 *              //start the device
 *          }
 *      };
 *      device.reset.onExecute = function(){
 *          //reset the device
 *          throw new Error('some message'); //if some error occurred
 *      };
 * }
 *
 * // 7. Update the value of an attribute
 *
 * function updateVirtualDeviceAttribute(){
 *      device.onError = function(onErrorTuple){
 *          //handle error case on update
 *      };
 *      device.attributeName.value = someValue;
 * }
 *
 * // 8. Raise an alert to be sent to the cloud
 *
 * function sendVirtualDeviceAlert(){
 *      var alert = device.createAlert('urn:myAlert');
 *      alert.fields.mandatoryFieldName = someValue;
 *      alert.fields.optionalFieldName = someValue; //this is optional
 *      alert.raise();
 * }
 *
 * // 9. Dispose of the virtual device
 *
 * device.close();
 *
 * // 10. Dispose of the gateway device client
 *
 * ec.close();
 *
 * @example <caption>Storage Cloud Quick Start</caption>
 *
 * // This shows how to use the Virtualization API to upload content to,
 * // or download content from, the Oracle Storage Cloud Service.
 * // To upload or download content, there must be an attribute, field,
 * // or action in the device model with type URI.
 * // When creating a DataItem for an attribute, field, or action of type URI,
 * // the value is set to the URI of the content in cloud storage.
 *
 * //
 * // Uploading content
 * //
 *
 * // An instance of iotcs.device.StorageObject is first needed to upload a file
 * // from a device client or from an enterprise client.
 * // The StorageObject is created using the createStorageObject API in iotcs.Client,
 * // which is the base class for iotcs.enterprise.EnterpriseClient, iotcs.device.DirectlyConnectedDevice,
 * // and iotcs.device.GatewayDevice. The StorageObject names the object in storage,
 * // and provides the mime-type of the content.
 * // To set the input path, the StorageObject API setInputPath(String path) is used.
 *
 * // This example shows the typical use case from a DirectlyConnectedDevice.
 * // But the code for a GatewayDevice or EnterpriseClient is the same.
 *
 * var storageObjectUpload = gateway.createStorageObject("uploadFileName", "image/jpg");
 * storageObjectUpload.setInputPath("upload.jpg");
 * virtualDevice.attributeName.value = storageObjectUpload;
 * // OR
 * virtualDevice.update({attributeName: storageObjectUpload});
 *
 * // A StorageObject may also be set on an Alert field, or as an Action parameter,
 * // provided the type in the device model is URI
 *
 * //
 * // Downloading content
 * //
 *
 * // In the Virtualization API, the client is notified through an onChange tuple,
 * // onAlert tuple, or a call callback for an action. The value in the tuple is a StorageObject.
 * // To download the content, the output path is set on the StorageObject,
 * // and the content is synchronized by calling the StorageObject sync() API.
 *
 * // This example shows the typical use case from an onChange event.
 * // The code for an onAlert or for an action callback is much the same.
 *
 * virtualDevice.attributeName.onChange = function (tuple) {
 *     var name = tuple.attribute.id;
 *     var storageObject = tuple.newValue;
 *     // only download if image is less than 4M
 *     if (storageObject.getLength() < 4 * 1024 * 1024) {
 *         storageObject.setOutputPath("download.jpg");
 *         storageObject.sync();
 *     }
 * };
 *
 * //
 * // Checking synchronization status
 * //
 *
 * // A StorageObject is a reference to some content in the Storage Cloud.
 * // The content can be in sync with the storage cloud, not in sync with the storage cloud,
 * // or in process of being sync'd with the storage cloud.
 * // The synchronization can be monitored by setting a SyncCallback with onSync.
 * // For the upload case, set the onSync callback on the storage object
 * // before setting the virtual device attribute.
 * // For the download case, set the onSync callback on the storage object
 * // from within the onChange callback.
 *
 * storageObject.onSync = function (event) {
 *     var sourceStorageObject = event.getSource();
 *     if (sourceStorageObject.getSyncStatus() === iotcs.device.StorageObject.SyncStatus.IN_SYNC) {
 *         // image was uploaded
 *     } else if (sourceStorageObject.getSyncStatus() === iotcs.device.StorageObject.SyncStatus.FAILED) {
 *         // image was not uploaded, take action!
 *     }
 * }
 */


//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/@globals.js

/**
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

/**
 * @namespace
 * @alias iotcs.enterprise
 * @memberOf iotcs
 */
lib.enterprise = {};

//////////////////////////////////////////////////////////////////////////////

/** @ignore */
lib.oracle = lib.oracle || {};

/** @ignore */
lib.oracle.iot = lib.oracle.iot || {};

/** @ignore */
lib.oracle.iot.client = lib.oracle.iot.client || {};

//////////////////////////////////////////////////////////////////////////////

/** @ignore */
lib.oracle.iot.client.pageable = lib.oracle.iot.client.pageable || {};

/**
 * Default limit of items retrieved for each page when using
 * Pageable functionality
 *
 * @name iotcs․oracle․iot․client․pageable․defaultLimit
 * @global
 * @type {number}
 * @default 50
 */
lib.oracle.iot.client.pageable.defaultLimit = lib.oracle.iot.client.pageable.defaultLimit || 50;

//////////////////////////////////////////////////////////////////////////////

/**
 * Default timeout (in milliseconds) used when doing http/https requests.
 * This can be overridden in certain contexts, like when
 * using long polling feature.
 *
 * @name iotcs․oracle․iot․client․httpConnectionTimeout
 * @global
 * @type {number}
 * @default 15000
 */
lib.oracle.iot.client.httpConnectionTimeout = lib.oracle.iot.client.httpConnectionTimeout || 15000;

/** @ignore */
lib.oracle.iot.client.monitor = lib.oracle.iot.client.monitor || {};

/**
 * The time interval (in milliseconds) used by the
 * monitor (JS interval), used as the global thread pool
 * of the iotcs client library.
 * <br>
 * In the enterprise client library this is the actual
 * polling interval used for virtual device monitoring,
 * message monitoring and async request response monitoring.
 * <br>
 * In the device client library this is the minimum polling
 * interval used by the MessageDispatcher for sending/receiving
 * messages.
 *
 * @name iotcs․oracle․iot․client․monitor․pollingInterval
 * @global
 * @type {number}
 * @default device: 1000, enterprise: 3000
 */
lib.oracle.iot.client.monitor.pollingInterval = lib.oracle.iot.client.monitor.pollingInterval || 3000;

/**
 * The maximum number of alerts/custom formats retrieved
 * by the enterprise client when doing monitoring of
 * virtual devices.
 *
 * @name iotcs․oracle․iot․client․monitor․formatLimit
 * @global
 * @type {number}
 * @default 10
 */
lib.oracle.iot.client.monitor.formatLimit = lib.oracle.iot.client.monitor.formatLimit || 10;

/**
 * The StorageDispatcher queue size (in number of storage objects),
 * for store and forward functionality.
 *
 * @name iotcs․oracle․iot․client․maximumStorageObjectsToQueue
 * @global
 * @type {number}
 * @default 50
 */
lib.oracle.iot.client.maximumStorageObjectsToQueue = lib.oracle.iot.client.maximumStorageObjectsToQueue || 50;

/**
 * The Storage Cloud server hostname
 *
 * @name iotcs․oracle․iot․client․storageCloudHost
 * @global
 * @type {String}
 * @default "storage.oraclecloud.com"
 */
lib.oracle.iot.client.storageCloudHost = lib.oracle.iot.client.storageCloudHost || "storage.oraclecloud.com";

/**
 * The Storage Cloud server port
 *
 * @name iotcs․oracle․iot․client․storageCloudPort
 * @global
 * @type {number}
 * @default 443
 */
lib.oracle.iot.client.storageCloudPort = lib.oracle.iot.client.storageCloudPort || 443;

//////////////////////////////////////////////////////////////////////////////

/** @ignore */
lib.oracle.iot.client.controller = lib.oracle.iot.client.controller || {};

/**
 * The maximum time (in milliseconds) the enterprise client
 * will wait for a response from any async request made to
 * a device via the cloud service. These include virtual device
 * attribute updates, actions and also resource invocations.
 *
 * @name iotcs․oracle․iot․client․controller․asyncRequestTimeout
 * @global
 * @type {number}
 * @default 60000
 */
lib.oracle.iot.client.controller.asyncRequestTimeout = lib.oracle.iot.client.controller.asyncRequestTimeout || 60000;

//////////////////////////////////////////////////////////////////////////////

/** @ignore */
lib.oracle.iot.tam = lib.oracle.iot.tam || {};

/**
 * The trusted assets store file path used as global
 * configuration when initializing clients without
 * the trusted assets manager specific parameters.
 * This is required in browser environment.
 *
 * @name iotcs․oracle․iot․tam․store
 * @global
 * @type {string}
 * @default 'trustedAssetsStore.json'
 */
lib.oracle.iot.tam.store = lib.oracle.iot.tam.store || 'trustedAssetsStore.json';

/**
 * The trusted assets store password used as global
 * configuration when initializing clients without
 * the trusted assets manager specific parameters.
 * This is required in browser environment.
 *
 * @name iotcs․oracle․iot․tam․storePassword
 * @global
 * @type {string}
 * @default null
 */
lib.oracle.iot.tam.storePassword = lib.oracle.iot.tam.storePassword || null;

/**
 * Config variable used by the enterprise library only in browser
 * environment to get the iotcs server host and port instead of the
 * trusted assets manager. If this is not set, the default trusted
 * assets manager is used.
 *
 * @name iotcs․oracle․iot․client․serverUrl
 * @global
 * @type {string}
 * @default null
 */
lib.oracle.iot.client.serverUrl = lib.oracle.iot.client.serverUrl || null;

//////////////////////////////////////////////////////////////////////////////

/** @ignore */
lib.oracle.iot.client.test = lib.oracle.iot.client.test || {};

/** @ignore */
lib.oracle.iot.client.test.reqroot = lib.oracle.iot.client.test.reqroot || '/iot/webapi/v2';

/** @ignore */
lib.oracle.iot.client.test.auth = lib.oracle.iot.client.test.auth || {};

/** @ignore */
lib.oracle.iot.client.test.auth.activated = lib.oracle.iot.client.test.auth.activated || false;

/** @ignore */
lib.oracle.iot.client.test.auth.user = lib.oracle.iot.client.test.auth.user || 'iot';

/** @ignore */
lib.oracle.iot.client.test.auth.password = lib.oracle.iot.client.test.auth.password || 'welcome1';

/** @ignore */
lib.oracle.iot.client.test.auth.protocol = lib.oracle.iot.client.test.auth.protocol || 'https';

//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
// file: library/shared/$port-browser.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

/** @ignore */
var $port = lib.$port || {};

if (lib.debug) {
    lib.$port = $port;
}

if (typeof window === 'undefined') {
    lib.error('invalid target platform');
}

var _b2h = (function () {
    var r = [];
    for (var i=0; i<256; i++) {
        r[i] = (i + 0x100).toString(16).substr(1);
    }
    return r;
})();

$port.userAuthNeeded = function () {
    return true;
};

$port.os = {};

$port.os.type = function () {
    return window.navigator.platform;
};

$port.os.release = function () {
    return '0';
};

$port.https = {};

$port.https.csrf = {};
$port.https.csrf.token = null;
$port.https.csrf.inProgress = false;
$port.https.csrf.tokenName = 'X-CSRF-TOKEN';

$port.https.authRequest = {};
$port.https.authRequest.path = '/iot/webapi/v2/private/server';

/*@TODO: Validate with server implementation the user auth*/
$port.https.req = function (options, payload, callback, oracleIoT) {
    ['family', 'localAddress', 'socketPath', 'agent',
     'pfx', 'key', 'passphrase', 'cert', 'ca', 'ciphers', 'rejectUnauthorized',
     'secureProtocol' ]
        .forEach(function (key) {
            if (key in options) {
                //lib.log('this $port.https.req ignores "' + key + '" option');
            }
        });
    if ((options.method === 'GET') && (payload)) {
        lib.log('there should be no payload when using GET method; use "path" for passing query');
    }

    // if this is the first attempt to access IoT-CS
    if ((oracleIoT) && (!$port.https.csrf.token) && (!$port.https.csrf.inProgress)) {
        $port.https.csrf.inProgress = true;
        $port.https.getTokenAndRequest(options, payload, 1, callback);
    } else {
        $port.https.request(options, payload, callback, oracleIoT);
    }
};

/*@TODO: Trial should be used for testing only, not for real POD*/
$port.https.getTokenAndRequest = function (options, payload, trial, callback) {

    var csrfOptions = {
        protocol: options.protocol,
        hostname: options.hostname,
        port: options.port,
        method: 'GET',
        path: (lib.oracle.iot.client.test.auth.activated ? lib.oracle.iot.client.test.reqroot : $impl.reqroot) + '/private/server'
    };

    if (options.headers && options.headers.Authorization) {
        csrfOptions.headers = {};
        csrfOptions.headers.Authorization = options.headers.Authorization;
    }

    $port.https.request(csrfOptions, payload, function (response, error) {
        $port.https.csrf.inProgress = false;
        if (!response || error) {
            callback(response, error);
            return;
        }
        if ((!$port.https.csrf.token) && (trial > 0)) {
            $port.https.getTokenAndRequest(options, payload, --trial, callback);
        } else {
            $port.https.request(options, payload, callback, true);
        }
    }, true);

};

var _authWindow = null;

$port.https.request = function (options, payload, callback, oracleIoT) {
    var baseUrl = (options.protocol || 'https')
        + '://'
        + (options.hostname || options.host || 'localhost')
        + (((options.port) && ((options.protocol === 'https' && options.port !== 443)) ||
                                (options.protocol === 'http' && options.port !== 80)) ? (':' + options.port) : '');

    var url = baseUrl + (options.path || '/');

    var authUrl = baseUrl + $port.https.authRequest.path;

    var _onNotAuth = function (authWindowOpen) {

        if ((!_authWindow || _authWindow.closed) && authWindowOpen) {
            _authWindow = window.open(authUrl, 'auth');
        }

        var authMonitor = null;

        authMonitor = new $impl.Monitor(function () {
            if (authMonitor) {
                authMonitor.stop();
            }
            authMonitor = null;
            $port.https.req(options, payload, callback, oracleIoT);
        });

        authMonitor.start();

    };

    var xhr = new XMLHttpRequest();
    var _onready = function (req) {

        if (req.readyState === 4) {

            if ((req.status === 302) || (req.status === 0)
                || (req.responseUrl && req.responseUrl.length && (decodeURI(req.responseURL) !== url))) {
                _onNotAuth(true);
                return;
            } else {
                if (_authWindow && (!_authWindow.closed)) {
                    _authWindow.close();
                }
            }

            if (req.status === 401) {
                if (!$port.https.csrf.inProgress) {
                    $port.https.csrf.token = null;
                }
                _onNotAuth(false);
                return;
            }

            if ((req.status === 200) || (req.status === 202)) {
                if (xhr.getResponseHeader($port.https.csrf.tokenName) && xhr.getResponseHeader($port.https.csrf.tokenName).length) {
                    $port.https.csrf.token = xhr.getResponseHeader($port.https.csrf.tokenName);
                }
                callback(req.responseText);
            } else {
                callback(null, lib.createError(req.responseText));
            }
        }

    };
    xhr.open(options.method, url, true);
    if (oracleIoT) {
        xhr.withCredentials = true;
        if ($port.https.csrf.token) {
            xhr.setRequestHeader($port.https.csrf.tokenName, $port.https.csrf.token);
        }
    }
    xhr.onreadystatechange = function () {
        _onready(xhr);
    };
    if (options.headers) {
        Object.keys(options.headers).forEach(function (key, index) {
            if ((!oracleIoT) && (key === 'Authorization') && (options.auth)) {
                xhr.setRequestHeader(key, options.auth);
            } else {
                xhr.setRequestHeader(key, options.headers[key]);
            }
        });
    }
    xhr.send(payload || null);

};

$port.file = {};

$port.file.store = function (path, data) {
    localStorage.setItem(path, data);
};

$port.file.exists = function (path) {
    return (localStorage.getItem(path) !== null);
};

$port.file.load = function (path) {
    var data = localStorage.getItem(path);
    if (!data) {
        lib.error('could not load file "'+path+'"');
        return;
    }
    return data;
};

$port.file.append = function (path, data) {
    var original_data = localStorage.getItem(path);
    if (!original_data) {
        lib.error('could not load file "'+path+'"');
        return;
    }                   
    localStorage.setItem(path, original_data + data);
};

$port.file.remove = function (path) {
    localStorage.removeItem(path);
};

$port.util = {};

$port.util.rng = function (count) {
    var a = new Array(count);
    for (var i=0; i<count; i++) {
        a[i] = Math.floor(Math.random()*256);
    }
    return a;
};

$port.util.uuidv4 = function () {
    var r16 = $port.util.rng(16);
    r16[6]  &= 0x0f;  // clear version
    r16[6]  |= 0x40;  // set to version 4
    r16[8]  &= 0x3f;  // clear variant
    r16[8]  |= 0x80;  // set to IETF variant
    var i = 0;
    return _b2h[r16[i++]] + _b2h[r16[i++]] + _b2h[r16[i++]] + _b2h[r16[i++]] + '-' +
        _b2h[r16[i++]] + _b2h[r16[i++]] + '-' +
        _b2h[r16[i++]] + _b2h[r16[i++]] + '-' +
        _b2h[r16[i++]] + _b2h[r16[i++]] + '-' +
        _b2h[r16[i++]] + _b2h[r16[i++]] + _b2h[r16[i++]] +
        _b2h[r16[i++]] + _b2h[r16[i++]] + _b2h[r16[i]];
};

$port.util.btoa = function (str) {
    return btoa(str);
};

$port.util.atob = function (str) {
    return atob(str);
};

$port.util.query = {};

$port.util.query.escape = function (str) {
    return escape(str);
};

$port.util.query.unescape = function (str) {
    return unescape(str);
};

$port.util.query.parse = function (str, sep, eq, options) {
    var _sep = sep || '&';
    var _eq  = eq  || '=';
    var decodeURIComponent = $port.util.query.unescape;
    var obj = {};
    var args = str.split(_sep);
    for (var i=0; i < args.length; i++) {
        var pair = args[i].split(_eq);
        var field = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        if (obj[field]) {
            if (!Array.isArray(obj[field])) {
                var current = obj[field];
                obj[field] = new Array(current);
            }
            obj[field].push(value);
        } else {
            obj[field] = value;
        }
    }
    return obj;
};

$port.util.query.stringify = function (obj, sep, eq, options) {
    var _sep = sep || '&';
    var _eq  = eq  || '=';
    var encodeURIComponent = $port.util.query.escape;
    var str = '';
    Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] === 'object') {
            obj[key].forEach(function (e) {
                str += _sep + key + _eq + encodeURIComponent(e);
            });
        } else {
            str += _sep + key + _eq + encodeURIComponent(obj[key]);
        }
    });
    return str.substring(1);
};

/*@TODO: check that Promise are actually supported! either try/catch or if (!Promise) else lib.error ...
*/
$port.util.promise = function(executor){
    return new Promise(executor);
};


//////////////////////////////////////////////////////////////////////////////
// file: library/shared/$impl.js

/**
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

/** @ignore */
var $impl = {};

if (lib.debug) {
    lib.$impl = $impl;
}

/** @ignore */
$impl.https = $impl.https || {};

function QueueNode (data) {
    this.data = data;
    if (data.getJSONObject !== undefined) {
        this.priority = ['LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'].indexOf(data.getJSONObject().priority);
    } else {
        this.priority = 'LOW';
    }
}

// takes an array of objects with {data, priority}
$impl.PriorityQueue = function (maxQueue) {
    this.heap = [null];
    this.maxQueue = maxQueue;
};

$impl.PriorityQueue.prototype = {
    push: function(data) {
        if (this.heap.length === (this.maxQueue + 1)) {
            lib.error('maximum queue number reached');
            return;
        }
        var node = new QueueNode(data);
        this.bubble(this.heap.push(node) -1);
    },

    remove: function(data) {
        if (this.heap.length === 1) {
            return null;
        }
        var index = this.heap.findIndex(function(element, index) {
            if (element && (element.data.name === data.name) && (element.data.type === data.type)) {
                if (element.data._.internal.inputStream && element.data._.internal.inputStream.path &&
                    element.data._.internal.inputStream.path === data._.internal.inputStream.path ) {
                    return index;
                } else if (element.data._.internal.outputStream && element.data._.internal.outputStream.path &&
                    element.data._.internal.outputStream.path === data._.internal.outputStream.path ) {
                    return index;
                }
            }
        }, data);
        return this.heap.splice(index, 1);
    },

    // removes and returns the data of highest priority
    pop: function() {
        if (this.heap.length === 1) {
            return null;
        }
        if (this.heap.length === 2) {
            var ret = this.heap.pop();
            return ((ret && ret.data) ? ret.data : null);
        }
        var topVal = ((this.heap[1] && this.heap[1].data) ? this.heap[1].data : null);
        this.heap[1] = this.heap.pop();
        this.sink(1); return topVal;
    },

    // bubbles node i up the binary tree based on
    // priority until heap conditions are restored
    bubble: function(i) {
        while (i > 1) {
            var parentIndex = i >> 1; // <=> floor(i/2)

            // if equal, no bubble (maintains insertion order)
            if (!this.isHigherPriority(i, parentIndex)) break;

            this.swap(i, parentIndex);
            i = parentIndex;
        }   },

    // does the opposite of the bubble() function
    sink: function(i) {
        while (i*2 < this.heap.length - 1) {
            // if equal, left bubbles (maintains insertion order)
            var leftHigher = !this.isHigherPriority(i*2 +1, i*2);
            var childIndex = leftHigher ? i*2 : i*2 +1;

            // if equal, sink happens (maintains insertion order)
            if (this.isHigherPriority(i,childIndex)) break;

            this.swap(i, childIndex);
            i = childIndex;
        }   },

    // swaps the addresses of 2 nodes
    swap: function(i,j) {
        var temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    },

    // returns true if node i is higher priority than j
    isHigherPriority: function(i,j) {
        var prioI = ((this.heap[i] && this.heap[i].priority) ? this.heap[i].priority : 0);
        var prioJ = ((this.heap[j] && this.heap[j].priority) ? this.heap[j].priority : 0);
        return prioI < prioJ;
    }
};

//@TODO: Default TAM Integration
/** @ignore */
$impl.https.req = $impl.https.req || function (options, payload, callback) {
    if (!$impl.tam && !(options.tam)) {
        _initTAM(function () {
            _httpsTAMReq(options, payload, callback);
        });
    } else {
        _httpsTAMReq(options, payload, callback);
    }
};

function _initTAM (callback) {
    if ((typeof window !== 'undefined') && lib.oracle.iot.client.serverUrl
        && (typeof lib.oracle.iot.client.serverUrl === 'string')
        && (typeof forge.util.parseUrl(lib.oracle.iot.client.serverUrl) === 'object')) {
        var parsed = forge.util.parseUrl(lib.oracle.iot.client.serverUrl);
        $impl.tam = {
            getServerHost: function () {
                return parsed.host;
            },
            getServerPort: function () {
                return parsed.port;
            }
        };
        callback();
    } else if (lib.oracle.iot.tam.store && (typeof window !== 'undefined') && location.hostname && location.protocol) {
        var i = location.protocol.indexOf(':');
        var protocol = (i<0) ? location.protocol : location.protocol.substring(0, i);
        $port.https.req({
            method: 'GET',
            path: lib.oracle.iot.tam.store,
            protocol: protocol,
            hostname: location.hostname,
            port: location.port
        }, '', function(response) {
            $port.file.store(lib.oracle.iot.tam.store, response);
            $impl.tam = new lib.enterprise.TrustedAssetsManager();
            callback();
        }, false);
    } else {
        $impl.tam = (lib.enterprise ? new lib.enterprise.TrustedAssetsManager() : new lib.device.TrustedAssetsManager());
        callback();
    }
}

/** @ignore */
function _httpsTAMReq (options, payload, callback) {

    var basePath = null;
    var testPath = null;

    if (options.path.indexOf($impl.reqroot) > -1) {
        basePath = $impl.reqroot;
        testPath = (lib.oracle.iot.client.test ? lib.oracle.iot.client.test.reqroot : null);
    } else if (lib.oracle.iot.client.test && (options.path.indexOf(lib.oracle.iot.client.test.reqroot) > -1)) {
        basePath = lib.oracle.iot.client.test.reqroot;
    }

    // @TODO: Better way of handling links
    if(options.path && ((options.path.indexOf('http:') === 0) || (options.path.indexOf('https:') === 0))){
        options.path = options.path.substring(options.path.indexOf(basePath));
    }

    var _opt = {};
    var oracleIoT = true;
    if (!(options.tam)) {
        options.tam = $impl.tam;
    }
    if (options.tam) {
        _opt.protocol = 'https';
        _opt.hostname = options.tam.getServerHost();
        _opt.port = options.tam.getServerPort();
    } else if (typeof location !== 'undefined') {
        if (location.protocol) {
            var i = location.protocol.indexOf(':');
            _opt.protocol = (i<0) ? location.protocol : location.protocol.substring(0, i);
        }
        if (location.hostname) {
            _opt.hostname = location.hostname;
        }
        if (location.port) {
            _opt.port = location.port;
        }
        oracleIoT = false;
    }

    _opt.headers = {};
    _opt.headers.Accept = 'application/json';
    _opt.headers['Content-Type'] = 'application/json';

    //@TODO: Remove basic auth; only for tests and test server
    //@TODO: (jy) use lib.debug if this configuration is really/always needed for tests ...
    if (lib.oracle.iot.client.test && lib.oracle.iot.client.test.auth.activated) {
        _opt.protocol = lib.oracle.iot.client.test.auth.protocol;
        _opt.headers.Authorization = 'Basic ' + $port.util.btoa(lib.oracle.iot.client.test.auth.user + ':' + lib.oracle.iot.client.test.auth.password);
        if (testPath) {
            options.path = options.path.replace(basePath, testPath);
        }
    }

    for (var key in options) {
        if (key === 'headers') {
            for (var header in options.headers) {
                if (options.headers[header] === null) {
                    delete _opt.headers[header];
                } else {
                    _opt.headers[header] = options.headers[header];
                }
            }
        } else {
            _opt[key] = options[key];
        }
    }

    $port.https.req(_opt, payload, function(response_body, error) {
        if (!response_body || error) {
            callback(null, error);
            return;
        }
        var response_json = null;
        try {
            response_json = JSON.parse(response_body);
        } catch (e) {

        }
        if (!response_json || (typeof response_json !== 'object')) {
            callback(null, lib.createError('response not JSON'));
            return;
        }
        callback(response_json);
    }, oracleIoT);
}


//////////////////////////////////////////////////////////////////////////////

/** @ignore */
function _mandatoryArg(arg, types) {
    if (!arg) {
        lib.error('missing argument');
        return;
    }
    __checkType(arg, types);
}

/** @ignore */
function _optionalArg(arg, types) {
    if (!arg) {
        return;
    }
    __checkType(arg, types);
}

/** @ignore */
//@TODO: [v2] (?) increase check on 'number' with parseInt()!==NaN ?? 
//@TODO: [v2] add support for {'array':'type'}
function __isArgOfType(arg, type) {
    switch(typeof(type)) {
        case 'function':
        case 'object':
            return (arg instanceof type);
        case 'string':
            return (type==='array')
                ? Array.isArray(arg)
                : (typeof(arg) === type);
        default:
    }
    return false;
}

/** @ignore */
function __checkType(arg, types) {
    var argType = typeof(arg);
    if (Array.isArray(types)) {
        var nomatch = types.every(function(type) { return !__isArgOfType(arg, type); });
        if (nomatch) {
            lib.log('type mismatch: got '+argType+' but expecting any of '+types.toString()+')');
            lib.error('illegal argument type');
            return;
        }
        return;
    }
    if (!__isArgOfType(arg, types)) {
        lib.log('type mismatch: got '+argType+' but expecting '+types+')');
        lib.error('illegal argument type');
        return;
    }
}

/** @ignore */
function _isEmpty(obj) {
    if (obj === null || (typeof obj === 'undefined')) return true;
    return (Object.getOwnPropertyNames(obj).length === 0);
}

/** @ignore */
function _isStorageCloudURI(url) {
    var urlObj = require('url').parse(url, true);
    return (urlObj.host.indexOf(lib.oracle.iot.client.storageCloudHost) > -1);
}


//////////////////////////////////////////////////////////////////////////////
// file: library/shared/Client.js

/**
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

//@TODO: add and validate this.tam = new $impl.TrustedAssetsManager();

/**
 * Client of the Oracle IoT Cloud Service. A client is a
 * directly-connected device, a gateway, or an enterprise
 * application.
 *
 * @class
 */
lib.Client = function () {
    this.cache = this.cache || {};
    this.cache.deviceModels = {};
};

/**
 * Create an AbstractVirtualDevice instance with the given device model
 * for the given device identifier. This method creates a new
 * AbstractVirtualDevice instance for the given parameters. The client
 * library does not cache previously created AbstractVirtualDevice
 * objects.
 * <p>
 * A device model can be obtained by it's afferent urn with the
 * Client if it is registered on the cloud.
 *
 * @see {@link iotcs.Client#getDeviceModel}
 * @param {string} endpointId - The endpoint identifier of the
 * device being modeled. 
 * @param {object} deviceModel - The device model object
 * holding the full description of that device model that this
 * device implements. 
 * @returns {iotcs.AbstractVirtualDevice} The newly created virtual device
 *
 * @memberof iotcs.Client.prototype
 * @function createVirtualDevice
 */
lib.Client.prototype.createVirtualDevice = function (endpointId, deviceModel) {
    _mandatoryArg(endpointId, 'string');
    _mandatoryArg(deviceModel, 'object');
    return new lib.AbstractVirtualDevice(endpointId, deviceModel);
};

/**
 * Get the device model for the urn.
 *
 * @param {string} deviceModelUrn - The URN of the device model
 * @param {function} callback - The callback function. This
 * function is called with the following argument: a
 * deviceModel object holding full description e.g. <code>{ name:"",
 * description:"", fields:[...], created:date,
 * isProtected:boolean, lastModified:date ... }</code>.
 * If an error occurs the deviceModel object is null
 * and an error object is passed: callback(deviceModel, error) and
 * the reason can be taken from error.message
 *
 * @memberof iotcs.Client.prototype
 * @function getDeviceModel
 */
lib.Client.prototype.getDeviceModel = function (deviceModelUrn, callback) {
    _mandatoryArg(deviceModelUrn, 'string');
    _mandatoryArg(callback, 'function');
    var deviceModel = this.cache.deviceModels[deviceModelUrn];
    if (deviceModel) {
        callback(deviceModel);
        return;
    }
    var self = this;
    $impl.https.bearerReq({
        method: 'GET',
        path:   $impl.reqroot
            + '/deviceModels/' + deviceModelUrn
    }, '', function (response, error) {
        if(!response || error || !(response.urn)){
            callback(null, lib.createError('invalid response on get device model', error));
            return;
        }
        var deviceModel = response;
        Object.freeze(deviceModel);
        self.cache.deviceModels[deviceModelUrn] = deviceModel;
        callback(deviceModel);
    }, function () {
        self.getDeviceModel(deviceModelUrn, callback);
    }, (lib.$port.userAuthNeeded() ? null : (lib.$impl.DirectlyConnectedDevice ? new lib.$impl.DirectlyConnectedDevice() : new lib.$impl.EnterpriseClientImpl())));
};

/**
 * Create a new {@link iotcs.device.StorageObject} with the given object name and mime&ndash;type.
 *
 * @param {String} name - the unique name to be used to reference the content in storage
 * @param {String} type - The mime-type of the content.
 * If not set, the mime&ndash;type defaults to {@link lib.device.StorageObject.MIME_TYPE}
 * @returns {iotcs.device.StorageObject} a storage object
 *
 * @memberof iotcs.Client.prototype
 * @function createStorageObject
 */
lib.Client.prototype.createStorageObject = function (name, type) {
    _mandatoryArg(name, "string");
    _optionalArg(type, "string");
    var storage = new lib.device.StorageObject(null, name, type);
    storage._.setDevice(this._.internalDev);
    return storage;
};


//////////////////////////////////////////////////////////////////////////////
// file: library/shared/Monitor.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

//@TODO: a little more JSDOC is needed; explain the (simple) state machine and e.g. when the monitor thread is actually started, whether start and stop can be called multiple time; the default frequency ...etc...

/**
 * @param {function()} callback - function associated to this monitor
 * @class
 */
/** @ignore */
$impl.Monitor = function (callback) {
    _mandatoryArg(callback, 'function');
    this.running = false;
    this.callback = callback;
};

//@TODO: a little more JSDOC is needed

/**
 * @memberof iotcs.util.Monitor.prototype
 * @function start
 */
$impl.Monitor.prototype.start = function () {
    if (this.running) {
        return;
    }
    this.running = true;
    var self = this;
    this.monitorid = _register(this.callback);
};

//@TODO: a little more JSDOC is needed

/**
 * @memberof iotcs.util.Monitor.prototype
 * @function stop
 */
$impl.Monitor.prototype.stop = function () {
    if (!this.running) {
        return;
    }
    this.running = false;
    _unregister(this.monitorid);
};

//////////////////////////////////////////////////////////////////////////////

/** @ignore */
var monitors = {};

/** @ignore */
var index = 0;

/** @ignore */
var threadid = null;

/** @ignore */
function _caroussel() {
    Object.keys(monitors).forEach(function (id) {
        if (typeof monitors[id] === 'function') {
            monitors[id]();
        }
    });
}

/** @ignore */
function _register(callback) {
    monitors[++index] = callback;
    if (Object.keys(monitors).length === 1) {
        // if at least one registered monitor, then start thread
        if (threadid) {
            lib.log('inconsistent state: monitor thread already started!');
            return;
        }
        threadid = setInterval(_caroussel, lib.oracle.iot.client.monitor.pollingInterval);
    }
    return index;
}

/** @ignore */
function _unregister(id) {
    if ((typeof id === 'undefined') || !monitors[id]) {
        lib.log('unknown monitor id');
        return;
    }
    delete monitors[id];
    if (Object.keys(monitors).length === 0) {
        // if no registered monitor left, then stop thread
        if (!threadid) {
            lib.log('inconsistent state: monitor thread already stopped!');
            return;
        }
        clearInterval(threadid);
        threadid = null;
    }
}


//////////////////////////////////////////////////////////////////////////////
// file: library/shared/AbstractVirtualDevice.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

//@TODO: is AbstractVirtualDevice supposed to be a public/visible class ? if not, could be moved to $impl @DONE: it is public in JavaSE

/**
 * AbstractVirtualDevice is a representation of a device model
 * implemented by an endpoint. A device model is a
 * specification of the attributes, formats, and resources
 * available on the endpoint. 
 * <p>
 * The AbstractVirtualDevice API is identical for both the enterprise
 * client and the device client. The semantics of the API are
 * also the same. The processing model on the enterprise
 * client is different, however, from the processing model on
 * the device client. 
 * <p>
 * A device model can be obtained by it's afferent urn with the
 * Client if it is registered on the cloud.
 * <p>
 * An AbstractVirtualDevice can also be created with the appropriate
 * parameters from the Client.
 *
 * @see {@link iotcs.Client#getDeviceModel}
 * @see {@link iotcs.Client#createVirtualDevice}
 * @param {string} endpointId - The endpoint id of this device
 * @param {object} deviceModel - The device model object
 * holding the full description of that device model that this
 * device implements.
 * @class
 */
lib.AbstractVirtualDevice = function (endpointId, deviceModel) {
    _mandatoryArg(endpointId, 'string');
    _mandatoryArg(deviceModel, 'object');

    this.endpointId = endpointId;
    this.model = deviceModel;

    Object.defineProperty(this, '_', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: {}
    });

    Object.defineProperty(this, 'onChange', {
        enumerable: true,
        configurable: false,
        get: function () {
            return this._.onChange;
        },
        set: function (newValue) {
            if (!newValue || (typeof newValue !== 'function')) {
                lib.error('trying to set something to onChange that is not a function!');
                return;
            }
            this._.onChange = newValue;
        }
    });
    this._.onChange = null;

    Object.defineProperty(this, 'onError', {
        enumerable: true,
        configurable: false,
        get: function () {
            return this._.onError;
        },
        set: function (newValue) {
            if (!newValue || (typeof newValue !== 'function')) {
                lib.error('trying to set something to onError that is not a function!');
                return;
            }
            this._.onError = newValue;
        }
    });
    this._.onError = null;
};

/**
 * Get the device model of this device object. This is the exact model
 * that was used at construction of the device object.
 *
 * @returns {Object} the object representing the device model for this
 * device
 *
 * @memberof iotcs.AbstractVirtualDevice.prototype
 * @function getDeviceModel
 */
lib.AbstractVirtualDevice.prototype.getDeviceModel = function () {
    return this.model;
};

/**
 * Get the endpoint id of the device.
 *
 * @returns {string} The endpoint id of this device as given at construction
 * of the virtual device
 *
 * @memberof iotcs.AbstractVirtualDevice.prototype
 * @function getEndpointId
 */
lib.AbstractVirtualDevice.prototype.getEndpointId = function () {
    return this.endpointId;
};

//@TODO: accessing directly a very internal object is not clean: e.g. "this.attributes[attribute]._."

/**
 * The update call allows more than one value to be set on
 * this Device object and in the end, it is sending the values
 * to the server.
 * <p>
 * The values are sent to the server when the method is
 * called, which also marks the end of the update
 * transaction.
 * <p>
 * For example <code>device.update({"min":10, "max":20});</code>
 * <p>
 * If the virtual device has the onError property set with a callback
 * method or any/all of the attributes given in the update call
 * have the onError attribute set with a callback method, in case
 * of error on update the callbacks will be called with related attribute
 * information. See VirtualDevice description for more info on onError.
 *
 * @param {Object} attributes - An object holding a list of attribute name/
 * value pairs to be updated as part of this transaction,
 * e.g. <code>{ "temperature":23, ... }</code>. Note that keys shall refer
 * to device attribute names.
 *
 * @see {@link iotcs.enterprise.VirtualDevice}
 * @memberof iotcs.AbstractVirtualDevice.prototype
 * @function update
 */
lib.AbstractVirtualDevice.prototype.update = function (attributes) {

};

/**
 * Close this virtual device and all afferent resources used
 * for monitoring or controlling the device.
 *
 * @memberof iotcs.AbstractVirtualDevice.prototype
 * @function close
 */
lib.AbstractVirtualDevice.prototype.close = function () {
    this.endpointId = null;
    this.model = null;
    this.onChange = function (arg) {};
    this.onError = function (arg) {};
};

//////////////////////////////////////////////////////////////////////////////

/** @ignore */
function _link(name, device, element) {
    _mandatoryArg(name, 'string');
    _mandatoryArg(device, 'object'); //@TODO: should be checked against instance name
    _mandatoryArg(element, 'object');
    if (device[name]) {
        return;
    }
    Object.defineProperty(device, name, {
        enumerable: true,
        configurable: false,
        writable: false,
        value: element
    });
    Object.defineProperty(element, 'device', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: device
    });
}


//////////////////////////////////////////////////////////////////////////////
// file: library/shared/UnifiedTrustStore.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

/**
 * This class provides an implementation of the trusted assets format
 * as values of the tag-length-value form in a Base64 encoded AES encrypted
 * file.
 * <p>
 * Unified client provisioning format:
 * <p>
 * format = version & blob & *comment<br>
 * version = 1 byte, value 33<br>
 * blob = MIME base64 of encrypted & new line<br>
 * encrypted = IV & AES-128/CBC/PKCS5Padding of values<br>
 * IV = 16 random bytes<br>
 * values = *TLV<br>
 * TLV = tag & length & value<br>
 * tag = byte<br>
 * length = 2 byte BE unsigned int<br>
 * value = length bytes<br>
 * comment = # & string & : & string & new line<br>
 * string = UTF-8 chars<br>
 * <p>
 * The password based encryption key is the password processed by 10000
 * interations of PBKDF2WithHmacSHA1 with the IV as the salt.
 * <p>
 * This class is internally used by the trusted assets store managers
 * to read/write files in the unified format
 *
 * @class
 * @memberOf iotcs
 * @alias UnifiedTrustStore
 *
 */
lib.UnifiedTrustStore = function (taStoreFileExt, taStorePasswordExt, forProvisioning) {

    this.trustStoreValues = {
        clientId: null,
        sharedSecret: null,
        serverHost: null,
        serverPort: null,
        endpointId: null,
        serverScheme: null,
        privateKey: null,
        publicKey: null,
        trustAnchors: null,
        certificate: null,
        connectedDevices: null
    };
    this.userInfo = "#";

    var taStoreFile = taStoreFileExt || lib.oracle.iot.tam.store;
    var taStorePassword = taStorePasswordExt || lib.oracle.iot.tam.storePassword;

    if (!taStoreFile) {
        lib.error('No TA Store file defined');
        return;
    }
    if (!taStorePassword) {
        lib.error('No TA Store password defined');
        return;
    }

    var self = this;

    this.load = function () {
        var input = $port.file.load(taStoreFile);
        if (input.charCodeAt(0) != lib.UnifiedTrustStore.constants.version) {
            lib.error('Invalid unified trust store version');
            return;
        }
        var base64BlockStr = input.substring(1, input.indexOf('#'));
        this.userInfo = input.substring(input.indexOf('#')) || this.userInfo;
        var encryptedData = forge.util.decode64(base64BlockStr);
        if (encryptedData.length <= 0) {
            lib.error('Invalid unified trust store');
            return;
        }
        var iv = forge.util.createBuffer();
        var encrypted = forge.util.createBuffer();
        for (var i = 0; i < lib.UnifiedTrustStore.constants.AES_BLOCK_SIZE; i++) {
            iv.putInt(encryptedData.charCodeAt(i), 8);
        }
        iv = iv.getBytes();
        for (i = lib.UnifiedTrustStore.constants.AES_BLOCK_SIZE; i < encryptedData.length; i++) {
            encrypted.putInt(encryptedData.charCodeAt(i), 8);
        }
        var key = forge.pkcs5.pbkdf2(taStorePassword, iv, lib.UnifiedTrustStore.constants.PBKDF2_ITERATIONS, lib.UnifiedTrustStore.constants.AES_KEY_SIZE);
        var decipher = forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({iv: iv});
        decipher.update(encrypted);
        decipher.finish();
        var output = decipher.output;
        while (!output.isEmpty()) {
            var tag = output.getInt(8);
            var length = (output.getInt(16) >> 0);
            var buf = output.getBytes(length);
            switch (tag) {
                case lib.UnifiedTrustStore.constants.TAGS.serverUri:
                    var urlObj = forge.util.parseUrl(buf);
                    self.trustStoreValues.serverHost = urlObj.host;
                    self.trustStoreValues.serverPort = urlObj.port;
                    self.trustStoreValues.serverScheme = urlObj.scheme;
                    break;

                case lib.UnifiedTrustStore.constants.TAGS.clientId:
                    self.trustStoreValues.clientId = buf;
                    break;

                case lib.UnifiedTrustStore.constants.TAGS.sharedSecret:
                    self.trustStoreValues.sharedSecret = buf;
                    break;

                case lib.UnifiedTrustStore.constants.TAGS.endpointId:
                    self.trustStoreValues.endpointId = buf;
                    break;

                case lib.UnifiedTrustStore.constants.TAGS.trustAnchor:
                    if (!self.trustStoreValues.trustAnchors) {
                        self.trustStoreValues.trustAnchors = [];
                    }
                    self.trustStoreValues.trustAnchors.push(forge.pki.certificateToPem(forge.pki.certificateFromAsn1(forge.asn1.fromDer(buf))));
                    break;

                case lib.UnifiedTrustStore.constants.TAGS.privateKey:
                    self.trustStoreValues.privateKey = forge.pki.privateKeyFromAsn1(forge.asn1.fromDer(buf));
                    break;

                case lib.UnifiedTrustStore.constants.TAGS.publicKey:
                    self.trustStoreValues.publicKey = forge.pki.publicKeyFromAsn1(forge.asn1.fromDer(buf));
                    break;

                case lib.UnifiedTrustStore.constants.TAGS.connectedDevice:
                    if (!self.trustStoreValues.connectedDevices) {
                        self.trustStoreValues.connectedDevices = {};
                    }
                    var _data = { error: false };
                    var _output = new forge.util.ByteStringBuffer().putBytes(buf);
                    connectedDevice_loop:
                    while (!_output.isEmpty()) {
                        var _tag = _output.getInt(8);
                        var _length = (_output.getInt(16) >> 0);
                        var _buf = _output.getBytes(_length);
                        switch (_tag) {
                            case lib.UnifiedTrustStore.constants.TAGS.clientId:
                                _data.deviceId = _buf;
                                break;

                            case lib.UnifiedTrustStore.constants.TAGS.sharedSecret:
                                _data.sharedSecret = _buf;
                                break;

                            default:
                                lib.error("Invalid TAG inside indirect connected device data.");
                                _data.error = true;
                                break connectedDevice_loop;
                        }
                    }
                    if (!_data.error && _data.deviceId && _data.sharedSecret) {
                        self.trustStoreValues.connectedDevices[_data.deviceId] = _data.sharedSecret;
                    }
                    break;

                default:
                    lib.error('Invalid unified trust store TAG');
                    return;
            }
        }
    };

    this.store = function (values) {
        if (values) {
            Object.keys(values).forEach(function (key) {
                self.trustStoreValues[key] = values[key];
            });
        }
        var buffer = forge.util.createBuffer();
        var serverUri = self.trustStoreValues.serverScheme + '://' + self.trustStoreValues.serverHost + ':' + self.trustStoreValues.serverPort;
        buffer.putInt(lib.UnifiedTrustStore.constants.TAGS.serverUri, 8);
        buffer.putInt(serverUri.length, 16);
        buffer.putBytes(serverUri);
        buffer.putInt(lib.UnifiedTrustStore.constants.TAGS.clientId, 8);
        buffer.putInt(self.trustStoreValues.clientId.length, 16);
        buffer.putBytes(self.trustStoreValues.clientId);
        buffer.putInt(lib.UnifiedTrustStore.constants.TAGS.sharedSecret, 8);
        buffer.putInt(self.trustStoreValues.sharedSecret.length, 16);
        buffer.putBytes(self.trustStoreValues.sharedSecret);
        if (self.trustStoreValues.endpointId) {
            buffer.putInt(lib.UnifiedTrustStore.constants.TAGS.endpointId, 8);
            buffer.putInt(self.trustStoreValues.endpointId.length, 16);
            buffer.putBytes(self.trustStoreValues.endpointId);
        }
        if (Array.isArray(self.trustStoreValues.trustAnchors)) {
            self.trustStoreValues.trustAnchors.forEach(function (trustAnchor) {
                var trust = forge.asn1.toDer(forge.pki.certificateToAsn1(forge.pki.certificateFromPem(trustAnchor))).getBytes();
                buffer.putInt(lib.UnifiedTrustStore.constants.TAGS.trustAnchor, 8);
                buffer.putInt(trust.length, 16);
                buffer.putBytes(trust);
            });
        }
        if (self.trustStoreValues.privateKey) {
            buffer.putInt(lib.UnifiedTrustStore.constants.TAGS.privateKey, 8);
            var tempBytes = forge.asn1.toDer(forge.pki.wrapRsaPrivateKey(forge.pki.privateKeyToAsn1(self.trustStoreValues.privateKey))).getBytes();
            buffer.putInt(tempBytes.length, 16);
            buffer.putBytes(tempBytes);
        }
        if (self.trustStoreValues.publicKey) {
            buffer.putInt(lib.UnifiedTrustStore.constants.TAGS.publicKey, 8);
            var tempBytes1 = forge.asn1.toDer(forge.pki.publicKeyToAsn1(self.trustStoreValues.publicKey)).getBytes();
            buffer.putInt(tempBytes1.length, 16);
            buffer.putBytes(tempBytes1);
        }
        if (self.trustStoreValues.connectedDevices) {
            for (var deviceId in self.trustStoreValues.connectedDevices) {
                buffer.putInt(lib.UnifiedTrustStore.constants.TAGS.connectedDevice, 8);
                // deviceId.length + sharedSecret.length + 6
                // where 6 bytes contains [ACTIVATION_ID_TAG|<icd activation id length> and [SHARED_SECRET_TAG|<icd shared secret length>
                buffer.putInt(deviceId.length + self.trustStoreValues.connectedDevices[deviceId].length + 6, 16);
                buffer.putInt(lib.UnifiedTrustStore.constants.TAGS.clientId, 8);
                buffer.putInt(deviceId.length, 16);
                buffer.putBytes(deviceId);
                buffer.putInt(lib.UnifiedTrustStore.constants.TAGS.sharedSecret, 8);
                buffer.putInt(self.trustStoreValues.connectedDevices[deviceId].length, 16);
                buffer.putBytes(self.trustStoreValues.connectedDevices[deviceId]);
            }
        }
        var iv = forge.random.getBytesSync(lib.UnifiedTrustStore.constants.AES_BLOCK_SIZE);
        var key = forge.pkcs5.pbkdf2(taStorePassword, iv, lib.UnifiedTrustStore.constants.PBKDF2_ITERATIONS, lib.UnifiedTrustStore.constants.AES_KEY_SIZE);
        var cipher = forge.cipher.createCipher('AES-CBC', key);
        cipher.start({iv: iv});
        cipher.update(buffer);
        cipher.finish();
        var finalBuffer = forge.util.createBuffer();
        finalBuffer.putInt(lib.UnifiedTrustStore.constants.version, 8);
        finalBuffer.putBytes(forge.util.encode64(iv+cipher.output.getBytes()));
        finalBuffer.putBytes("\n" + this.userInfo);
        $port.file.store(taStoreFile, finalBuffer.getBytes());
    };

    this.setValues = function (otherManager) {
        Object.keys(otherManager).forEach(function (key) {
            if (self.trustStoreValues[key]) {
                otherManager[key] = self.trustStoreValues[key];
            }
        });
    };

    this.update = function (otherManager) {
        Object.keys(otherManager).forEach(function (key) {
            if (otherManager[key] && (typeof self.trustStoreValues[key] !== 'undefined')) {
                self.trustStoreValues[key] = otherManager[key];
            }
        });
        self.store();
    };

    if (!forProvisioning) {
        this.load();
    }

};

/**
 * Enumeration of unified trust store format constants
 *
 * @memberOf iotcs.UnifiedTrustStore
 * @alias constants
 * @class
 * @readonly
 * @enum {Integer}
 */
lib.UnifiedTrustStore.constants = {
    version: 33,
    AES_BLOCK_SIZE: 16,
    AES_KEY_SIZE: 16,
    PBKDF2_ITERATIONS: 10000,
    TAGS: {}
};

lib.UnifiedTrustStore.constants.TAGS = {
    /**
     * The URI of the server, e.g., https://iotinst-mydomain.iot.us.oraclecloud.com:443
     */
    serverUri: 1,
    /** A client id is either an integration id (for enterprise clients), or an
     * activation id (for device clients). An activation id may also be
     * referred to a hardware id.
     */
    clientId: 2,
    /**
     * The shared secret as plain text
     */
    sharedSecret: 3,
    /**
     * For devices, the endpoint id TLV is omitted from the provisioning file
     * (unless part of a CONNECTED_DEVICE_TAG TLV).
     * For enterpise integrations, the endpoint id is set in the provisioning file
     * by the inclusion of the second ID argument.
     */
    endpointId: 4,
    /**
     * The trust anchor is the X509 cert
     */
    trustAnchor: 5,
    privateKey: 6,
    publicKey: 7,
    /**
     * The client id and shared secret of a device that can connect
     * indirectly through the device client
     *
     * Connected device TLV =
     * [CONNECTED_DEVICE_TAG|<length>|[CLIENT_ID_TAG|<icd activation id length>|<icd activation id>][SHARED_SECRET_TAG|<icd shared secrect length>|<icd shared secret>]]
     */
    connectedDevice: 8
};


/**
 * This is a helper method for provisioning files used by
 * the trusted assets store managers in the unified trust
 * store format.
 *
 * @param {string} taStoreFile - the Trusted Assets Store file name.
 * @param {string} taStorePassword - the Trusted Assets Store password.
 * @param {string} serverScheme - the scheme used to communicate with the server. Possible values are http(s) or mqtt(s).
 * @param {string} serverHost - the IoT CS server host name.
 * @param {number} serverPort - the IoT CS server port.
 * @param {string} clientId - activation ID for devices or client ID for application integrations.
 * @param {string} sharedSecret - the client's shared secret.
 * @param {string} truststore - the truststore file containing PEM-encoded trust anchors certificates to be used to validate the IoT CS server
 * certificate chain.
 * @param {string} connectedDevices - array of indirect connect devices.
 *
 * @memberOf iotcs.UnifiedTrustStore
 * @function provision
 */
lib.UnifiedTrustStore.provision = function (taStoreFile, taStorePassword, serverScheme, serverHost, serverPort, clientId, sharedSecret, truststore, connectedDevices) {
    if (!taStoreFile) {
        throw 'No TA Store file provided';
    }
    if (!taStorePassword) {
        throw 'No TA Store password provided';
    }
    var entries = {
        clientId: clientId,
        serverHost: serverHost,
        serverPort: serverPort,
        serverScheme: (serverScheme ? serverScheme : 'https'),
        sharedSecret: sharedSecret,
        trustAnchors: (truststore ? (Array.isArray(truststore) ? truststore : _loadTrustAnchorsBinary(truststore)) : []),
        connectedDevices: (connectedDevices ? connectedDevices : {})
    };
    new lib.UnifiedTrustStore(taStoreFile, taStorePassword, true).store(entries);
};

/** @ignore */
function _loadTrustAnchorsBinary (truststore) {
    return $port.file.load(truststore)
        .split(/\-{5}(?:B|E)(?:[A-Z]*) CERTIFICATE\-{5}/)
        .filter(function(elem) { return ((elem.length > 1) && (elem.indexOf('M') > -1)); })
        .map(function(elem) { return '-----BEGIN CERTIFICATE-----' + elem.replace(new RegExp('\r\n', 'g'),'\n') + '-----END CERTIFICATE-----'; });
}


//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/$impl-ecl.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

//General TODOs:

//@TODO: all $impl.https.req(...,...,(function(response){ /*HERE*/})); do not handle error cases consistently: some are lib.error(), while others are callback(null) @DONE
//@TODO: all conditions should be defensively parenthesized e.g. "if (a==b && !c && d)" => if ((a==b) && (!c) && (d))"
//@TODO: there should be more lib.oracle.iot.XXX.defaultLimit and every Pageable instanciation should use its own explicitly for maximum configurability: e.g. "new lib.enterprise.Pageable({},,,lib.oracle.iot.XXX.defaultLimit);"

//@TODO: code as flat as possible: e.g. instead of if(ok) { } => use if(!ok) {error | return ...} ... } @DONE
//@TODO: error message case should be consistent: all lowercase or w first letter Uppercase ...etc... @DONE
//@TODO: if/while/catch/... are not functions e.g. conventionally "if(XX)" should be "if (X)"
//@TODO: "function(" => "function ("
//@TODO: "){" => ") {"
//@TODO: "}\nelse {\n" => "} else {\n"

//@TODO: we probably need a few global (lib-private) functions to do advanced parameter value checking (e.g. check that appid has no "/" (or %XX equivalent ...etc...) ... this depends on needs from other classes/functions...
//@TODO: lib.error() is currently not satisfactory; related: callbacks (especially not in timeout/intervals) should not throw any exceptions ...etc...


//@TODO (last) align DCL to ECL for all sibling definitions (use winmerge ...)

//////////////////////////////////////////////////////////////////////////////

//@TODO: should probably be /iot/webapi/v2
//@TODO: should probably be moved to "lib.oracle.iot.server.pathroot" => @globals.js
/** @ignore */
$impl.reqroot = '/iot/webapi/v2';

$impl.https.bearerReq = function (options, payload, callback, retryCallback, client) {

    if (client && client._.tam && client._.tam.getClientId()) {
        options.path = options.path.replace('webapi','api');
        if (!options.headers) {
            options.headers = {};
        }
        options.headers.Authorization = client._.bearer;
        options.headers['X-EndpointId'] = client._.tam.getClientId();
        options.tam = client._.tam;
        $impl.https.req(options, payload, function (response_body, error) {
            if (error) {
                var exception = null;
                try {
                    exception = JSON.parse(error.message);
                    if (exception.statusCode && (exception.statusCode === 401)) {
                        client._.refresh_bearer(function (error) {
                            if (error) {
                                callback(response_body, error);
                                return;
                            }
                            retryCallback();
                        });
                        return;
                    }
                } catch (e) {

                }
            }
            callback(response_body, error);
        });
    } else {
        $impl.https.req(options, payload, callback);
    }

};


//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/Action.js

/**
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

//@TODO: missing JSDOC

/**
 * @class
 */
/** @ignore */
$impl.Action = function (actionSpec) {
    _mandatoryArg(actionSpec, 'object');

    if (!actionSpec.name) {
        lib.error('attribute specification in device model is incomplete');
        return;
    }

    var spec = {
        name: actionSpec.name,
        description: (actionSpec.description || ''),
        argType: (actionSpec.argType || null),
        alias: (actionSpec.alias || null),
        range: (actionSpec.range ? _parseRange(actionSpec.argType, actionSpec.range) : null)
    };

    /** @private */
    Object.defineProperty(this, '_', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: {}
    });

    // public members

    /**
     * @memberof iotcs.Action
     * @member {string} name - the name of this action
     */
    Object.defineProperty(this, 'name', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.name
    });

    /**
     * @memberof iotcs.Action
     * @member {string} description - the description of this action
     */
    Object.defineProperty(this, 'description', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.description
    });

    /**
     * @memberof iotcs.Action
     * @member {function(Object)} onExecute - the action to perform when the response to an execute() is
     * received from the other party
     */
    Object.defineProperty(this, 'onExecute', {
        enumerable: false,
        configurable: false,
        get: function () {
            return this._.onExecute;
        },
        set: function (newValue) {
            if (!newValue || (typeof newValue !== 'function')) {
                lib.error('trying to set something to onExecute that is not a function!');
                return;
            }
            this._.onExecute = newValue;
        }
    });
    this._.onExecute = function (arg) {};

    /** @private */
    this.checkAndGetVarArg = function (arg) {
        if (!spec.argType) {
            if (typeof arg !== 'undefined') {
                lib.error('invalid number of arguments');
                return null;
            }
        } else {
            if (typeof arg === 'undefined') {
                lib.error('invalid number of arguments');
                return null;
            }

            if (spec.argType === 'URI') {
                if (arg instanceof lib.ExternalObject) {
                    arg = arg.getURI();
                } else if (typeof arg === 'string') {
                    // nothing to do
                } else {
                    lib.error('invalid URI parameter');
                    return null;
                }
            }

            if (!_matchType(spec.argType, arg)) {
                lib.error('type mismatch; action "'+spec.name+'" requires arg type [' + spec.argType + ']');
                return null;
            }
            if (spec.range && ((arg<spec.range.low) || (arg>spec.range.high))) {
                lib.error('trying to use an argument which is out of range ['+spec.range.low+' - '+spec.range.high+']');
                return null;
            }
        }
        return arg;
    };
};


//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/Alert.js

/**
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

//@TODO: missing JSDOC

/**
 * @class
 */
/** @ignore */
$impl.Alert = function (alertSpec) {
    _mandatoryArg(alertSpec, 'object');

    if (!alertSpec.urn) {
        lib.error('alert specification in device model is incomplete');
        return;
    }

    var spec = {
        urn: alertSpec.name,
        description: (alertSpec.description || ''),
        name: (alertSpec.name || null),
        fields: (alertSpec.value && alertSpec.value.fields)? alertSpec.value.fields : null
    };

    /** @private */
    Object.defineProperty(this, '_', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: {}
    });

    // public members

    Object.defineProperty(this, 'urn', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.urn
    });

    Object.defineProperty(this, 'name', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.name
    });

    Object.defineProperty(this, 'description', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.description
    });

    Object.defineProperty(this, 'onAlerts', {
        enumerable: false,
        configurable: false,
        get: function () {
            return this._.onAlerts;
        },
        set: function (newValue) {
            if (!newValue || (typeof newValue !== 'function')) {
                lib.error('trying to set something to onAlert that is not a function!');
                return;
            }
            this._.onAlerts = newValue;
        }
    });
    this._.onAlerts = function (arg) {};

    /** @private */
    Object.defineProperty(this._, 'formatsLocalUpdate', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (formats, virtualDevice, callback) {
            if (spec.fields) {
                var index = 0;
                spec.fields.forEach(function (field) {
                    if (field.type === "URI") {
                        var url = formats[0].fields[field.name];
                        if (_isStorageCloudURI(url)) {
                            virtualDevice.client._.createStorageObject(url, function (storage, error) {
                                if (error) {
                                    lib.error('Error during creation storage object: ' + error);
                                    return;
                                }
                                var storageObject = new lib.enterprise.StorageObject(storage.getURI(), storage.getName(),
                                    storage.getType(), storage.getEncoding(), storage.getDate(), storage.getLength());
                                storageObject._.setDevice(virtualDevice);
                                storageObject._.setSyncEventInfo(field.name, virtualDevice);

                                formats[0].fields[field.name] = storageObject;
                                ++index;
                                if (callback && index === spec.fields.length) {
                                    callback();
                                }
                            });
                        } else {
                            formats[0].fields[field.name] = new lib.ExternalObject(url);
                            ++index;
                        }
                    } else {
                        ++index;
                    }
                });
                if (callback && index === spec.fields.length) {
                    callback();
                }
            }
        }
    });
};

//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/Data.js

/**
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

//@TODO: missing JSDOC

/**
 * @class
 */
/** @ignore */
$impl.Data = function (dataSpec) {
    _mandatoryArg(dataSpec, 'object');

    if (!dataSpec.urn) {
        lib.error('data specification in device model is incomplete');
        return;
    }

    var spec = {
        urn: dataSpec.name,
        description: (dataSpec.description || ''),
        name: (dataSpec.name || null),
        fields: (dataSpec.value && dataSpec.value.fields)? dataSpec.value.fields : null
    };

    /** @private */
    Object.defineProperty(this, '_', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: {}
    });

    // public members

    Object.defineProperty(this, 'urn', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.urn
    });

    Object.defineProperty(this, 'name', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.name
    });

    Object.defineProperty(this, 'description', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.description
    });

    Object.defineProperty(this, 'onData', {
        enumerable: false,
        configurable: false,
        get: function () {
            return this._.onData;
        },
        set: function (newValue) {
            if (!newValue || (typeof newValue !== 'function')) {
                lib.error('trying to set something to onData that is not a function!');
                return;
            }
            this._.onData = newValue;
        }
    });
    this._.onData = function (arg) {};

    /** @private */
    Object.defineProperty(this._, 'formatsLocalUpdate', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (formats, virtualDevice, callback) {
            if (spec.fields) {
                var index = 0;
                spec.fields.forEach(function (field) {
                    if (field.type === "URI") {
                        var url = formats[0].fields[field.name];
                        if (_isStorageCloudURI(url)) {
                            virtualDevice.client._.createStorageObject(url, function (storage, error) {
                                if (error) {
                                    lib.error('Error during creation storage object: ' + error);
                                    return;
                                }
                                var storageObject = new lib.enterprise.StorageObject(storage.getURI(), storage.getName(),
                                    storage.getType(), storage.getEncoding(), storage.getDate(), storage.getLength());
                                storageObject._.setDevice(virtualDevice);
                                storageObject._.setSyncEventInfo(field.name, virtualDevice);

                                formats[0].fields[field.name] = storageObject;
                                ++index;
                                if (callback && index === spec.fields.length) {
                                    callback();
                                }
                            });
                        } else {
                            formats[0].fields[field.name] = new lib.ExternalObject(url);
                            ++index;
                        }
                    } else {
                        ++index;
                    }
                });
                if (callback && index === spec.fields.length) {
                    callback();
                }
            }
        }
    });
};

//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/Attribute.js

/**
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

//@TODO: missing jsdoc

/**
 * @class
 */
/** @ignore */
$impl.Attribute = function (attributeSpec) {
    _mandatoryArg(attributeSpec, 'object');
    
    if ((!attributeSpec.name) || (!attributeSpec.type)) {
        lib.error('attribute specification in device model is incomplete');
        return;
    }

    var spec = {
        name: attributeSpec.name,
        description: (attributeSpec.description || ''),
        type: attributeSpec.type,
        writable: (attributeSpec.writable || false),
        alias: (attributeSpec.alias || null),
        range: (attributeSpec.range ? _parseRange(attributeSpec.type, attributeSpec.range) : null),
        defaultValue: ((typeof attributeSpec.defaultValue !== 'undefined') ? attributeSpec.defaultValue : null)
    };
    
    /** @private */
    Object.defineProperty(this, '_', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: {}
    });
    this._.value = spec.defaultValue;
    this._.lastKnownValue = spec.defaultValue;
    this._.lastUpdate = null;
    this._.localUpdateRequest = false;

    var self = this;

    //@TODO: see comment in AbstractVirtualDevice; this is not clean especially it is supposed to be a private function and yet used in 4 other objects ...etc...; this looks like a required ((semi-)public) API ... or an $impl.XXX or a function ()...

    /** @private */
    Object.defineProperty(this._, 'isValidValue', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (newValue) {
            try {
                newValue = _checkAndGetNewValue(newValue, spec);
            } catch (e) {
                lib.createError('invalid value', e);
                return false;
            }

            if (typeof newValue === 'undefined') {
                lib.createError('trying to set an invalid value');
                return false;
            }

            if (spec.range && ((newValue < spec.range.low) || (newValue > spec.range.high))) {
                lib.createError('trying to set a value out of range [' + spec.range.low + ' - ' + spec.range.high + ']');
                return false;
            }
            return true;
        }
    });

    /** @private */
    Object.defineProperty(this._, 'getNewValue', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (newValue, virtualDevice, callback) {
            try {
                if (self._.isValidValue(newValue)) {
                    _checkAndGetNewValueCallback(newValue, spec, virtualDevice, function(attributeValue) {
                        if (callback) {
                            callback(attributeValue);
                        }
                    });
                }
            } catch (e) {
                lib.createError('invalid value ', e);
            }
        }
    });

    /** @private */
    Object.defineProperty(this._, 'remoteUpdate', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (newValue) {
            try {
                if (self._.isValidValue(newValue)) {
                    self._.lastUpdate = Date.now();

                    if (_equal(newValue, self._.lastKnownValue, spec)) {
                        return;
                    }

                    self._.lastKnownValue = newValue;

                    if (!(spec.writable && self._.localUpdateRequest)) {
                        var consoleValue = (self._.value instanceof lib.ExternalObject) ? self._.value.getURI() : self._.value;
                        var consoleNewValue = (newValue instanceof lib.ExternalObject) ? newValue.getURI() : newValue;
                        lib.log('updating attribute "' + spec.name + '" of type "' + spec.type + '" from ' + consoleValue + ' to ' + consoleNewValue);
                        self._.value = newValue;
                    }
                }
            } catch (e) {
                lib.createError('invalid value ', e);
            }
        }
    });

    /** @private */
    Object.defineProperty(this._, 'onUpdateResponse', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (error) {
            if (error) {
                var consoleValue = (self._.value instanceof lib.ExternalObject)? self._.value.getURI() : self._.value;
                var consoleLastValue = (self._.lastKnownValue instanceof lib.ExternalObject)?
                    self._.lastKnownValue.getURI() : self._.lastKnownValue;
                lib.log('updating attribute "' + spec.name + '" of type "' + spec.type + '" from ' + consoleValue + ' to ' + consoleLastValue);
                self._.value = self._.lastKnownValue;
            }
            self._.lastUpdate = new Date().getTime();
            self._.localUpdateRequest = false;
        }
    });

    /** @private */
    Object.defineProperty(this._, 'localUpdate', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (newValue, nosync) {
            if (self._.isValidValue(newValue)) {
                newValue = _checkAndGetNewValue(newValue, spec);

                if (!spec.writable) {
                    lib.error('illegal write access; attribute "' + spec.name + '" is read-only"');
                    return;
                }

                if (_equal(newValue, self._.value, spec)) {
                    return;
                }

                var consoleValue = (self._.value instanceof lib.ExternalObject) ? self._.value.getURI() : self._.value;
                var consoleNewValue = (newValue instanceof lib.ExternalObject) ? newValue.getURI() : newValue;
                lib.log('updating attribute "' + spec.name + '" of type "' + spec.type + '" from ' + consoleValue + ' to ' + consoleNewValue);
                self._.value = newValue;
                self._.localUpdateRequest = true;

                if (!nosync) {
                    if (!self.device || !(self.device instanceof lib.enterprise.VirtualDevice)) {
                        return;
                    }
                    var attributes = {};
                    attributes[spec.name] = newValue;
                    self.device.controller.updateAttributes(attributes, true);
                }
            }  else {
                lib.error('invalid value');
            }
        }
    });


    // public properties

    /**
     * @memberof iotcs.Attribute 
     * @member {string} id - the unique/reproducible
     * id for this attribute (usually its name)
     */
    Object.defineProperty(this, 'id', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.name
    });

    /**
     * @memberof iotcs.Attribute
     * @member {string} description - the description
     * of this attribute
     */
    Object.defineProperty(this, 'description', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.description
    });

    /**
     * @memberof iotcs.Attribute 
     * @member {string} type - one of <code>INTEGER</code>,
     * <code>NUMBER</code>, <code>STRING</code>, <code>BOOLEAN</code>, 
     * <code>DATETIME</code> 
     */
    Object.defineProperty(this, 'type', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.type
    });

    Object.defineProperty(this, 'defaultValue', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.defaultValue
    });

    /**
     * @ignore
     * @memberof iotcs.Attribute 
     * @member {boolean} writable - expressing whether
     * this attribute is writable or not 
     */
    Object.defineProperty(this, 'writable', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: spec.writable
    });

    /**
     * @memberof iotcs.Attribute 
     * @member {function(Object)} onChange - function called
     * back when value as changed on the server side. Callback
     * signature is <code>function (e) {}</code>, where <code>e</code> 
     * is <code>{'attribute':this, 'newValue':, 'oldValue':}</code>
     */
    Object.defineProperty(this, 'onChange', {
        enumerable: false,
        configurable: false,
        get: function () {
            return this._.onChange;
        },
        set: function (newValue) {
            if (!newValue || (typeof newValue !== 'function')) {
                lib.error('trying to set to onChange something that is not a function!');
                return;
            }
            this._.onChange = newValue;
        }
    });

    /**
     * @memberof iotcs.Attribute 
     * @member {function(Object)} onError - function called
     * back when value could not be changed. Callback signature is
     * <code>function (e) {}</code>, where <code>e</code> is 
     * <code>{'attribute':this, 'newValue':, 'tryValue':}</code>
     */
    Object.defineProperty(this, 'onError', {
        enumerable: false,
        configurable: false,
        get: function () {
            return this._.onError;
        },
        set: function (newValue) {
            if (!newValue || (typeof newValue !== 'function')) {
                lib.error('trying to set to onError something that is not a function!');
                return;
            }
            this._.onError = newValue;
        }
    });

    /**
     * @memberof iotcs.Attribute 
     * @member {(number|string|boolean|Date)} value - used for setting or
     * getting the current value of this attribute (subject to whether it is writable
     * or not).
     */
    Object.defineProperty(this, 'value', {
        enumerable: false,
        configurable: false,
        get: function () {
            return this._.value;
        },
        set: function (newValue) {
            this._.localUpdate(newValue, false);
        }
    });

    /**
     * @memberof iotcs.Attribute 
     * @member {(number|string|boolean|Date)} lastKnownValue - 
     * used for getting the current value of this attribute 
     */
    Object.defineProperty(this, 'lastKnownValue', {
        enumerable: false,
        configurable: false,
        get: function () {
            return this._.lastKnownValue;
        },
        set: function (newValue) {
        }
    });

    /**
     * @memberof iotcs.Attribute
     * @member {Date} lastUpdate - the date of the last value update
     */
    Object.defineProperty(this, 'lastUpdate', {
        enumerable: false,
        configurable: false,
        get: function () {
            return this._.lastUpdate;
        },
        set: function (newValue) {
        }
    });
};

//////////////////////////////////////////////////////////////////////////////

/** @ignore */
function _parseRange(type, rangeStr) {
    _mandatoryArg(type, 'string');
    _mandatoryArg(rangeStr, 'string');
    if ((type !== 'NUMBER') && (type !== 'INTEGER')) {
        lib.error('device model specification is invalid');
        return;
    }
    var rangeLimits = rangeStr.split(',');
    if (rangeLimits.length != 2) {
        lib.error('device model specification is invalid');
        return;
    }
    var first = parseFloat(rangeLimits[0]);
    var second = parseFloat(rangeLimits[1]);
    return { low:Math.min(first,second), high:Math.max(first,second) };
}

/** @ignore */
function _matchType(reqType, value) {
    _mandatoryArg(reqType, 'string');
    switch(reqType) {
        case 'INTEGER':
            return ((typeof value === 'number') && (value % 1 === 0));
        case 'NUMBER':
            return (typeof value === 'number');
        case 'STRING':
            return (typeof value === 'string');
        case 'BOOLEAN':
            return (typeof value === 'boolean');
        case 'DATETIME':
            return (value instanceof Date);
        case 'URI':
            return (value instanceof lib.ExternalObject) || (typeof value === 'string');
        default:
            lib.error('illegal state');
            return;
    }
}

/** @ignore */
function _checkAndGetNewValue(newValue, spec) {
    if (spec.type === 'DATETIME') {
        if (typeof newValue === 'number') {
            var str = '' + newValue;
            if (str.match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/)) {
                newValue = newValue.toFixed();
            }
        }
        newValue = new Date(newValue);
        if (isNaN(newValue.getTime())) {
            lib.error('invalid date in date time parameter');
            return;
        }
    }

    if (!_matchType(spec.type, newValue)) {
        lib.error('type mismatch; attribute "' + spec.name + '" has type [' + spec.type + ']');
        return;
    }
    return newValue;
}

/** @ignore */
function _checkAndGetNewValueCallback(newValue, spec, virtualDevice, callback) {
    var isURICallback = false;
    if (spec.type === 'DATETIME') {
        if (typeof newValue === 'number') {
            var str = '' + newValue;
            if (str.match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/)) {
                newValue = newValue.toFixed();
            }
        }
        newValue = new Date(newValue);
        if (isNaN(newValue.getTime())) {
            lib.error('invalid date in date time parameter');
            return;
        }
    }
    if (spec.type === 'URI') {
        if (newValue instanceof lib.ExternalObject) {
            // nothing to do
        } else if (typeof newValue === 'string') {
            // get uri from server
            if (_isStorageCloudURI(newValue)) {
                isURICallback = true;
                virtualDevice.client._.createStorageObject(newValue, function (storage, error) {
                    if (error) {
                        lib.error('Error during creation storage object: ' + error);
                        return;
                    }
                    var storageObject = new lib.enterprise.StorageObject(storage.getURI(), storage.getName(),
                        storage.getType(), storage.getEncoding(), storage.getDate(), storage.getLength());
                    storageObject._.setDevice(virtualDevice);
                    storageObject._.setSyncEventInfo(spec.name, virtualDevice);

                    if (!_matchType(spec.type, storageObject)) {
                        lib.error('type mismatch; attribute "' + spec.name + '" has type [' + spec.type + ']');
                        return;
                    }
                    callback(storageObject);
                });
                return;
            } else {
                newValue = new lib.ExternalObject(newValue);
            }
        } else {
            lib.error('invalid URI parameter');
            return;
        }
    }

    if (!_matchType(spec.type, newValue)) {
        lib.error('type mismatch; attribute "' + spec.name + '" has type [' + spec.type + ']');
        return;
    }

    if (!isURICallback) {
        callback(newValue);
    }
}

/** @ignore */
function _equal(newValue, oldValue, spec) {
    if (spec.type === 'DATETIME'
        && (newValue instanceof Date)
        && (oldValue instanceof Date)) {
        return (newValue.getTime() === oldValue.getTime());
    } else {
        return (newValue === oldValue);
    }
}


//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/AsyncRequestMonitor.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

/** @ignore */
$impl.AsyncRequestMonitor = function (requestId, callback, internalClientExt) {
    _mandatoryArg(requestId, ['string','number']);
    _mandatoryArg(callback, 'function');
    this.requestId = requestId;
    this.callback = callback;
    this.monitor = null;
    this.startTime = null;
    this.internalClient = internalClientExt;
};

/** @ignore */
$impl.AsyncRequestMonitor.prototype.start = function () {
    var self = this;
    if (!this.monitor) {
        this.monitor = new $impl.Monitor(function () {
            _requestMonitor(self);
        });
    }
    if (!this.monitor.running) {
        this.monitor.start();
        this.startTime = Date.now();
    }
};

/** @ignore */
$impl.AsyncRequestMonitor.prototype.stop = function () {
    if (this.monitor) {
        this.monitor.stop();
    }
    this.startTime = null;
};

/** @ignore */
function _requestMonitor (monitorObject){
    if (monitorObject.startTime
        && (Date.now() > (monitorObject.startTime + lib.oracle.iot.client.controller.asyncRequestTimeout))) {
        monitorObject.stop();
        var response = {
            complete: true,
            id: monitorObject.requestId,
            status: 'TIMEOUT'
        };
        monitorObject.callback(response);
        return;
    }
    $impl.https.bearerReq({
        'method': 'GET',
        'path': $impl.reqroot
        + '/requests/'
        + monitorObject.requestId
    }, '', function (response, error) {
        try {
            if (!response || error) {
                monitorObject.stop();
                monitorObject.callback(response, lib.createError('invalid response',error));
                return;
            }
            if (!(response.status) || (typeof response.complete === 'undefined')) {
                monitorObject.stop();
                monitorObject.callback(response, lib.createError('invalid response type', error));
                return;
            }
            if (response.complete) {
                monitorObject.stop();
                monitorObject.callback(response);
            }
        } catch(e) {
            monitorObject.stop();
            monitorObject.callback(response, lib.createError('error on response',e));
        }
    }, function () {
        _requestMonitor (monitorObject);
    }, monitorObject.internalClient);
}


//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/Controller.js

/**
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

//@TODO: a little more JSDOC is needed

/**
 * @param {function()} callback - function associated to this monitor
 * @class
 */
/** @ignore */
$impl.Controller = function (device) {
    _mandatoryArg(device, lib.AbstractVirtualDevice);
    this.device = device;
    this.requestMonitors = {};
};

/**
 * @TODO: MISSING DESCRIPTION
 *
 * @param {Object} attributeNameValuePairs - map of attribute names to update with
 * associated values. e.g. { name1:value1, name2:value2, ...}
 * @param {boolean} [singleAttribute] - indicate that one attribute needed to update. Could be omitted, in this case used false.
 *
 * @memberof iotcs.util.Controller.prototype
 * @function updateAttributes
 */
$impl.Controller.prototype.updateAttributes = function (attributeNameValuePairs, singleAttribute) {
    _mandatoryArg(attributeNameValuePairs, 'object');

    if (Object.keys(attributeNameValuePairs).length === 0) {
        return;
    }
    for(var attributeName in attributeNameValuePairs) {
        if (!this.device[attributeName]) {
            lib.error('device model attribute mismatch');
            return;
        }
    }
    var endpointId = this.device.getEndpointId();
    var deviceModelUrn = this.device.getDeviceModel().urn;
    var selfDevice = this.device;
    var self = this;

    _checkIfDeviceIsDeviceApp(this.device, function () {

        $impl.https.bearerReq({
            method: (singleAttribute ? 'PUT' : 'POST'),
            headers: (singleAttribute ? {} : {
                'X-HTTP-Method-Override': 'PATCH'
            }),
            path: $impl.reqroot
            + '/apps/' + self.device.client.appid
            + ((self.device._.isDeviceApp === 2) ? '/deviceApps/' : '/devices/') + endpointId
            + '/deviceModels/' + deviceModelUrn
            + '/attributes'
            + (singleAttribute ? ('/'+Object.keys(attributeNameValuePairs)[0]) : '')
        }, (singleAttribute ? JSON.stringify({value: attributeNameValuePairs[Object.keys(attributeNameValuePairs)[0]]}) : JSON.stringify(attributeNameValuePairs)), function (response, error) {
            if (!response || error || !(response.id)) {
                _attributeUpdateResponseProcessor(null, selfDevice, attributeNameValuePairs, lib.createError('invalid response on update async request', error));
                return;
            }
            var reqId = response.id;

            try {
                self.requestMonitors[reqId] = new $impl.AsyncRequestMonitor(reqId, function (response, error) {
                    _attributeUpdateResponseProcessor(response, selfDevice, attributeNameValuePairs, error);
                }, self.device.client._.internalClient);
                self.requestMonitors[reqId].start();
            } catch (e) {
                _attributeUpdateResponseProcessor(null, selfDevice, attributeNameValuePairs, lib.createError('invalid response on update async request', e));
            }
        }, function () {
            self.updateAttributes(attributeNameValuePairs, singleAttribute);
        }, self.device.client._.internalClient);
    });
};

/**
 * @memberof iotcs.util.Controller.prototype
 * @function invokeAction
 */
$impl.Controller.prototype.invokeAction = function (actionName, arg) {
    _mandatoryArg(actionName, 'string');

    if (!this.device[actionName]) {
        lib.error('device model action mismatch');
        return;
    }

    var actionValue;
    if ((actionValue = this.device[actionName].checkAndGetVarArg(arg)) === null) {
        lib.error('invalid parameters on action call');
        return;
    }

    var self = this;
    var endpointId = self.device.getEndpointId();
    var deviceModelUrn = self.device.getDeviceModel().urn;
    var selfDevice = self.device;

    _checkIfDeviceIsDeviceApp(self.device, function () {
        $impl.https.bearerReq({
            method: 'POST',
            path: $impl.reqroot
            + '/apps/' + self.device.client.appid
            + ((self.device._.isDeviceApp === 2) ? '/deviceApps/' : '/devices/') + endpointId
            + '/deviceModels/' + deviceModelUrn
            + '/actions/' + actionName
        }, ((typeof actionValue !== 'undefined') ? JSON.stringify({value: actionValue}) : JSON.stringify({})) ,
        function (response, error) {
            if (!response || error || !(response.id)) {
                _actionExecuteResponseProcessor(response, selfDevice, actionName, lib.createError('invalid response on execute async request', error));
                return;
            }
            var reqId = response.id;

            try {
                self.requestMonitors[reqId] = new $impl.AsyncRequestMonitor(reqId, function (response, error) {
                    _actionExecuteResponseProcessor(response, selfDevice, actionName, error);
                }, self.device.client._.internalClient);
                self.requestMonitors[reqId].start();
            } catch (e) {
                _actionExecuteResponseProcessor(response, selfDevice, actionName, lib.createError('invalid response on execute async request', e));
            }
        }, function () {
            self.invokeAction(actionName, actionValue);
        }, self.device.client._.internalClient);
    });
};


/**
 * @TODO MISSING DESCRIPTION
 *
 * @memberof iotcs.util.Controller.prototype
 * @function close
 */
$impl.Controller.prototype.close = function () {
    for(var key in this.requestMonitors) {
        this.requestMonitors[key].stop();
    }
    this.requestMonitors = {};
    this.device = null;
};

//////////////////////////////////////////////////////////////////////////////

/**@ignore*/
function _attributeUpdateResponseProcessor (response, device, attributeNameValuePairs, extError) {
    var error = false;
    if (!response || extError) {
        error = true;
        response = extError;
    } else {
        error = (response.status === 'FAILED'
        || (!response.response)
        || (!response.response.statusCode)
        || (response.response.statusCode > 299)
        || (response.response.statusCode < 200));
    }
    var attrObj = {};
    var newValObj = {};
    var tryValObj = {};
    for (var attributeName in attributeNameValuePairs) {
        var attribute = device[attributeName];
        attribute._.onUpdateResponse(error);
        attrObj[attribute.id] = attribute;
        newValObj[attribute.id] = attribute.value;
        tryValObj[attribute.id] = attributeNameValuePairs[attributeName];
        if (error && attribute.onError) {
            var onAttributeErrorTuple = {
                attribute: attribute,
                newValue: attribute.value,
                tryValue: attributeNameValuePairs[attributeName],
                errorResponse: response
            };
            attribute.onError(onAttributeErrorTuple);
        }
    }
    if (error && device.onError) {
        var onDeviceErrorTuple = {
            attributes: attrObj,
            newValues: newValObj,
            tryValues: tryValObj,
            errorResponse: response
        };
        device.onError(onDeviceErrorTuple);
    }
}

/**@ignore*/
function _actionExecuteResponseProcessor(response, device, actionName, error) {
    var action = device[actionName];
    if (action.onExecute) {
        action.onExecute(response, error);
    }
}

/** @ignore */
function _checkIfDeviceIsDeviceApp(virtualDevice, callback) {

    if (virtualDevice._.isDeviceApp) {
        callback();
        return;
    }

    var deviceId = virtualDevice.getEndpointId();

    var filter = new lib.enterprise.Filter();
    filter = filter.eq('id',deviceId);

    $impl.https.bearerReq({
        method: 'GET',
        path:   $impl.reqroot
        + (virtualDevice.client.appid ? ('/apps/' + virtualDevice.client.appid) : '')
        + '/deviceApps'
        + '?fields=type'
        + '&q=' + filter.toString()
    }, '', function (response, error) {
        if (!response || error || !response.items || !Array.isArray(response.items)) {
            lib.createError('invalid response on device app check request - assuming virtual device is a device');
        } else {
            if ((response.items.length > 0) && response.items[0].type && (response.items[0].type === 'DEVICE_APPLICATION')) {
                virtualDevice._.isDeviceApp = 2;
                callback();
                return;
            }
        }

        virtualDevice._.isDeviceApp = 1;
        callback();

    }, function () {
        _checkIfDeviceIsDeviceApp(virtualDevice, callback);
    }, virtualDevice.client._.internalClient);

}



//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/Pageable.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

/**
 * The Pageable is a utility class used by the implementation
 * of some operations of this library that retrieve requested
 * data page by page. This processor is typically returned on
 * {@link iotcs.enterprise.EnterpriseClient#getApplications} or {@link
 * iotcs.enterprise.EnterpriseClient#getDevices}.
 * <p>
 * In the usage of the Pageable object the application has to take
 * into account the state of the object. The state of the object can be
 * changed by using the {@link iotcs.enterprise.Pageable#page} method.
 * <p>
 * The object can have 3 states:<br>
 * a. In the first state the Pageable object is created and this can be
 * done generally indirectly by using the {@link iotcs.enterprise.EnterpriseClient}
 * methods as stated above.<br>
 * b. From the first state the Pageable object can enter only the second state and
 * only by calling the page with the following parameters:<br>
 * - page('first');<br>
 * - page('first', x);<br>
 * - page(0);<br>
 * - page(0, x);<br>
 * Where x is the actual size of the page requested or if none is given
 * a default size is defined.<br>
 * c. From the second state the Pageable object can enter only the third state
 * by calling page with any parameters defined for the method. Then the object
 * will stay only in the third state.<br>
 * Each transition to a state will return a Promise object that can be used
 * for handling the response/error received for the page request.<br>
 *
 * @example <caption>Pageable Quick Start</caption>
 *
 * //create the enterprise client
 * ecl.enterprise.EnterpriseClient.newClient(function (entClient) {
 *
 *      //create the Pageable object
 *      var pageable = entClient.getActiveDevices('urn:com:oracle:iot:device:humidity_sensor');
 *
 *      var recursivePrevious;
 *      var recursiveNext;
 *
 *      //function that iterates previous page until start
 *      recursivePrevious = function () {
 *          pageable.page('prev').then( function (response) {
 *              if (Array.isArray(response.items)) {
 *                  //handle items
 *              }
 *              if (pageable.prev) {
 *                  //if there is a prev link present
 *                  recursivePrevious();
 *              } else {
 *                  //handle stop
 *                  entClient.close();
 *              }
 *          }
 *      }
 *
 *      //function that iterates next page until end
 *      recursiveNext = function () {
 *          pageable.page('next').then( function (response) {
 *              if (Array.isArray(response.items)) {
 *                  //handle items
 *              }
 *              if (response.hasMore) {
 *                  //if there are more items then go next page
 *                  recursiveNext();
 *              } else if (pageable.prev) {
 *                  //if there are no more items and there is a prev link present
 *                  //then we have reached the end and can go backwards
 *                  recursivePrevious();
 *              } else {
 *                  //handle stop
 *                  entClient.close();
 *              }
 *          }
 *      }
 *
 *      //retrieve first page
 *      pageable.page('first').then( function (response) {
 *          if (Array.isArray(response.items)) {
 *              //handle items
 *          }
 *          if (response.hasMore) {
 *              //if there are more items, then there are more pages
 *              recursiveNext();
 *          } else {
 *              //handle stop
 *              entClient.close();
 *          }
 *      }
 * });
 *
 * @memberOf iotcs.enterprise
 * @alias Pageable
 *
 * @param {Object} options - the options that are given to the
 * XMLHttpRequest object for making the initial request without
 * the paging parameters (without offset or limit)
 * @param {string} [payload] - the payload used in the initial and
 * subsequent requests made for generating the pages
 * @param {?number} [limit] - the initial limit used for generating
 * the pages requested; optional as if none is given the default is 50
 * @param {iotcs.enterprise.EnterpriseClient} [client] - the enterprise
 * client used by this Pageable object for requests. This is optional and
 * is used only in context of endpoint authentication.
 * @class
 */
lib.enterprise.Pageable = function (options, payload, limit, client) {
    _mandatoryArg(options, 'object');
    _optionalArg(payload, 'string');
    _optionalArg(limit, 'number');
    _optionalArg(client, lib.enterprise.EnterpriseClient);

    this.options = options;
    this.payload = payload || '';
    this.limit = limit || lib.oracle.iot.client.pageable.defaultLimit;

    this.next = null;
    this.last = null;
    this.first = null;
    this.prev = null;
    this.basepath = _GetBasePath(options);
    this.internalClient = (client ? client._.internalClient : null);
};

//@TODO: (jy) look for cleaner solution than "((this.basepath.indexOf('?') > -1)"

/**
 * This method requests a specific page based on the
 * parameters given to it. The method returns a Promise
 * with the parameter given to the handlers (response) in the form
 * of a JSON object representing the actual page requested.
 * <p>
 * A standard page response would have the following useful properties:<br>
 * - items: the array of items representing content of the page<br>
 * - hasMore: a boolean value that would tell if a 'next' call can be made<br>
 * - count: the count of all the items that satisfy the request query
 *
 * @param {(number|string)} offset - this parameters will set
 * where the initial element of the page to be set; if the
 * parameter is a number then the exact number is the position
 * of the first element of the page, if the parameter is string
 * then the values can be: 'first', 'last', 'next' and 'prev'
 * and the page requested will be according to link associated
 * to each setting: 'first page', 'next page' etc.
 * @param {number} [limit] - if the offset is a number
 * then this parameter will be used to set a new limit for pages;
 * if the parameter is not set the limit used in the constructor
 * will be used
 *
 * @returns {Promise} a promise of the response to the requested
 * page; the promise can be used in the standard way with
 * .then(resolve, reject) or .catch(resolve) resolve and reject
 * functions are defined as resolve(response) and reject(error)
 *
 * @memberof iotcs.enterprise.Pageable.prototype
 * @function page
 */
lib.enterprise.Pageable.prototype.page = function (offset, limit) {
    _mandatoryArg(offset, ['string', 'number' ]);
    _optionalArg(limit, 'number');

    var _limit = limit || this.limit;

    switch (typeof(offset)) {
    case 'number':
        if (this.basepath) {
            this.options.path = this.basepath + ((this.basepath.indexOf('?') > -1) ? '&' : '?') + 'offset=' + offset + '&limit=' + _limit;
        }
        break;
    case 'string':
        if ((offset === 'first') && (!this.first)) {
            this.options.path = this.basepath + ((this.basepath.indexOf('?') > -1) ? '&' : '?') + 'offset=0&limit=' + _limit;
        } else if (['first', 'last', 'next', 'prev'].indexOf(offset) !== -1) {
            if (this[offset]) {
                this.options.path = this[offset];
            } else {
                lib.error('invalid request');
                return;
            }
        } else {
            lib.error('invalid request');
            return;
        }
    }

    var self = this;

    var parseLinks = function (response) {
        self.first = null;
        self.last = null;
        self.next = null;
        self.prev = null;
        if (response.links && Array.isArray(response.links)) {
            var links = response.links;
            links.forEach(function (link) {
                if(!link.rel || !link.href){
                    return;
                }
                self[link.rel] = link.href;
            });
        }
    };

    var rejectHandle = function (error) {
        lib.createError('invalid response on pageable request', error);
        return;
    };

    var promise = $port.util.promise( function (resolve, reject) {
        var request = null;
        request = function () {
            $impl.https.bearerReq(self.options, self.payload, function (response, error) {
                if (error) {
                    reject(error);
                    return;
                }
                if (!response || !response.links || !Array.isArray(response.links)) {
                    reject(new Error('invalid format for Pageable response'));
                    return;
                }
                Object.freeze(response);
                resolve(response);
            }, request, self.internalClient);
        };
        request();
    });

    promise.then(parseLinks, rejectHandle);
    return promise;
};

//////////////////////////////////////////////////////////////////////////////

/** @ignore */
function _GetBasePath(options){
    if (!options.path || (typeof options.path !== 'string')) {
        lib.error('invalid path for request');
        return null;
    }
    var index = options.path.indexOf('?');
    if (index < 0) {
        return options.path;
    }
    var query = $port.util.query.parse(options.path.substr(index + 1));
    delete query.offset;
    delete query.limit;
    var result = options.path.substr(0, (index + 1)) + $port.util.query.stringify(query);
    //@TODO: need to understand this; decodeURI is usually applied only on query-parameter values ... not whole query 
    result = decodeURI(result);  //Added this line because of strange behaviour in browser without it (open a new window then close it)
    return result;
}


//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/MessageEnumerator.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

//@TODO: jsdoc issue: MessageEnumerator appears in iotcs.* and not at index level (probably due to missing class jsdoc on lib.enterprise.MessageEnumerator) @DONE

//@TODO: move default value pageSize to lib.oracle.iot.... global @DONE
//@TODO: move default value messageListenMaxSize to lib.oracle.iot.... global @DONE: changed name also

/**
 * A class that implements a way of getting the history
 * of all messages from the cloud and also register listeners
 * to the messages received.
 *
 * @param {iotcs.enterprise.EnterpriseClient} client - The enterprise client
 * associated with the application context of the messages that need to be enumerated
 * or listened to.
 *
 * @memberOf iotcs.enterprise
 * @alias MessageEnumerator
 * @class
 */
lib.enterprise.MessageEnumerator = function (client) {
    _mandatoryArg(client, lib.enterprise.EnterpriseClient);
    this.client = client;
    this._message = {
        callbacks: {},
        monitors: {},
        lastTime: {},
        inProgress: {},
        maxLimit: 1000,
        types: ['DATA', 'ALERT', 'REQUEST', 'RESPONSE', 'WAKEUP', 'UPDATE_BUNDLE', 'RESOURCES_REPORT'],
        allKey: 'ALL'
    };
};

//@TODO: (jy) check why model is param,paramValue
/**
 * Return a list of messages according to the given parameters.
 * The method will generate a query and make a request to the cloud
 * and a list of messages will be returned based on the query
 * in descendant order of arrival of the messages to the cloud.
 * <p>
 * The query for messages must be made based on one of the following
 * criteria or both:<br>
 * - "device": messages from a specific device<br>
 * - "type": messages of a given type<br>
 *
 * @param {?string} [deviceId] - The id of the device as the source of the messages
 * from the enumerator. If this is <code>null</code> the messages for all devices will
 * be enumerated.
 * @param {?string} [messageType] - The type of the messages to be enumerated.
 * If this is <code>null</code> then messages of all types will be enumerated.
 * The only types are: ['DATA', 'ALERT', 'REQUEST', 'RESPONSE', 'WAKEUP', 'UPDATE_BUNDLE', 'RESOURCES_REPORT'].
 * @param {?boolean} [expand] - A flag that would say if the messages
 * in the response contains expanded data. If this is not present the value is false.
 * @param {?number} [since] - The timestamp in milliseconds since EPOC
 * that would represent that minimum time when the messages were received
 * @param {?number} [until] - The timestamp in milliseconds since EPOC
 * that would represent that maximum time when the messages were received
 *
 * @returns {iotcs.enterprise.Pageable} A pageable instance with
 * which pages can be requested that contain messages as items
 *
 * @memberof iotcs.enterprise.MessageEnumerator.prototype
 * @function getMessages
 */
lib.enterprise.MessageEnumerator.prototype.getMessages = function(deviceId, messageType, expand, since, until){
    _optionalArg(deviceId, 'string');
    _optionalArg(messageType, 'string');
    _optionalArg(expand, 'boolean');
    _optionalArg(since, 'number');
    _optionalArg(until, 'number');

    if (messageType && this._message.types.indexOf(messageType) === -1) {
        lib.error('invalid parameter');
        return;
    }

    var separator = '&';
    var query = '?orderBy=deliveredTime:asc';

    if (deviceId) {
        query = query + separator + 'device=' + deviceId;
    }
    if (messageType) {
        query = query + separator + 'type=' + messageType;
    }
    if (expand) {
        query = query + separator + 'expand=true';
    }
    if (since) {
        query = query + separator + 'since=' + since;
    }
    if (until) {
        query = query + separator + 'until=' + until;
    }

    return new lib.enterprise.Pageable({
        method: 'GET',
        path:   $impl.reqroot
            + '/apps/' + this.client.appid
            + '/messages'
            + query
    }, '', null, this.client);

};

/**
 * Registers a callback method to be called when new messages of a given
 * type and/or for a given device are received.
 *
 * @param {string} [deviceId] - The id of the device for which the callback
 * is called when new messages arrives. If this is null the callback
 * will be called when messages for any device arrives.
 * @param {string} [messageType] - The type of the messages that the listener
 * listens to. The types are described in the getMessages method. If this is null
 * the callback will be called for all message types.
 * @param {function} callback - The callback function that will be called
 * when a new message from the associated device is received
 *
 * @see {@link iotcs.enterprise.MessageEnumerator#getMessages}
 * @memberof iotcs.enterprise.MessageEnumerator.prototype
 * @function setListener
 */
lib.enterprise.MessageEnumerator.prototype.setListener = function (deviceId, messageType, callback) {

    if (deviceId && (typeof deviceId === 'function')) {
        callback = deviceId;
        deviceId = null;
    } else if (messageType && (typeof messageType === 'function')) {
        callback = messageType;
        messageType = null;
    }

    _optionalArg(messageType, 'string');
    _optionalArg(deviceId, 'string');
    _mandatoryArg(callback, 'function');

    if (messageType && this._message.types.indexOf(messageType) === -1) {
        lib.error('invalid parameter');
        return;
    }

    if (!deviceId) {
        deviceId = this._message.allKey;
    }

    if (!messageType) {
        messageType = this._message.allKey;
    }

    if (!this._message.callbacks[messageType]) {
        this._message.callbacks[messageType] = {};
    }
    this._message.callbacks[messageType][deviceId] = callback;
    var self = this;
    _addMessageMonitor(self, messageType);
};

/**
 * The library will no longer monitor messages for the specified device and/or message type.
 *
 * @param {string} [deviceId] - The id of the device for which the monitoring
 * of messages will be stopped.
 * @param {string} [messageType] - The type of messages for which the monitoring
 * will be stopped. The types are described in the getMessages method.
 *
 * @see {@link iotcs.enterprise.MessageEnumerator#getMessages}
 * @memberof iotcs.enterprise.MessageEnumerator.prototype
 * @function unsetListener
 */
lib.enterprise.MessageEnumerator.prototype.unsetListener = function (deviceId, messageType) {
    _optionalArg(deviceId, 'string');
    _optionalArg(messageType, 'string');

    if (messageType && this._message.types.indexOf(messageType) === -1) {
        lib.error('invalid parameter');
        return;
    }

    if (!deviceId) {
        deviceId = this._message.allKey;
    }

    if (!messageType) {
        messageType = this._message.allKey;
    }

    if (messageType in this._message.callbacks) {
        if (deviceId in this._message.callbacks[messageType]) {
            delete this._message.callbacks[messageType][deviceId];
        }
        if (Object.keys(this._message.callbacks[messageType]).length === 0) {
            delete this._message.callbacks[messageType];
            _removeMessageMonitor(this, messageType);
        }
    }
};

//////////////////////////////////////////////////////////////////////////////

/**ignore*/
function _addMessageMonitor(enumerator, messageType) {
    if (messageType === enumerator._message.allKey) {
        enumerator._message.types.forEach(function(type){
            if (!enumerator._message.monitors[type]) {
                enumerator._message.monitors[type] = new $impl.Monitor(function (){
                    _messagesMonitor(enumerator, type);
                });
            }
            if (enumerator._message.monitors[type] && !enumerator._message.monitors[type].running) {
                enumerator._message.lastTime[type] = Date.now();
                enumerator._message.inProgress[type] = false;
                enumerator._message.monitors[type].start();
            }
        });
    } else {
        if (!enumerator._message.monitors[messageType]) {
            enumerator._message.monitors[messageType] = new $impl.Monitor(function (){
                _messagesMonitor(enumerator, messageType);
            });
        }
        if (enumerator._message.monitors[messageType] && !enumerator._message.monitors[messageType].running) {
            enumerator._message.lastTime[messageType] = Date.now();
            enumerator._message.inProgress[messageType] = false;
            enumerator._message.monitors[messageType].start();
        }
    }
}

/**ignore*/
function _removeMessageMonitor(enumerator, messageType) {
    if (messageType === enumerator._message.allKey) {
        enumerator._message.types.forEach(function(type){
            if (enumerator._message.monitors[type]
                && enumerator._message.monitors[type].running
                && !(type in enumerator._message.callbacks)) {
                enumerator._message.monitors[type].stop();
            }
        });
    } else {
        if (enumerator._message.monitors[messageType]
            && enumerator._message.monitors[messageType].running
            && !(messageType in enumerator._message.callbacks)) {
            enumerator._message.monitors[messageType].stop();
        }
    }
}

/**ignore*/
function _messagesMonitor(enumerator, messageType) {

    if (enumerator._message.inProgress[messageType]) {
        return;
    }

    enumerator._message.inProgress[messageType] = true;

    var pageable = enumerator.getMessages(null, messageType, false, enumerator._message.lastTime[messageType], null);
    var hasMore = false;
    pageable.page('first', enumerator._message.maxLimit).then(function (response) {
        _handleMessagesResponse(enumerator, response, messageType);
        hasMore = response.hasMore;
        var nextCheck = function () {
            pageable.page('next').then(function (response) {
                _handleMessagesResponse(enumerator, response, messageType);
                hasMore = response.hasMore;
                if (hasMore) {
                    nextCheck();
                } else {
                    enumerator._message.inProgress[messageType] = false;
                }
            }, function (error) {lib.createError('invalid response on message monitoring');});
        };
        if (hasMore) {
            nextCheck();
        } else {
            enumerator._message.inProgress[messageType] = false;
        }
    }, function (error) {lib.createError('invalid response on message monitoring');} );
}

/**ignore*/
function _handleMessagesResponse(enumerator, response, messageType){
    if (response
        && (response.items)
        && (Array.isArray(response.items))
        && (response.items.length > 0)) {
        for (var i = 0; i < response.items.length; i++ ){
            if (response.items[i].receivedTime && (response.items[i].receivedTime === enumerator._message.lastTime[messageType])) {
                continue;
            }
            var key2 = response.items[i].source;
            var key1 = response.items[i].type;
            if (enumerator._message.callbacks[key1] && enumerator._message.callbacks[key1][key2]) {
                enumerator._message.callbacks[key1][key2]([response.items[i]]);
            }
            key2 = enumerator._message.allKey;
            key1 = response.items[i].type;
            if (enumerator._message.callbacks[key1] && enumerator._message.callbacks[key1][key2]) {
                enumerator._message.callbacks[key1][key2]([response.items[i]]);
            }
            key2 = response.items[i].source;
            key1 = enumerator._message.allKey;
            if (enumerator._message.callbacks[key1] && enumerator._message.callbacks[key1][key2]) {
                enumerator._message.callbacks[key1][key2]([response.items[i]]);
            }
            key2 = enumerator._message.allKey;
            key1 = enumerator._message.allKey;
            if (enumerator._message.callbacks[key1] && enumerator._message.callbacks[key1][key2]) {
                enumerator._message.callbacks[key1][key2]([response.items[i]]);
            }
        }
        if (!response.hasMore) {
            if ((response.items.length > 0) && response.items[response.items.length-1].receivedTime) {
                enumerator._message.lastTime[messageType] = response.items[response.items.length - 1].receivedTime;
            } else {
                enumerator._message.lastTime[messageType] = enumerator._message.lastTime[messageType] + 1;
            }
        }
    }
}



//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/ResourceEnumerator.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

/**
 * A class that implements a way of getting the custom
 * resources registered by a device and the possibility
 * of invoking them (V1 implementation).
 *
 * @memberOf iotcs.enterprise
 * @alias ResourceEnumerator
 *
 * @param {iotcs.enterprise.EnterpriseClient} client - The enterprise
 * client associated with the application context of the device
 * for which the resources need to be enumerated
 * @param {string} deviceId - The id for which the resources
 * are to be enumerated/invoked
 * @class
 */
lib.enterprise.ResourceEnumerator = function (client, deviceId) {
    _mandatoryArg(client, lib.enterprise.EnterpriseClient);
    _mandatoryArg(deviceId, 'string');
    this.client = client;
    this.deviceId = deviceId;
    this.requestMonitors = {};
};

/**
 * Return the list of resources that the device associated with the
 * enumerator has registered in the cloud.
 *
 * @returns {iotcs.enterprise.Pageable} A pageable instance with
 * which pages can be requested that contain resources as items
 *
 * @memberof iotcs.enterprise.ResourceEnumerator.prototype
 * @function getResources
 */
lib.enterprise.ResourceEnumerator.prototype.getResources = function () {
    return new lib.enterprise.Pageable({
        method: 'GET',
        path: $impl.reqroot
        + '/apps/' + this.client.appid
        + '/devices/' + this.deviceId
        + '/resources'
    }, '', null, this.client);
};

/**
 * Invokes the specified resource with defined options, query and payload.
 * <p>
 * Resources can be retrieved by using the getResources method and from the
 * items property of the response the resource objects can be extracted.
 * A resource object must have the following properties:<br>
 * - methods: an array of methods the resource accepts<br>
 * - endpointId: the device id<br>
 * - the self link: this the link that the resource can be accessed with present
 * in the links array property
 *
 * @param {object} resource -The resource to be invoked as described.
 * @param {{method:string, headers:Object}} options - The request options.
 * The headers are optional and method is mandatory.
 * @param {object} [query] - The query for the request as JSON object.
 * @param {string} [body] - The payload for the request.
 * @param {function} callback - The callback function that is called when a
 * response arrives. The whole HTTP response as JSON object
 * is given as parameter to the callback function. If an error occurs or the
 * response is invalid the error object is passed as the second parameter in
 * the callback with the reason in error.message: callback(response, error)
 *
 * @see {@link iotcs.enterprise.ResourceEnumerator#getResources}
 * @memberof iotcs.enterprise.ResourceEnumerator.prototype
 * @function invokeResource
 */
lib.enterprise.ResourceEnumerator.prototype.invokeResource = function (resource, options, query, body, callback) {

    if (query && (typeof query === 'function')) {
        callback = query;
        query = null;
    }

    if (body && (typeof body === 'function')) {
        callback = body;
        body = null;
    }

    _mandatoryArg(resource, 'object');
    _mandatoryArg(resource.methods, 'array');
    _mandatoryArg(resource.endpointId, 'string');
    _mandatoryArg(resource.links, 'array');
    _mandatoryArg(options, 'object');
    _mandatoryArg(options.method, 'string');
    _optionalArg(options.headers, 'object');
    _optionalArg(query, 'object');
    _optionalArg(body, 'string');
    _mandatoryArg(callback, 'function');

    if (resource.endpointId !== this.deviceId){
        lib.error('invalid resource');
        return;
    }

    var path = null;

    resource.links.forEach(function(link){
        if(link.rel && link.href && (link.rel === 'self')){
            path = link.href;
        }
    });

    if (!path) {
        lib.error('invalid resource');
        return;
    }

    var method = null;

    resource.methods.forEach(function (m) {
        if (m === options.method){
            method = options.method;
        }
    });

    if (!method) {
        lib.error('invalid options');
        return;
    }

    path = decodeURI(path + (query ? ('?=' + $port.util.query.stringify(query)) : ''));

    var opt = {};
    opt.method = method;
    opt.path = path;

    if (options.headers) {
        opt.headers = options.headers;
    }

    var self = this;
    $impl.https.bearerReq(opt, (body ? body : null), function (response, error) {
        if (!response || error || !(response.id)) {
            callback(null, lib.createError('invalid response on async request for resource invocation', error));
            return;
        }
        var reqId = response.id;

        try {
            self.requestMonitors[reqId] = new $impl.AsyncRequestMonitor(reqId, function (response, error) {
                if (!response || error) {
                    callback(null, lib.createError('invalid response on resource invocation', error));
                    return;
                }
                Object.freeze(response);
                callback(response);
            }, self.client._.internalClient);
            self.requestMonitors[reqId].start();
        } catch (e) {
            callback(null, lib.createError('invalid response on async request for resource invocation', e));
        }
    }, function () {
        self.invokeResource(resource, options, query, body, callback);
    }, self.client._.internalClient);

};

/**
 * Closes the enumerator and will stop any pending resource invocations.
 *
 * @memberof iotcs.enterprise.ResourceEnumerator.prototype
 * @function close
 */
lib.enterprise.ResourceEnumerator.prototype.close = function () {
    for(var key in this.requestMonitors) {
        this.requestMonitors[key].stop();
    }
    this.requestMonitors = {};
    this.deviceId = null;
};




//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/DeviceAppEnumerator.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

/**
 * A class that implements a way of getting device applications
 *
 * @memberOf iotcs.enterprise
 * @alias DeviceAppEnumerator
 *
 * @param {iotcs.enterprise.EnterpriseClient} client - The enterprise
 * client associated with the application context
 * for which the deviceApps need to be enumerated
 * @class
 */
lib.enterprise.DeviceAppEnumerator = function (client) {
    _mandatoryArg(client, lib.enterprise.EnterpriseClient);
    this.client = client;
};

/**
 * Return the list of deviceApps from the enterprise client context
 *
 * @returns {iotcs.enterprise.Pageable} A pageable instance with
 * which pages can be requested that contain deviceApps as items
 *
 * @memberof iotcs.enterprise.DeviceAppEnumerator.prototype
 * @function getDeviceApps
 */
lib.enterprise.DeviceAppEnumerator.prototype.getDeviceApps = function (filter) {

    _optionalArg(filter, lib.enterprise.Filter);

    return new lib.enterprise.Pageable({
        method: 'GET',
        path: $impl.reqroot
        + '/apps/' + this.client.appid
        + '/deviceApps'
        + (filter ? ('?q=' + filter.toString()) : '')
    }, '', null, this.client);
};

//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/EnterpriseClientImpl.js

/**
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

/** @ignore */
$impl.EnterpriseClientImpl = function (taStoreFile, taStorePassword) {

    Object.defineProperty(this, '_',{
        enumerable: false,
        configurable: false,
        writable: false,
        value: {}
    });

    Object.defineProperty(this._, 'tam',{
        enumerable: false,
        configurable: false,
        writable: false,
        value: new lib.enterprise.TrustedAssetsManager(taStoreFile, taStorePassword)
    });

    Object.defineProperty(this._, 'bearer',{
        enumerable: false,
        configurable: true,
        writable: false,
        value: ""
    });

    Object.defineProperty(this._, 'refreshing',{
        enumerable: false,
        configurable: false,
        writable: true,
        value: false
    });

    var self = this;

    Object.defineProperty(this._, 'getCurrentServerTime',{
        enumerable: false,
        configurable: false,
        writable: false,
        value: function () {
            if (typeof self._.serverDelay === 'undefined') {
                return Date.now();
            } else {
                return (Date.now() + self._.serverDelay);
            }
        }
    });

    Object.defineProperty(this._, 'refresh_bearer',{
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (callback) {

            self._.refreshing = true;

            var id = self._.tam.getClientId();

            var exp = parseInt((self._.getCurrentServerTime() + 900000)/1000);
            var header = {
                typ: 'JWT',
                alg: 'HS256'
            };
            var claims = {
                iss: id,
                sub: id,
                aud: 'oracle/iot/oauth2/token',
                exp: exp
            };

            var inputToSign =
                $port.util.btoa(JSON.stringify(header))
                + '.'
                + $port.util.btoa(JSON.stringify(claims));

            var signed;

            try {
                var digest = self._.tam.signWithSharedSecret(inputToSign, "sha256");
                signed = forge.util.encode64(forge.util.hexToBytes(digest.toHex()));
            } catch (e) {
                self._.refreshing = false;
                var error1 = lib.createError('error on generating oauth signature', e);
                if (callback) {
                    callback(error1);
                }
                return;
            }

            inputToSign = inputToSign + '.' + signed;
            inputToSign = inputToSign.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
            var dataObject = {
                grant_type: 'client_credentials',
                client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                client_assertion: inputToSign,
                scope: ''
            };

            var payload = $port.util.query.stringify(dataObject, null, null, {encodeURIComponent: $port.util.query.unescape});

            payload = payload.replace(new RegExp(':', 'g'),'%3A');

            var options = {
                path: $impl.reqroot.replace('webapi','api') + '/oauth2/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                tam: self._.tam
            };

            $impl.https.req(options, payload, function (response_body, error) {

                self._.refreshing = false;

                if (!response_body || error || !response_body.token_type || !response_body.access_token) {

                    if (error) {
                        var exception = null;
                        try {
                            exception = JSON.parse(error.message);
                            var now = Date.now();
                            if (exception.statusCode && (exception.statusCode === 400)
                                && (exception.body)) {
                                var body = JSON.parse(exception.body);
                                if ((body.currentTime) && (typeof self._.serverDelay === 'undefined') && (now < parseInt(body.currentTime))) {
                                    Object.defineProperty(self._, 'serverDelay', {
                                        enumerable: false,
                                        configurable: false,
                                        writable: false,
                                        value: (parseInt(body.currentTime) - now)
                                    });
                                    self._.refresh_bearer(callback);
                                    return;
                                }
                            }
                        } catch (e) {

                        }
                    }

                    if (callback) {
                        callback(error);
                    }
                    return;
                }

                delete self._.bearer;
                Object.defineProperty(self._, 'bearer',{
                    enumerable: false,
                    configurable: true,
                    writable: false,
                    value: (response_body.token_type + ' ' + response_body.access_token)
                });

                if (callback) {
                    callback();
                }

            });
        }
    });

    Object.defineProperty(this._, 'storage_authToken',{
        enumerable: false,
        configurable: true,
        writable: false,
        value: ""
    });

    Object.defineProperty(this._, 'storageContainerUrl',{
        enumerable: false,
        configurable: true,
        writable: false,
        value: ""
    });

    Object.defineProperty(this._, 'storage_authTokenStartTime',{
        enumerable: false,
        configurable: true,
        writable: false,
        value: ""
    });

    Object.defineProperty(this._, 'storage_refreshing',{
        enumerable: false,
        configurable: false,
        writable: true,
        value: false
    });

    Object.defineProperty(this._, 'refresh_storage_authToken',{
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (callback) {
            self._.storage_refreshing = true;

            var options = {
                path: $impl.reqroot + '/provisioner/storage',
                method: 'GET',
                headers: {
                    'Authorization': self._.bearer,
                    'X-EndpointId': self._.tam.getClientId()
                },
                tam: self._.tam
            };
            var refresh_function = function (response, error) {
                self._.storage_refreshing = false;

                if (!response || error || !response.storageContainerUrl || !response.authToken) {
                    if (error) {
                        if (callback) {
                            callback(error);
                        }
                    } else {
                        self._.refresh_storage_authToken(callback);
                    }
                    return;
                }

                delete self._.storage_authToken;
                Object.defineProperty(self._, 'storage_authToken',{
                    enumerable: false,
                    configurable: true,
                    writable: false,
                    value: response.authToken
                });

                delete self._.storageContainerUrl;
                Object.defineProperty(self._, 'storageContainerUrl',{
                    enumerable: false,
                    configurable: true,
                    writable: false,
                    value: response.storageContainerUrl
                });

                delete self._.storage_authTokenStartTime;
                Object.defineProperty(self._, 'storage_authTokenStartTime',{
                    enumerable: false,
                    configurable: true,
                    writable: false,
                    value: Date.now()
                });

                if (callback) {
                    callback();
                }
            };
            $impl.https.req(options, "", refresh_function, function() {
                self._.refresh_storage_authToken(callback);
            }, self);
        }
    });
};

//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/EnterpriseClient.js

/**
 * Copyright (c) 2015, 2017, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

/**
 * EnterpriseClient is a enterprise application, client of the
 * Oracle IoT Cloud Service.
 * <p>
 * This function is meant to be used for constructing EnterpriseClient objects
 * only when the actual id of the application associated with the object is known.
 * An actual validation of the application id with the cloud is not be made at
 * construction and is the application id is incorrect a NOT FOUND error from the cloud will
 * be given when the object is actually used (e.g. when calling {@link
 * iotcs.enterprise.EnterpriseClient#getDevices}).
 * <p>
 * If the actual application id is not known is is better to use the
 * {@link iotcs.enterprise.EnterpriseClient.newClient} method for creating
 * EnterpriseClient objects, an asynchrounous method that will first make
 * a request at the cloud server for validation and then pass in the callback
 * the validated object. This will ensure that no NOT FOUND error is given at
 * first usage of the object.
 *
 * @see {@link iotcs.enterprise.EnterpriseClient.newClient}
 * @memberOf iotcs.enterprise
 * @alias EnterpriseClient
 *
 * @param {string} appid - The application identifier as it is in the cloud.
 * This is the actual application id generated by the server when creating a new
 * application from the cloud UI. It is different then the integration id or
 * application mane.
 * @param {string} [taStoreFile] - trusted assets store file path
 * to be used for trusted assets manager creation. This is optional.
 * If none is given the default global library parameter is used:
 * lib.oracle.iot.tam.store. Also this is used only in the context
 * of endpoint authentication.
 * @param {string} [taStorePassword] - trusted assets store file password
 * to be used for trusted assets manager creation. This is optional.
 * If none is given the default global library parameter is used:
 * lib.oracle.iot.tam.storePassword. Also this is used only in the context
 * of endpoint authentication.
 *
 * @class
 * @extends iotcs.Client
 */
lib.enterprise.EnterpriseClient = function (appid, taStoreFile, taStorePassword) {

    _mandatoryArg(appid, 'string');
    _optionalArg(taStoreFile, 'string');
    _optionalArg(taStorePassword, 'string');

    lib.Client.call(this);

    if(appid.indexOf('/') > -1){
        lib.error('invalid app id parameter given');
        return;
    }

    this.cache = this.cache || {};

    Object.defineProperty(this, '_',{
        enumerable: false,
        configurable: false,
        writable: false,
        value: {}
    });

    if (!$port.userAuthNeeded()) {
        var internal = new $impl.EnterpriseClientImpl(taStoreFile, taStorePassword);
        if (internal && internal._.tam && internal._.tam.getClientId()) {
            Object.defineProperty(this._, 'internalClient', {
                enumerable: false,
                configurable: false,
                writable: false,
                value: internal
            });
        }
    }

    Object.defineProperty(this, 'appid',{
        enumerable: true,
        configurable: false,
        writable: false,
        value: appid
    });

    Object.defineProperty(this._, 'bulkMonitorInProgress',{
        enumerable: false,
        configurable: false,
        writable: true,
        value: false
    });

    Object.defineProperty(this._, 'lastUntil',{
        enumerable: false,
        configurable: false,
        writable: true,
        value: null
    });

    Object.defineProperty(this._, 'virtualDevices',{
        enumerable: false,
        configurable: false,
        writable: false,
        value: {}
    });

    var self = this;

    Object.defineProperty(this._, 'removeVirtualDevice',{
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(device) {
            if (self._.virtualDevices[device.getEndpointId()]) {
                if (self._.virtualDevices[device.getEndpointId()][device.getDeviceModel().urn]) {
                    delete self._.virtualDevices[device.getEndpointId()][device.getDeviceModel().urn];
                }
                if (Object.keys(self._.virtualDevices[device.getEndpointId()]).length === 0) {
                    delete self._.virtualDevices[device.getEndpointId()];
                }
            }
        }
    });

    Object.defineProperty(this._, 'addVirtualDevice',{
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(device){
            self._.removeVirtualDevice(device);
            if (!self._.virtualDevices[device.getEndpointId()]) {
                self._.virtualDevices[device.getEndpointId()] = {};
            }
            self._.virtualDevices[device.getEndpointId()][device.getDeviceModel().urn] = device;
        }
    });

    if (!$port.userAuthNeeded()) {
        Object.defineProperty(this._, 'isStorageAuthenticated', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function () {
                return internal._.storageContainerUrl && internal._.storage_authToken;
            }
        });

        Object.defineProperty(this._, 'isStorageTokenExpired', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function () {
                // period in minutes recalculated in milliseconds
                return ((internal._.storage_authTokenStartTime + lib.oracle.iot.client.storageTokenPeriod * 60000) < Date.now());
            }
        });

        Object.defineProperty(this._, 'sync_storage', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (storage, deliveryCallback, errorCallback, processCallback, timeout) {
                if (!self._.isStorageAuthenticated() || self._.isStorageTokenExpired()) {
                    internal._.refresh_storage_authToken(function() {
                        self._.sync_storage(storage, deliveryCallback, errorCallback, processCallback, timeout);
                    });
                    return;
                }
                var urlObj = require('url').parse(storage.getURI(), true);
                var options = {
                    path: urlObj.path,
                    host: urlObj.host,
                    hostname: urlObj.hostname,
                    port: urlObj.port || lib.oracle.iot.client.storageCloudPort,
                    protocol: urlObj.protocol.slice(0, -1),
                    headers: {
                        'X-Auth-Token': internal._.storage_authToken
                    }
                };

                if (storage.getInputStream()) {
                    // Upload file
                    options.method = "PUT";
                    options.headers['Transfer-Encoding'] = "chunked";
                    options.headers['Content-Type'] = storage.getType();
                    var encoding = storage.getEncoding();
                    if (encoding) options.headers['Content-Encoding'] = encoding;
                } else {
                    // Download file
                    options.method = "GET";
                }

                $port.https.storageReq(options, storage, deliveryCallback, function(error) {
                    if (error) {
                        var exception = null;
                        try {
                            exception = JSON.parse(error.message);
                            if (exception.statusCode && (exception.statusCode === 401)) {
                                internal._.refresh_storage_authToken(function () {
                                    self._.sync_storage(storage, deliveryCallback, errorCallback, processCallback, timeout);
                                });
                                return;
                            }
                        } catch (e) {}
                        errorCallback(storage, error, -1);
                    }
                }, processCallback);
            }
        });

        Object.defineProperty(this._, 'createStorageObject', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (arg1, arg2) {
                _mandatoryArg(arg1, "string");
                if ((typeof arg2 === "string") || (typeof arg2 === "undefined") || arg2 === null) {
                    // createStorageObject(name, type)
                    return new lib.StorageObject(null, arg1, arg2);
                } else {
                    // createStorageObject(uri, callback)
                    _mandatoryArg(arg2, "function");
                    var url = arg1;
                    var callback = arg2;
                    if (!self._.isStorageAuthenticated() || self._.isStorageTokenExpired()) {
                        internal._.refresh_storage_authToken(function() {
                            self._.createStorageObject(url, callback);
                        });
                    } else {
                        var fullContainerUrl = internal._.storageContainerUrl + "/";
                        // url starts with fullContainerUrl
                        if (url.indexOf(fullContainerUrl) !== 0) {
                            callback(null, new Error("Storage Cloud URL is invalid."));
                            return;
                        }
                        var name = url.substring(fullContainerUrl.length);
                        var urlObj = require('url').parse(url, true);
                        var options = {
                            path: urlObj.path,
                            host: urlObj.host,
                            hostname: urlObj.hostname,
                            port: urlObj.port || lib.oracle.iot.client.storageCloudPort,
                            protocol: urlObj.protocol,
                            method: "HEAD",
                            headers: {
                                'X-Auth-Token': internal._.storage_authToken
                            },
                            rejectUnauthorized: true,
                            agent: false
                        };
                        var req = require('https').request(options, function (response) {
                            var body = '';
                            response.on('data', function (d) {
                                body += d;
                            });
                            response.on('end', function () {
                                if (response.statusCode === 200) {
                                    var type = response.headers["content-type"];
                                    var encoding = response.headers["content-encoding"];
                                    var date = new Date(Date.parse(response.headers["last-modified"]));
                                    var len = parseInt(response.headers["content-length"]);
                                    var storage = new lib.StorageObject(url, name, type, encoding, date, len);
                                    callback(storage);
                                } else if (response.statusCode === 401) {
                                    internal._.refresh_storage_authToken(function () {
                                        self._.createStorageObject(url, callback);
                                    });
                                } else {
                                    var e = new Error(JSON.stringify({
                                        statusCode: response.statusCode,
                                        statusMessage: (response.statusMessage ? response.statusMessage : null),
                                        body: body
                                    }));
                                    callback(null, e);
                                }
                            });
                        });
                        req.on('timeout', function () {
                            callback(null, new Error('connection timeout'));
                        });
                        req.on('error', function (error) {
                            callback(null, error);
                        });
                        req.end();
                    }
                }
            }
        });

        var storageHandler = function (progress, error) {
            var storage = progress.getStorageObject();
            if (error) {
                if (storage._.deviceForSync && storage._.deviceForSync.onError) {
                    var tryValues = {};
                    tryValues[storage._.nameForSyncEvent] = storage.getURI();
                    var onDeviceErrorTuple = {
                        newValues: tryValues,
                        tryValues: tryValues,
                        errorResponse: error
                    };
                    storage._.deviceForSync.onError(onDeviceErrorTuple);
                }
                return;
            }
            if (storage) {
                var state = progress.getState();
                var oldSyncStatus = storage.getSyncStatus();
                switch (state) {
                    case lib.StorageDispatcher.Progress.State.COMPLETED:
                        storage._.internal.syncStatus = lib.enterprise.StorageObject.SyncStatus.IN_SYNC;
                        break;
                    case lib.StorageDispatcher.Progress.State.CANCELLED:
                    case lib.StorageDispatcher.Progress.State.FAILED:
                        storage._.internal.syncStatus = lib.enterprise.StorageObject.SyncStatus.SYNC_FAILED;
                        break;
                    case lib.StorageDispatcher.Progress.State.IN_PROGRESS:
                    case lib.StorageDispatcher.Progress.State.INITIATED:
                    case lib.StorageDispatcher.Progress.State.QUEUED:
                    // do nothing
                }
                if (oldSyncStatus !== storage.getSyncStatus()) {
                    if (storage._.onSync) {
                        var syncEvent;
                        while ((syncEvent = storage._.internal.syncEvents.pop()) !== null) {
                            storage._.onSync(syncEvent);
                        }
                    }
                }
            }
        };
        new lib.enterprise.StorageDispatcher(this).onProgress = storageHandler;
    }

    this.monitor = new $impl.Monitor(function(){
        _remoteBulkMonitor(self);
    });
    this.monitor.start();
};

lib.enterprise.EnterpriseClient.prototype = Object.create(lib.Client.prototype);
lib.enterprise.EnterpriseClient.constructor = lib.enterprise.EnterpriseClient;

/**
 * Creates an enterprise client based on the application name.
 *
 * @param {string} appName - The application name as it is on
 * the cloud server.
 * @param {function} callback - The callback function. This function is called with
 * an object as parameter that is a created and initialized instance of an
 * EnterpriseClient with the application endpoint id associated with the application
 * name given as parameter. If the client creation fails the client object
 * will be null and an error object is passed as the second parameter in the
 * callback: callback(client, error) where the reason is in error.message
 * @param {string} [taStoreFile] - trusted assets store file path
 * to be used for trusted assets manager creation. This is optional.
 * If none is given the default global library parameter is used:
 * lib.oracle.iot.tam.store. Also this is used only in the context
 * of endpoint authentication.
 * @param {string} [taStorePassword] - trusted assets store file password
 * to be used for trusted assets manager creation. This is optional.
 * If none is given the default global library parameter is used:
 * lib.oracle.iot.tam.storePassword. Also this is used only in the context
 * of endpoint authentication.
 *
 * @see {@link iotcs.enterprise.EnterpriseClient}
 * @memberof iotcs.enterprise.EnterpriseClient
 * @function newClient
 */
lib.enterprise.EnterpriseClient.newClient = function (appName, callback, taStoreFile, taStorePassword) {

    switch (arguments.length) {
        case 0:
            break;
        case 1:
            callback = appName;
            break;
        case 2:
            _mandatoryArg(appName, 'string');
            break;
        case 3:
            callback = arguments[0];
            taStoreFile = arguments[1];
            taStorePassword = arguments[2];
            appName = null;
            break;
    }

    _mandatoryArg(callback, 'function');
    _optionalArg(taStoreFile, 'string');
    _optionalArg(taStorePassword, 'string');

    var client = null;
    var f = null;

    if (!$port.userAuthNeeded()) {
        client = new lib.enterprise.EnterpriseClient('none', taStoreFile, taStorePassword);
    }
    if (client && client._.internalClient._.tam.getClientId()) {
        f = (new lib.enterprise.Filter()).eq('integrations.id', client._.internalClient._.tam.getClientId());
    } else {
        f = (new lib.enterprise.Filter()).eq('name', appName);
    }

    var request = null;

    request = function () {
        $impl.https.bearerReq({
            method: 'GET',
            path: $impl.reqroot
            + '/apps'
            + (f ? ('?q=' + f.toString()) : '')
        }, '', function (response, error) {
            if ((!response) || error
                || (!response.items)
                || (!Array.isArray(response.items))
                || (response.items.length !== 1)
                || (!response.items[0].id)) {
                if (typeof callback === 'function')
                    callback(null, lib.createError('invalid response on client creation request', error));
                return;
            }
            try {
                if (appName && (response.items[0].name !== appName)) {
                    if (typeof callback === 'function')
                        callback(null, lib.createError('application name does not match the name parameter'));
                    return;
                }
                if (client) {
                    client.close();
                }
                client = new lib.enterprise.EnterpriseClient(response.items[0].id, taStoreFile, taStorePassword);
                if (typeof callback === 'function') {
                    callback(client);
                }
            } catch (e) {
                if (typeof callback === 'function')
                    callback(null, lib.createError('invalid response on client creation request', e));
            }
        }, request, (client ? client._.internalClient : null));
    };
    request();
};

/**
 * Get the all the applications that the user has access to.
 *
 * @returns {iotcs.enterprise.Pageable} A pageable instance with
 * which pages can be requested that contain application info
 * objects as items
 *
 * @memberof iotcs.enterprise.EnterpriseClient
 * @function getApplications
 */
lib.enterprise.EnterpriseClient.getApplications = function () {

    if (!$port.userAuthNeeded()) {
        lib.error('invalid usage; user authentication framework needed');
        return null;
    }

    return new lib.enterprise.Pageable({
        method: 'GET',
        path:   $impl.reqroot
        + '/apps'
    }, '', null, null);

};

/**
 * Create a VirtualDevice instance with the given device model
 * for the given device identifier. This method creates a new
 * VirtualDevice instance for the given parameters. The client
 * library does not cache previously created VirtualDevice
 * objects.
 * <p>
 * A device model can be obtained by it's afferent urn with the
 * EnterpriseClient if it is registered on the cloud.
 *
 * @param {string} endpointId - The endpoint identifier of the
 * device being modeled.
 * @param {object} deviceModel - The device model object
 * holding the full description of that device model that this
 * device implements.
 * @returns {iotcs.enterprise.VirtualDevice} The newly created virtual device
 *
 * @see {@link iotcs.enterprise.EnterpriseClient#getDeviceModel}
 * @memberof iotcs.enterprise.EnterpriseClient.prototype
 * @function createVirtualDevice
 */
lib.enterprise.EnterpriseClient.prototype.createVirtualDevice = function (endpointId, deviceModel) {
    _mandatoryArg(endpointId, 'string');
    _mandatoryArg(deviceModel, 'object');
    return new lib.enterprise.VirtualDevice(endpointId, deviceModel, this);
};

/**
 * Get the application information that this enterprise client is associated with.
 *
 * @param {function} callback - The callback function. This function is called with the following argument:
 * an appinfo object holding all data and metadata associated to that appid e.g.
 * <code>{ id:"", name:"", description:"", metadata: { key1:"value1", key2:"value2", ... } }</code>.
 * If an error occurs or the response is invalid an error object is passed in callback
 * as the second parameter with the reason in error.message: callback(response, error)
 *
 * @memberof iotcs.enterprise.EnterpriseClient.prototype
 * @function getApplication
 */
lib.enterprise.EnterpriseClient.prototype.getApplication = function (callback) {
    _mandatoryArg(callback, 'function');

    var self = this;

    $impl.https.bearerReq({
        method: 'GET',
        path:   $impl.reqroot
            + '/apps/' + this.appid
    }, '', function(response, error) {
        if(!response || error || !response.id){
            callback(null, lib.createError('invalid response on application request', error));
            return;
        }
        var appinfo = response;
        Object.freeze(appinfo);
        callback(appinfo);
    }, function () {
        self.getApplication(callback);
    }, self._.internalClient);
};

/**
 * Get the device models associated with the application of
 * this enterprise client.
 *
 * @returns {iotcs.enterprise.Pageable} A pageable instance with
 * which pages can be requested that contain device models
 * associated with the application as items. An item can be used
 * to create VirtualDevices.
 *
 * @memberof iotcs.enterprise.EnterpriseClient.prototype
 * @function getDeviceModels
 */
lib.enterprise.EnterpriseClient.prototype.getDeviceModels = function () {
    return new lib.enterprise.Pageable({
        method: 'GET',
        path:   $impl.reqroot
            + '/apps/' + this.appid
            + '/deviceModels'
    }, '', null, this);
};

/**@inheritdoc*/
lib.enterprise.EnterpriseClient.prototype.getDeviceModel = function (deviceModelUrn, callback) {
    _mandatoryArg(deviceModelUrn, 'string');
    _mandatoryArg(callback, 'function');

    var deviceModel = this.cache.deviceModels[deviceModelUrn];
    if (deviceModel) {
        callback(deviceModel);
        return;
    }
    
    var f = (new lib.enterprise.Filter()).eq('urn', deviceModelUrn);
    var self = this;
    $impl.https.bearerReq({
        method: 'GET',
        path:   $impl.reqroot
            + '/apps/' + this.appid
            + '/deviceModels'
            + '?q=' + f.toString()
    }, '', function (response, error) {
        if((!response) || error
           || (!response.items)
           || (!Array.isArray(response.items))
           || (response.items.length !== 1)) {
            callback(null, lib.createError('invalid response on get device model request', error));
            return;
        }
        var deviceModel = response.items[0];
        Object.freeze(deviceModel);
        self.cache.deviceModels[deviceModelUrn] = deviceModel;
        callback(deviceModel);
    }, function () {
        self.getDeviceModel(deviceModelUrn, callback);
    }, self._.internalClient);
};

/**
 * Get the list of all active devices implementing the
 * specified device model and application of the client.
 *
 * @param {string} deviceModelUrn - The device model expected.
 * @returns {iotcs.enterprise.Pageable} A pageable instance with
 * which pages can be requested that contain devices as items.
 * A standard device item would have the "id" property that can
 * be used as endpoint id for creating virtual devices.
 *
 * @memberof iotcs.enterprise.EnterpriseClient.prototype
 * @function getActiveDevices
 */
lib.enterprise.EnterpriseClient.prototype.getActiveDevices = function (deviceModelUrn) {
    _mandatoryArg(deviceModelUrn, 'string');
    var f = new lib.enterprise.Filter();
    f = f.and([f.eq('deviceModels.urn', deviceModelUrn), f.eq('connectivityStatus', 'ONLINE'), f.eq('state','ACTIVATED')]);
    return this.getDevices(f, null);
};


//@TODO: (JY) simplify query builder ...

/**
 * Return a list of Devices associated with the application of the client.
 * The returned fields are limited to the fields defined in
 * fields. Filters forms a query.
 * Only endpoints that satisfy all the statements in filters
 * are returned.
 *
 * @param {iotcs.enterprise.Filter} filter - A filter as generated by the
 * Filter class.
 * @param {string[]} [fields] - Array of fields for the selected endpoint. Can be null.
 *
 * @returns {iotcs.enterprise.Pageable} A pageable instance with
 * which pages can be requested that contain devices as items
 *
 * @memberof iotcs.enterprise.EnterpriseClient.prototype
 * @function getDevices
 */
lib.enterprise.EnterpriseClient.prototype.getDevices = function (filter, fields) {
    _mandatoryArg(filter, lib.enterprise.Filter);
    _optionalArg(fields, 'array');

    var query = '?q=' + filter.toString();
    if (fields) {
        query += '&fields=' + fields.toString();
    }
    query = query + '&includeDecommissioned=false&expand=location,metadata';

    return new lib.enterprise.Pageable({
        method: 'GET',
        path:   $impl.reqroot
            + '/apps/' + this.appid
            + '/devices'
            + query
    }, '', null, this);
};

/**
 * Closes the resources used by this Client.
 * This will close all the virtual devices
 * created and associated with this enterprise
 * client.
 *
 * @see {@link iotcs.AbstractVirtualDevice#close}
 * @memberof iotcs.enterprise.EnterpriseClient.prototype
 * @function close
 */
lib.enterprise.EnterpriseClient.prototype.close = function () {
    this.monitor.stop();
    this.cache.deviceModels = {};
    for (var key in this._.virtualDevices) {
        for (var key1 in this._.virtualDevices[key]) {
            this._.virtualDevices[key][key1].close();
        }
    }
};

/**
 * Create a new {@link iotcs.enterprise.StorageObject}.
 *
 * <p>
 * createStorageObject method works in two modes:
 * </p><p>
 * 1. client.createStorageObject(name, type) -
 * Create a new {@link iotcs.enterprise.StorageObject} with given object name and mime&ndash;type.
 * </p><pre>
 * Parameters:
 * {String} name - the unique name to be used to reference the content in storage
 * {?String} [type] - The mime-type of the content. If <code>type</code> is <code>null</code> or omitted,
 * the mime&ndash;type defaults to {@link iotcs.StorageObject.MIME_TYPE}.
 *
 * Returns:
 * {iotcs.enterprise.StorageObject} StorageObject
 * </pre><p>
 * 2. client.createStorageObject(uri, callback) -
 * Create a new {@link iotcs.enterprise.StorageObject} from the URL for a named object in storage and return it in a callback.
 * Create a new {@link iotcs.ExternalObject} if used external URI.
 * </p><pre>
 * Parameters:
 * {String} url - the URL of the object in the storage cloud
 * {function(storage, error)} callback - callback called once the getting storage data completes.
 * </pre>
 *
 * @param {String} arg1 - first argument
 * @param {String | function} arg2 - second argument
 *
 * @see {@link http://www.iana.org/assignments/media-types/media-types.xhtml|IANA Media Types}
 * @memberOf iotcs.enterprise.EnterpriseClient.prototype
 * @function createStorageObject
 */
lib.enterprise.EnterpriseClient.prototype.createStorageObject = function (arg1, arg2) {
    _mandatoryArg(arg1, "string");
    var self = this;
    if ((typeof arg2 === "string") || (typeof arg2 === "undefined") || arg2 === null) {
        // createStorageObject(name, type)
        var storage = new lib.enterprise.StorageObject(null, arg1, arg2);
        storage._.setDevice(self);
        return storage;
    } else {
        // createStorageObject(uri, callback)
        _mandatoryArg(arg2, "function");
        var url = arg1;
        var callback = arg2;
        if (_isStorageCloudURI(url)) {
            this._.createStorageObject(url, function (storage, error) {
                if (error) {
                    callback(null, error);
                    return;
                }
                var storageObject = new lib.enterprise.StorageObject(storage.getURI(), storage.getName(),
                    storage.getType(), storage.getEncoding(), storage.getDate(), storage.getLength());
                storageObject._.setDevice(self);
                callback(storageObject);
            });
        } else {
            callback(new lib.ExternalObject(url));
        }
    }
};

/** @ignore */
function _deviceMonitorInitialization(virtualDevice) {

    var deviceId = virtualDevice.getEndpointId();
    var urn = virtualDevice.getDeviceModel().urn;

    var postData = {};
    postData[deviceId] = [urn];

    if (!virtualDevice.client._.lastUntil) {
        virtualDevice.client._.lastUntil = Date.now()-lib.oracle.iot.client.monitor.pollingInterval;
    }

    $impl.https.bearerReq({
        method: 'POST',
        path:   $impl.reqroot
        + (virtualDevice.client.appid ? ('/apps/' + virtualDevice.client.appid) : '')
        + '/devices/data'
        + '?formatLimit=' + lib.oracle.iot.client.monitor.formatLimit
        + '&formatSince=' + virtualDevice.client._.lastUntil
    }, JSON.stringify(postData), function (response, error) {

        if (!response || error || !response.data || !response.until
            || !(deviceId in response.data)
            || !(urn in response.data[deviceId])) {
            lib.createError('invalid response on device initialization data');
        } else {
            virtualDevice.client._.lastUntil = response.until;
            _processMonitorData(response.data, virtualDevice);
        }

        virtualDevice.client._.addVirtualDevice(virtualDevice);

    }, function () {
        _deviceMonitorInitialization(virtualDevice);
    }, virtualDevice.client._.internalClient);

}

//////////////////////////////////////////////////////////////////////////////

/** @ignore */
function _remoteBulkMonitor(client) {

    if (client._.bulkMonitorInProgress) {
        return;
    }

    client._.bulkMonitorInProgress = true;

    if (!client._.virtualDevices) {
        client._.bulkMonitorInProgress = false;
        return;
    }

    var devices = client._.virtualDevices;
    var postData = {};

    for (var devId in devices) {
        var deviceModels = devices[devId];
        postData[devId] = [];
        for (var urn in deviceModels) {
            postData[devId].push(urn);
        }
    }

    if (Object.keys(postData).length > 0) {
        $impl.https.bearerReq({
            method: 'POST',
            path:   $impl.reqroot
            + (client.appid ? ('/apps/' + client.appid) : '')
            + '/devices/data'
            + '?since=' + client._.lastUntil
            + '&formatLimit=' + lib.oracle.iot.client.monitor.formatLimit
        }, JSON.stringify(postData), function (response, error) {
            client._.bulkMonitorInProgress = false;
            if (!response || error || !response.until || !response.data) {
                lib.createError('invalid response on monitoring');
                return;
            }
            client._.lastUntil = response.until;
            var data = response.data;
            for (var devId in data) {
                for (var urn in data[devId]){
                    if (devices[devId] && devices[devId][urn]) {
                        _processMonitorData(data, devices[devId][urn]);
                    }
                }
            }
        }, function () {
            _remoteBulkMonitor(client);
        }, client._.internalClient);
    } else {
        client._.bulkMonitorInProgress = false;
    }

}

/** @ignore */
function _processMonitorData(data, virtualDevice) {
    var deviceId = virtualDevice.getEndpointId();
    var urn = virtualDevice.getDeviceModel().urn;
    var onChangeArray = [];
    if (data[deviceId][urn].attributes) {
        var attributesIndex = 0;
        var attributes = data[deviceId][urn].attributes;
        var attributeCallback = function (attributeValue) {
            var onChangeTuple = {
                attribute: attribute,
                newValue: attributeValue,
                oldValue: oldValue
            };
            if (attribute.onChange) {
                attribute.onChange(onChangeTuple);
            }
            attribute._.remoteUpdate(attributeValue);
            onChangeArray.push(onChangeTuple);
            if (++attributesIndex === Object.keys(attributes).length) {
                // run after last attribute handle
                if (virtualDevice.onChange) {
                    virtualDevice.onChange(onChangeArray);
                }
            }
        };
        for (var attributeName in attributes) {
            var attribute = virtualDevice[attributeName];
            if (!attribute) {
                lib.createError('device model attribute mismatch on monitoring');
                return;
            }
            var oldValue = attribute.value;
            if (!attribute._.isValidValue(attributes[attributeName])) {
                continue;
            }
            attribute._.getNewValue(attributes[attributeName], virtualDevice, attributeCallback);
        }
    }

    if (data[deviceId][urn].formats) {
        var formats = data[deviceId][urn].formats;
        var alerts = {};
        var dataFormats = {};
        var formatsIndex = 0;
        var formatsUpdateCallback = function () {
            if (obj.onAlerts) {
                alerts[formatUrn] = formats[formatUrn];
                obj.onAlerts(formats[formatUrn]);
            }
            else if (obj.onData) {
                dataFormats[formatUrn] = formats[formatUrn];
                obj.onData(formats[formatUrn]);
            }
            if (++formatsIndex === Object.keys(formats).length) {
                // run after last format handle
                if (virtualDevice.onAlerts && (Object.keys(alerts).length > 0)) {
                    virtualDevice.onAlerts(alerts);
                }
                if (virtualDevice.onData && (Object.keys(dataFormats).length > 0)) {
                    virtualDevice.onData(dataFormats);
                }
            }
        };
        for (var formatUrn in formats) {
            var obj = virtualDevice[formatUrn];
            if (!obj) {
                lib.createError('device model alert/data format mismatch on monitoring');
                return;
            }
            
            obj._.formatsLocalUpdate(formats[formatUrn], virtualDevice, formatsUpdateCallback);
        }
    }
}


//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/Filter.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and 
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

/**
 * Creates a Filter builder object.
 * This class allows to easily formulate filter queries and
 * convert straight to Json Queries. 
 *
 * @example
 * var f = new iotcs.enterprise.Filter();
 * f = f.and([
 *     f.eq("name","Andrew"),
 *     f.or([f.not(f.in("maritalStatus", ["MARRIED", "SINGLE"])),
 *           f.gte("children.count", 1)]),
 *     f.gt("salary.rank", 3),
 *     f.lte("salary.rank", 7),
 *     f.like("lastName", "G%")
 * ]);
 * lib.log(f.stringify());
 * // '{"$and":[{"name":{"$eq":"Andrew"}},{"$or":[{"$not":{"maritalStatus":{"$in":["MARRIED","SINGLE"]}}},{"children.count":{"$gte":1}}]},{"salary.rank":{"$gt":3}},{"salary.rank":{"$lte":7}},{"lastName":{"$like":"G%"}}]}';
 *
 * @memberOf iotcs.enterprise
 * @alias Filter
 * @class
 */
lib.enterprise.Filter = function (query) {
    this.query = query || {};
};

/**
 * Converts this filter into a JSON object
 *
 * @memberof iotcs.enterprise.Filter.prototype
 * @function toJSON
 */
lib.enterprise.Filter.prototype.toJSON = function () {
    return this.query;
};

/**
 * Returns a string containing a stringified version of the current filter
 *
 * @memberof iotcs.enterprise.Filter.prototype
 * @function toString
 */
lib.enterprise.Filter.prototype.toString = function () {
    return JSON.stringify(this.query);
};

/**
 * Alias for toString
 *
 * @memberof iotcs.enterprise.Filter.prototype
 * @function stringify
 */
lib.enterprise.Filter.prototype.stringify = lib.enterprise.Filter.prototype.toString;

/**
 * Equality operator
 * <p>
 * Note that if the value string does contain a <code>%</code>, 
 * then this operation is replaced by the 
 * {@link iotcs.enterprise.Filter#like like} operation.
 *
 * @param {string} field - the field name
 * @param {(string|number)} value - the value to compare the field
 * against. Values can only be simple types such as numbers or
 * string. 
 * @returns {iotcs.enterprise.Filter} a new Filter expressing this operation
 * @memberof iotcs.enterprise.Filter.prototype
 * @function eq
 */
lib.enterprise.Filter.prototype.eq = function (field, value) {
    if (_is(field, ['string']) &&
        _is(value, ['string', 'number'])) {
        var query = {};
        if ((typeof value === 'string') && (value.indexOf('%')>=0)) {
            lib.log('$eq value field contains a "%". Operation replaced into a $like');
            query[field] = {"$like":value};
        } else {
            query[field] = {"$eq":value};
        }
        return new lib.enterprise.Filter(query);
    }
    return null;
};

/**
 * Greater-than operator 
 *
 * @param {string} field - the field name
 * @param {number} value - the value to compare the field
 * against. Values can only be simple types such as numbers or
 * string. 
 * @returns {iotcs.enterprise.Filter} a new Filter expressing this operation
 * @memberof iotcs.enterprise.Filter.prototype
 * @function gt
 */
lib.enterprise.Filter.prototype.gt = function (field, value) {
    if (_is(field, ['string']) &&
        _is(value, ['number'])) {
        var query = {};
        query[field] = {"$gt":value};
        return new lib.enterprise.Filter(query);
    }
    return null;
};

/**
 * Greater-than-or-equal operator
 *
 * @param {string} field - the field name
 * @param {number} value - the value to compare the field
 * against. Values can only be simple types such as numbers or
 * string. 
 * @returns {iotcs.enterprise.Filter} a new Filter expressing this operation
 * @memberof iotcs.enterprise.Filter.prototype
 * @function gte
 */
lib.enterprise.Filter.prototype.gte = function (field, value) {
    if (_is(field, ['string']) &&
        _is(value, ['number'])) {
        var query = {};
        query[field] = {"$gte":value};
        return new lib.enterprise.Filter(query);
    }
    return null;
};

/**
 * Less-than operator
 *
 * @param {string} field - the field name
 * @param {number} value - the value to compare the field
 * against. Values can only be simple types such as numbers or
 * string. 
 * @returns {iotcs.enterprise.Filter} a new Filter expressing this operation
 * @memberof iotcs.enterprise.Filter.prototype
 * @function lt
 */
lib.enterprise.Filter.prototype.lt = function (field, value) {
    if (_is(field, ['string']) &&
        _is(value, ['number'])) {
        var query = {};
        query[field] = {"$lt":value};
        return new lib.enterprise.Filter(query);
    }
    return null;
};

/**
 * Less-than-or-equal operator
 *
 * @param {string} field - the field name
 * @param {number} value - the value to compare the field
 * against. Values can only be simple types such as numbers or
 * string. 
 * @returns {iotcs.enterprise.Filter} a new Filter expressing this operation
 * @memberof iotcs.enterprise.Filter.prototype
 * @function lte
 */
lib.enterprise.Filter.prototype.lte = function (field, value) {
    if (_is(field, ['string']) &&
        _is(value, ['number'])) {
        var query = {};
        query[field] = {"$lte":value};
        return new lib.enterprise.Filter(query);
    }
    return null;
};

/**
 * Not-equal operator
 *
 * @param {string} field - the field name
 * @param {(string|number)} value - the value to compare the field
 * against. Values can only be simple types such as numbers or
 * string. 
 * @returns {iotcs.enterprise.Filter} a new Filter expressing this operation
 * @memberof iotcs.enterprise.Filter.prototype
 * @function ne
 */
lib.enterprise.Filter.prototype.ne = function (field, value) {
    if (_is(field, ['string']) &&
        _is(value, ['string', 'number'])) {
        var query = {};
        query[field] = {"$ne":value};
        return new lib.enterprise.Filter(query);
    }
    return null;
};

/**
 * Is-in operator.
 * <p>
 * Checks whether the field's value is one of the proposed values.
 * 
 * @param {string} field - the field name
 * @param {(string[]|number[])} valuearray - an array of same typed
 * values to test the field against. Values can only be simple
 * types such as numbers or string. 
 * @returns {iotcs.enterprise.Filter} a new Filter expressing this operation
 * @memberof iotcs.enterprise.Filter.prototype
 * @function in
 */
lib.enterprise.Filter.prototype.in = function (field, valuearray) {
    if (_is(field, ['string']) &&
        Array.isArray(valuearray)) {
        var type = null;
        for (var index in valuearray) {
            var value = valuearray[index];
            if (!type && _is(value, ['string', 'number'])) {
                type = typeof value;
            } else if (typeof value !== type) {
                lib.error('inconsistent value types in $in valuearray');
                return null;
            }
        }
        var query = {};
        query[field] = {"$in":valuearray};
        return new lib.enterprise.Filter(query);
    }
    return null;
};

/**
 * Exists operator.
 * <p>
 * Checks whether the field's value matches the given boolean state.
 *
 * @param {string} field - the field name
 * @param {boolean} state - the boolean to test field against
 * @returns {iotcs.enterprise.Filter} a new Filter expressing this operation
 * @memberof iotcs.enterprise.Filter.prototype
 * @function exists
 */
lib.enterprise.Filter.prototype.exists = function (field, state) {
    if (_is(field, ['string']) &&
        _is(state, ['boolean'])) {
        var query = {};
        query[field] = {"$exists":state};
        return new lib.enterprise.Filter(query);
    }
    return null;
};

/**
 * Like operator.
 * <p>
 * Checks whether the field's value matches the search query. Use 
 * <code>%</code> in the match string as search jocker, e.g. 
 * <code>"jo%"</code>.
 * <p>
 * Note that if the match string does not contain any <code>%</code>, 
 * then this operation is replaced by the 
 * {@link iotcs.enterprise.Filter#eq eq} operation.
 *
 * @param {string} field - the field name
 * @param {string} match - the pattern matching string to test field against
 * @returns {iotcs.enterprise.Filter} a new Filter expressing this operation
 * @memberof iotcs.enterprise.Filter.prototype
 * @function like
 */
lib.enterprise.Filter.prototype.like = function (field, match) {
    if (_is(field, ['string']) &&
        _is(match, ['string'])) {
        var query = {};
        if (match.indexOf('%')<0) {
            lib.log('$eq match field does not contains any "%". Operation replaced into a $eq');
            query[field] = {"$eq":match};
        } else {
            query[field] = {"$like":match};
        }
        return new lib.enterprise.Filter(query);
    }
    return null;
};

/**
 * And operator.
 * <p>
 * Checks if all conditions are true.
 * <p>
 * This function takes either an array of iotcs.enterprise.Filter
 * or an indefinit number of iotcs.enterprise.Filter.
 * 
 * @param {(iotcs.enterprise.Filter[]|...iotcs.enterprise.Filter)} args - an array
 * or variable length argument list of filters to AND
 * @returns {iotcs.enterprise.Filter} a new Filter expressing this operation
 * @memberof iotcs.enterprise.Filter.prototype
 * @function and
 */
lib.enterprise.Filter.prototype.and = function (args) {
    var filters = null;
    if (Array.isArray(args)) {
        if (!_argsAreFilters(args)) {
            lib.error('invalid operation type(s)');
            return;
        }
        filters = args;
    } else {
        if (!_argsAreFilters(arguments)) {
            lib.error('invalid operation type(s)');
            return;
        }
        filters = [];
        for (var i=0; i<arguments.length; i++) {
            filters.push(arguments[i]);
        }
    }
    var query = {"$and":filters};
    return new lib.enterprise.Filter(query);
};

/**
 * Or operator.
 * <p>
 * Checks if at least one of the conditions is true.
 * <p>
 * This function takes either an array of iotcs.enterprise.Filter
 * or an indefinit number of iotcs.enterprise.Filter.
 *
 * @param {(iotcs.enterprise.Filter[]|...iotcs.enterprise.Filter)} args - an array
 * or variable length argument list of filters to OR
 * @returns {iotcs.enterprise.Filter} a new Filter expressing this operation
 * @memberof iotcs.enterprise.Filter.prototype
 * @function or
 */
lib.enterprise.Filter.prototype.or = function (args) {
    var filters = null;
    if (Array.isArray(args)) {
        if (!_argsAreFilters(args)) {
            lib.error('invalid operation type(s)');
            return;
        }
        filters = args;
    } else {
        if (!_argsAreFilters(arguments)) {
            lib.error('invalid operation type(s)');
            return;
        }
        filters = [];
        for (var i=0; i<arguments.length; i++) {
            filters.push(arguments[i]);
        }
    }
    var query = {"$or":filters};
    return new lib.enterprise.Filter(query);
};

/**
 * Not operator
 * <p>
 * Checks if the negative condition is true.
 *
 * @param {iotcs.enterprise.Filter} filter - a filter to negate
 * @memberof iotcs.enterprise.Filter.prototype
 * @function not
 */
lib.enterprise.Filter.prototype.not = function (filter) {
    if (!_argIsFilter(filter)) {
        lib.error('invalid type');
        return;
    }
    var query = {"$not":filter};
    return new lib.enterprise.Filter(query);
};

/** @ignore */
function _argIsFilter(arg) {
    return (arg instanceof lib.enterprise.Filter);
}

/** @ignore */
function _argsAreFilters(args) {
    if (Array.isArray(args)) {
        // args is []
        return args.every(function (arg) {
            return (arg instanceof lib.enterprise.Filter);
        });
    } else {
        // args are varargs
        for (var i = 0; i < args.length; i++) {
            if (! (args[i] instanceof lib.enterprise.Filter)) {
                return false;
            }
        }
        return true;
    }
}

/** @ignore */
function _is(parameter, types) {
    var ptype = typeof parameter;
    for(var index = 0; index < types.length; index++) {
        if (types[index] === ptype) {
            return true;
        }
    }
    lib.log('type is "'+ptype+'" but should be ['+types.toString()+']');
    lib.error('invalid parameter type for "'+parameter+'"');
    return false;
}


//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/VirtualDevice.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

//@TODO: jsdoc issue: MessageEnumerator appears in iotcs.* and not at index level (probably due to missing class jsdoc on lib.enterprise.MessageEnumerator) @DONE

/**
 * VirtualDevice is a representation of a device model
 * implemented by an endpoint. A device model is a
 * specification of the attributes, formats, and resources
 * available on the endpoint.
 * <p>
 * The VirtualDevice API is specific to the enterprise
 * client. Also it implements the device monitoring and
 * control specific to the enterprise client and the call
 * to an action method. Actions are defined in the device
 * model.
 * <p>
 * A device model can be obtained by it's afferent urn with the
 * EnterpriseClient if it is registered on the cloud.
 * <p>
 * The VirtualDevice has the attributes and actions of the device
 * model as properties and it provides functionality to the device
 * model in the following ways:
 * <p>
 * <b>Get the value of an attribute:</b><br>
 * <code>var value = device.temperature.value;</code><br>
 * <p>
 * <b>Get the last known value of an attribute:</b><br>
 * <code>var lastValue = device.temperature.lastKnownValue;</code><br>
 * <p>
 * <b>Set the value of an attribute (with update on cloud and error callback handling):</b><br>
 * <code>device.maxThreshold.onError = function (errorTuple);</code><br>
 * <code>device.maxThreshold.value = 27;</code><br>
 * where errorTuple is an object of the form
 * <code>{attribute: ... , newValue: ... , tryValue: ... , errorResponse: ...}</code>.
 * The library will throw an error in the value to update is invalid
 * according to the device model.
 * <p>
 * <b>Monitor a specific attribute for any value change (that comes from the cloud):</b><br>
 * <code>device.temperature.onChange = function (changeTuple);</code><br>
 * where changeTuple is an object of the form
 * <code>{attribute: ... , newValue: ... , oldValue: ...}</code>.
 * <p>
 * <b>Monitor all attributes for any value change (that comes from the cloud):</b><br>
 * <code>device.onChange = function (changeTuple);</code><br>
 * where changeTuple is an object with array type properties of the form
 * <code>[{attribute: ... , newValue: ... , oldValue: ...}]</code>.
 * <p>
 * <b>Monitor all update errors:</b><br>
 * <code>device.onError = function (errorTuple);</code><br>
 * where errorTuple is an object with array type properties (besides errorResponse) of the form
 * <code>{attributes: ... , newValues: ... , tryValues: ... , errorResponse: ...}</code>.
 * <p>
 * <b>Monitor a specific alert format for any alerts that where generated:</b><br>
 * <code>device.tooHot.onAlerts = function (alerts);</code><br>
 * where alerts is an array containing all the alerts generated of the specific format. An
 * alert is an object of the form:
 * <code>{eventTime: ... , severity: ... , fields: {field1: value1, field2: value2 ... }}</code>.
 * The onAlerts can be set also by urn:
 * <code>device['temperature:format:tooHot'].onAlerts = function (alerts);</code><br>
 * <p>
 * <b>Monitor all alerts generated for all formats:</b><br>
 * <code>device.onAlerts = function (alerts);</code><br>
 * where alerts is an object containing all the alert formats as keys and each has as value the above described array:
 * <code>{formatUrn1: [ ... ], formatUrn2: [ ... ], ... }</code>.
 * <p>
 * <b>Monitor a specific custom message format for any messages that where generated:</b><br>
 * <code>device.rfidDetected.onData = function (data);</code><br>
 * where data is an array containing all the custom data messages generated of the specific format. A
 * data object is an object of the form:
 * <code>{eventTime: ... , severity: ... , fields: {field1: value1, field2: value2 ... }}</code>.
 * The onData can be set also by urn:
 * <code>device['temperature:format:rfidDetected'].onData = function (data);</code><br>
 * <p>
 * <b>Monitor all custom data messages generated for all formats:</b><br>
 * <code>device.onData = function (data);</code><br>
 * where data is an object containing all the custom formats as keys and each has as value the above described array:
 * <code>{formatUrn1: [ ... ], formatUrn2: [ ... ], ... }</code>.
 * <p>
 * A VirtualDevice can also be created with the appropriate
 * parameters from the EnterpriseClient.
 *
 * @see {@link iotcs.enterprise.EnterpriseClient#getDeviceModel}
 * @see {@link iotcs.enterprise.EnterpriseClient#createVirtualDevice}
 * @param {string} endpointId - The endpoint id of this device
 * @param {object} deviceModel - The device model object
 * holding the full description of that device model that this
 * device implements.
 * @param {iotcs.enterprise.EnterpriseClient} client - The enterprise client
 * associated with the device application context.
 *
 * @class
 * @memberOf iotcs.enterprise
 * @alias VirtualDevice
 * @extends iotcs.AbstractVirtualDevice
 */
lib.enterprise.VirtualDevice = function (endpointId, deviceModel, client) {
    _mandatoryArg(endpointId, 'string');
    _mandatoryArg(deviceModel, 'object');
    _mandatoryArg(client, lib.enterprise.EnterpriseClient);

    lib.AbstractVirtualDevice.call(this, endpointId, deviceModel);

    this.client = client;
    this.controller = new $impl.Controller(this);

    this.attributes = this;

    var attributes = this.model.attributes;
    for (var indexAttr in attributes) {
        var attribute = new $impl.Attribute(attributes[indexAttr]);
        if (attributes[indexAttr].alias) {
            _link(attributes[indexAttr].alias, this, attribute);
        }
        _link(attributes[indexAttr].name, this, attribute);
    }

    this.actions = this;

    var actions = this.model.actions;
    for (var indexAction in actions) {
        var action = new $impl.Action(actions[indexAction]);
        if (actions[indexAction].alias) {
            _link(actions[indexAction].alias, this.actions, action);
        }
        _link(actions[indexAction].name, this.actions, action);
    }


    Object.defineProperty(this, 'onAlerts', {
        enumerable: true,
        configurable: false,
        get: function () {
            return this._.onAlerts;
        },
        set: function (newValue) {
            if (!newValue || (typeof newValue !== 'function')) {
                lib.error('trying to set something to onAlerts that is not a function!');
                return;
            }
            this._.onAlerts = newValue;
        }
    });
    this._.onAlerts = function (arg) {};

    Object.defineProperty(this, 'onData', {
        enumerable: true,
        configurable: false,
        get: function () {
            return this._.onData;
        },
        set: function (newValue) {
            if (!newValue || (typeof newValue !== 'function')) {
                lib.error('trying to set something to onData that is not a function!');
                return;
            }
            this._.onData = newValue;
        }
    });
    this._.onData = function (arg) {};

    var self = this;

    if (this.model.formats) {
        this.alerts = this;
        this.dataFormats = this;
        this.model.formats.forEach(function (format) {
            if (format.type && format.urn) {
                if (format.type === 'ALERT') {
                    var alert = new $impl.Alert(format);
                    if (format.name) {
                        _link(format.name, self.alerts, alert);
                    }
                    _link(format.urn, self.alerts, alert);
                }
                if (format.type === 'DATA') {
                    var data = new $impl.Data(format);
                    if (format.name) {
                        _link(format.name, self.dataFormats, data);
                    }
                    _link(format.urn, self.dataFormats, data);
                }
            }
        });
    }

    this._.isDeviceApp = 0;

    Object.preventExtensions(this);

    _deviceMonitorInitialization(self);

};

lib.enterprise.VirtualDevice.prototype = Object.create(lib.AbstractVirtualDevice.prototype);
lib.enterprise.VirtualDevice.constructor = lib.enterprise.VirtualDevice;

/**@inheritdoc */
lib.enterprise.VirtualDevice.prototype.update = function (attributes) {
    _mandatoryArg(attributes, 'object');
    if (Object.keys(attributes).length === 0) {
        return;
    }
    for (var attribute in attributes) {
        var value = attributes[attribute];
        if (attribute in this.attributes) {
            this.attributes[attribute]._.localUpdate(value, true); //XXX not clean
        } else {
            lib.error('unknown attribute "'+attribute+'"');
            return;
        }
    }
    if (this.controller) {
        this.controller.updateAttributes(attributes, false);
    }
};

/**@inheritdoc */
lib.enterprise.VirtualDevice.prototype.close = function () {
    if (this.controller) {
        this.controller.close();
    }
    if (this.client) {
        this.client._.removeVirtualDevice(this);
    }
    this.endpointId = null;
    this.onChange = function (arg) {};
    this.onError = function (arg) {};
    this.onAlerts = function (arg) {};
    this.controller = null;
};

/**
 * Execute an action. The library will throw an error if the action is not in the model
 * or if the argument is invalid (or not present when it should be). The actions
 * are as attributes properties of the virtual device.
 * <p>
 * The response from the cloud to the execution of the action can be retrieved by
 * setting a callback function to the onExecute property of the action:<br>
 * <code>device.reset.onExecute = function (response);</code><br>
 * <code>device.call('reset');</code><br>
 * where response is a JSON representation fo the response from the cloud if any.
 *
 * @param {string} actionName - The name of the action to execute
 * @param {Object} [arg] - An optional unique argument to pass
 * for action execution. This is specific to the action and description
 * of it is provided in the device model
 *
 * @memberof iotcs.enterprise.VirtualDevice.prototype
 * @function call
 */
lib.enterprise.VirtualDevice.prototype.call = function (actionName, arg) {
    _mandatoryArg(actionName, 'string');
    if (arguments.length > 2) {
        lib.error('invalid number of arguments');
    }
    var action = this[actionName];
    if (!action) {
        lib.error('action "'+actionName+'" is not executable');
        return;
    }
    this.controller.invokeAction(action.name, arg);
};



//////////////////////////////////////////////////////////////////////////////
// file: library/enterprise/TrustedAssetsManager.js

/**
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * This software is dual-licensed to you under the MIT License (MIT) and
 * the Universal Permissive License (UPL). See the LICENSE file in the root
 * directory for license terms. You may choose either license, or both.
 *
 */

/**
 * The <code>TrustedAssetsManager</code> interface defines methods for handling trust
 * material used for activation and authentication to the IoT CS. Depending on
 * the capability of the client or device as well as on the security
 * requirements implementations of this interface may simply store sensitive
 * trust material in a plain persistent store, in some keystore or in a secure
 * token.
 * <dl>
 * <dt>Authentication of Devices with the IoT CS</dt>
 * <dd>
 * <dl>
 * <dt>Before/Upon Device Activation</dt>
 * <dd>
 * A device must use client secret-based authentication to authenticate with the
 * OAuth service and retrieve an access token to perform activation with the IoT
 * CS server. This is done by using an activation ID and a shared secret.
 * </dd>
 * <dt>After Device Activation</dt>
 * <dd>
 * A device must use client assertion-based authentication to authenticate with
 * the OAuth service and retrieve an access token to perform send and retrieve
 * messages from the IoT CS server. This is done by using the assigned endpoint ID
 * and generated private key.</dd>
 * </dl>
 * </dd>
 * <dt>Authentication of <em>Pre-activated</em> Enterprise Applications with the
 * IoT CS</dt>
 * <dd>
 * <dl>
 * <dt>Before/After Application Activation</dt>
 * <dd>
 * An enterprise integration must use client secret-based authentication to authenticate with the
 * OAuth service and retrieve an access token to perform any REST calls with the IoT
 * CS server. This is done by using the integration ID and a shared secret.</dd>
 * </dd>
 * </dl>
 *
 * @class
 * @memberOf iotcs.enterprise
 * @alias TrustedAssetsManager
 *
 * @param {string} [taStoreFile] - trusted assets store file path
 * to be used for trusted assets manager creation. This is optional.
 * If none is given the default global library parameter is used:
 * lib.oracle.iot.tam.store
 * @param {string} [taStorePassword] - trusted assets store file password
 * to be used for trusted assets manager creation. This is optional.
 * If none is given the default global library parameter is used:
 * lib.oracle.iot.tam.storePassword
 *
 */
lib.enterprise.TrustedAssetsManager = function (taStoreFile,taStorePassword) {

    this.clientId = null;
    this.sharedSecret = null;
    this.serverHost = null;
    this.serverPort = null;

    this.trustAnchors = null;

    var _taStoreFile = taStoreFile || lib.oracle.iot.tam.store;
    var _taStorePassword = taStorePassword || lib.oracle.iot.tam.storePassword;

    if (!_taStoreFile) {
        lib.error('No TA Store file defined');
        return;
    }
    if (!_taStorePassword) {
        lib.error('No TA Store password defined');
        return;
    }

    if (!_taStoreFile.endsWith('.json')) {
        this.unifiedTrustStore = new lib.UnifiedTrustStore(_taStoreFile, _taStorePassword, false);
        this.unifiedTrustStore.setValues(this);
    } else {
        this.load = function () {
            var input = $port.file.load(_taStoreFile);
            var entries = JSON.parse(input);

            if (!_verifyTaStoreContent(entries, _taStorePassword)) {
                lib.error('TA Store not signed or tampered with');
                return;
            }

            this.clientId = entries.clientId;
            this.serverHost = entries.serverHost;
            this.serverPort = entries.serverPort;
            this.sharedSecret = (entries.sharedSecret ? _decryptSharedSecret(entries.sharedSecret, _taStorePassword) : null);
            this.trustAnchors = entries.trustAnchors;

        };

        this.load();
    }
};

/**
 * Retrieves the IoT CS server host name.
 *
 * @returns {?string} the IoT CS server host name
 * or <code>null</code> if any error occurs retrieving the server host
 * name.
 *
 * @memberof iotcs.enterprise.TrustedAssetsManager.prototype
 * @function getServerHost
 */
lib.enterprise.TrustedAssetsManager.prototype.getServerHost = function () {
    return this.serverHost;
};

/**
 * Retrieves the IoT CS server port.
 *
 * @returns {?number} the IoT CS server port (a positive integer)
 * or <code>null</code> if any error occurs retrieving the server port.
 *
 * @memberof iotcs.enterprise.TrustedAssetsManager.prototype
 * @function getServerPort
 */
lib.enterprise.TrustedAssetsManager.prototype.getServerPort = function () {
    return this.serverPort;
};

/**
 * Retrieves the ID of this client. If the client is a device the client ID
 * is the device ID; if the client is a pre-activated enterprise application
 * the client ID corresponds to the assigned endpoint ID. The client ID is
 * used along with a client secret derived from the shared secret to perform
 * secret-based client authentication with the IoT CS server.
 *
 * @returns {?string} the ID of this client.
 * or <code>null</code> if any error occurs retrieving the client ID.
 *
 * @memberof iotcs.enterprise.TrustedAssetsManager.prototype
 * @function getClientId
 */
lib.enterprise.TrustedAssetsManager.prototype.getClientId = function () {
    return this.clientId;
};

/**
 * Retrieves the trust anchor or most-trusted Certification
 * Authority (CA) to be used to validate the IoT CS server
 * certificate chain.
 *
 * @returns {?Array} the PEM-encoded trust anchor certificates.
 * or <code>null</code> if any error occurs retrieving the trust anchor.
 *
 * @memberof iotcs.enterprise.TrustedAssetsManager.prototype
 * @function getTrustAnchorCertificates
 */
lib.enterprise.TrustedAssetsManager.prototype.getTrustAnchorCertificates = function () {
    return this.trustAnchors;
};

/**
 * Signs the provided data using the specified algorithm and the shared
 * secret. This method is only use for secret-based client authentication
 * with the IoT CS server.
 *
 * @param {Array} data the bytes to be signed.
 * @param {string} algorithm the hash algorithm to use.
 * @return {?Array} the signature bytes
 * or <code>null</code> if any error occurs retrieving the necessary key
 * material or performing the operation.
 *
 * @memberof iotcs.enterprise.TrustedAssetsManager.prototype
 * @function signWithSharedSecret
 */
lib.enterprise.TrustedAssetsManager.prototype.signWithSharedSecret = function (data, algorithm) {
    var digest = null;
    if (!algorithm) {
        lib.error('Algorithm cannot be null');
        return null;
    }
    if (!data) {
        lib.error('Data cannot be null');
        return null;
    }
    try {
        var hmac = forge.hmac.create();
        hmac.start(algorithm, this.sharedSecret);
        hmac.update(data);
        digest = hmac.digest();
        // lib.log(digest.toHex());
    } catch (e) {
        lib.error('Error signing with shared secret: ' + e);
        return null;
    }
    return digest;
};

/**
 * Provisions the designated Trusted Assets Store with the provided provisioning assets.
 * The provided shared secret will be encrypted using the provided password.
 *
 * @param {string} taStoreFile the Trusted Assets Store file name.
 * @param {string} taStorePassword the Trusted Assets Store password.
 * @param {string} serverHost the IoT CS server host name.
 * @param {number} serverPort the IoT CS server port.
 * @param {?string} clientId the ID of the client.
 * @param {?string} sharedSecret the client's shared secret.
 * @param {?string} truststore the truststore file containing PEM-encoded trust anchors certificates to be used to validate the IoT CS server
 * certificate chain.
 *
 * @memberof iotcs.enterprise.TrustedAssetsManager
 * @function provision
 *
 */
lib.enterprise.TrustedAssetsManager.provision = function (taStoreFile, taStorePassword, serverHost, serverPort, clientId, sharedSecret, truststore) {
    if (!taStoreFile) {
        throw 'No TA Store file provided';
    }
    if (!taStorePassword) {
        throw 'No TA Store password provided';
    }
    var entries = {};
    entries.serverHost = serverHost;
    entries.serverPort = serverPort;
    if (clientId) {
        entries.clientId = clientId;
    }
    if (sharedSecret) {
        entries.sharedSecret = _encryptSharedSecret(sharedSecret, taStorePassword);
    }
    if (truststore) {
        entries.trustAnchors = (Array.isArray(truststore) ? truststore : _loadTrustAnchors(truststore));
    }
    entries = _signTaStoreContent(entries, taStorePassword);
    var output = JSON.stringify(entries);
    $port.file.store(taStoreFile, output);
};

//////////////////////////////////////////////////////////////////////////////

/** @ignore */
function _signTaStoreContent (taStoreEntries, password) {
    var data = (taStoreEntries.clientId ? ('{' + taStoreEntries.clientId + '}') : '')
        + '{' + taStoreEntries.serverHost + '}'
        + '{' + taStoreEntries.serverPort + '}'
        + (taStoreEntries.sharedSecret ? ('{' + taStoreEntries.sharedSecret + '}') : '')
        + (taStoreEntries.trustAnchors ? ('{' + taStoreEntries.trustAnchors + '}') : '');
    var key = _pbkdf(password);
    var hmac = forge.hmac.create();
    hmac.start('sha256', key);
    hmac.update(data);
    var ret = {};
    if (taStoreEntries.clientId) {
        ret.clientId = taStoreEntries.clientId;
    }
    ret.serverHost = taStoreEntries.serverHost;
    ret.serverPort = taStoreEntries.serverPort;
    if (taStoreEntries.sharedSecret) {
        ret.sharedSecret = taStoreEntries.sharedSecret;
    }
    if (taStoreEntries.trustAnchors) {
        ret.trustAnchors = taStoreEntries.trustAnchors;
    }
    ret.signature = hmac.digest().toHex();
    return ret;
}

/** @ignore */
function _verifyTaStoreContent (taStoreEntries, password) {
    var data = (taStoreEntries.clientId ? ('{' + taStoreEntries.clientId + '}') : '')
        + '{' + taStoreEntries.serverHost + '}'
        + '{' + taStoreEntries.serverPort + '}'
        + (taStoreEntries.sharedSecret ? ('{' + taStoreEntries.sharedSecret + '}') : '')
        + (taStoreEntries.trustAnchors ? ('{' + taStoreEntries.trustAnchors + '}') : '');
    var key = _pbkdf(password);
    var hmac = forge.hmac.create();
    hmac.start('sha256', key);
    hmac.update(data);
    return taStoreEntries.signature && hmac.digest().toHex() === taStoreEntries.signature;
}

/** @ignore */
//PBKDF2 (RFC 2898)
function _pbkdf (password) {
    return forge.pkcs5.pbkdf2(password, '', 1000, 16);
}

/** @ignore */
function _encryptSharedSecret (sharedSecret, password) {
    var key = _pbkdf(password);
    var cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: forge.util.createBuffer(16).fillWithByte(0, 16)});
    cipher.update(forge.util.createBuffer(sharedSecret, 'utf8'));
    cipher.finish();
    return cipher.output.toHex();
}

/** @ignore */
function _decryptSharedSecret (encryptedSharedSecret, password) {
    var key = _pbkdf(password);
    var cipher = forge.cipher.createDecipher('AES-CBC', key);
    cipher.start({iv: forge.util.createBuffer(16).fillWithByte(0, 16)});
    cipher.update(forge.util.createBuffer(forge.util.hexToBytes(encryptedSharedSecret), 'binary'));
    cipher.finish();
    return cipher.output.toString();
}

/** @ignore */
function _loadTrustAnchors (truststore) {
    return $port.file.load(truststore)
        .split(/\-{5}(?:B|E)(?:[A-Z]*) CERTIFICATE\-{5}/)
        .filter(function(elem) { return ((elem.length > 1) && (elem.indexOf('M') > -1)); })
        //.filter(elem => elem.length > 0)
        .map(function(elem) { return '-----BEGIN CERTIFICATE-----' + elem.replace(new RegExp('\r\n', 'g'),'\n') + '-----END CERTIFICATE-----'; });
    //.map(elem => elem = '-----BEGIN CERTIFICATE-----' + elem + '-----END CERTIFICATE-----');
}



//END/////////////////////////////////////////////////////////////////////////
    lib.log(lib.description+' v'+ lib.version+' loaded!');
    return lib;
}
//////////////////////////////////////////////////////////////////////////////
// module initialization
if (typeof window !== 'undefined') {
    iotcs = function iotcs(lib) {
        return init(lib);
    };
    iotcs(iotcs);
}
})();
