// TD V1 https://w3c.github.io/wot/current-practices/wot-practices-beijing-2016.html
// TD V2 2017, USA, Santa Clara (FIXLINK http://w3c.github.io/wot/current-practices/wot-practices.html)

export function transformTDV1StringToV2String(td1 : string) : Object {
  // create object from original TD and re-arrange data
  var td2 = JSON.parse(td1);

  // TODO the actual modifications
  console.log("NO TD MODIFICATIONS DONE YET!!!!!");

  return td2;
}

export function transformTDV1ObjToV2Obj(td1 : Object) : Object {
  return transformTDV1StringToV2String(JSON.stringify(td1))
}

export function transformTDV2StringToV1String(td2 : string) : Object {
  // create object from original TD and re-arrange data
  var td1 = JSON.parse(td2);

  // base to uris
  if(td1["base"] != null) {
    td1["uris"] = []; // new Array();
    td1["uris"].push(td1["base"]);
    delete td1["base"]; // remove base field
  }

  // split interaction into property, action & event
  if(td1["interactions"] != null && Array.isArray(td1["interactions"]) ) {
    for(let inter of td1["interactions"]) {
      // TODO sanitize @type (remove Property, Action & Event)? Keep it for now. Does not hurt!

      if(inter["@type"] != null && Array.isArray(inter["@type"]) ) {
        if(inter["@type"].indexOf("Property") >= 0) {
          if(td1["property"] == null) {
            td1["property"] = []; // new Array();
          }
          td1["property"].push(inter);

          // outputData.valueType --> valueType
          if(inter["outputData"] != null && inter["outputData"]["valueType"] != null) {
            inter["valueType"] = inter["outputData"]["valueType"];
            delete inter["outputData"]; // remove outputData field
          }

          // links.href --> hrefs
          // links.mediaType --> encodings
          fixLinksV2toHrefsEncodingsV1(td1, inter);
        }
        if(inter["@type"].indexOf("Action") >= 0) {
          if(td1["action"] == null) {
            td1["action"] = []; // new Array();
          }
          td1["action"].push(inter);

          // inputData and outputData did not change for Action

          // links.href --> hrefs
          // links.mediaType --> encodings
          fixLinksV2toHrefsEncodingsV1(td1, inter);
        }
        if(inter["@type"].indexOf("Event") >= 0) {
          if(td1["event"] == null) {
            td1["event"] = []; // new Array();
          }
          td1["event"].push(inter);

          // outputData.valueType --> valueType
          if(inter["outputData"] != null && inter["outputData"]["valueType"] != null) {
            inter["valueType"] = inter["outputData"]["valueType"];
            delete inter["outputData"]; // remove outputData field
          }

          // links.href --> hrefs
          // links.mediaType --> encodings
          fixLinksV2toHrefsEncodingsV1(td1, inter);
        }
      }
    }
    delete td1["interactions"]; // remove interactions field
  }

  // TODO encodings

  return td1;
}

// links.href --> hrefs
// links.mediaType --> encodings
function fixLinksV2toHrefsEncodingsV1(td1 : any, inter : any) {
  if(inter["links"] != null && Array.isArray(inter["links"]) ) {
    for(let link of inter["links"]) {
      // hrefs
      if(inter["hrefs"] == null) {
        inter["hrefs"] = []; // new Array();
      }
      inter["hrefs"].push(link["href"]);
      // encodings
      if(td1["encodings"] == null) {
        td1["encodings"] = []; // new Array();
      }
      if(td1["encodings"].indexOf(link["mediaType"]) < 0) {
        td1["encodings"].push(link["mediaType"]);
      }
    }
    delete inter["links"]; // remove links field
  }
}

export function transformTDV2ObjToV1Obj(td2 : Object) : Object {
  return transformTDV2StringToV1String(JSON.stringify(td2));
}
