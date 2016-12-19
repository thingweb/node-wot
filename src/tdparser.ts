import ThingDescription from './thingdescription'
import ServedThing from './servedthing'
import Servient from './servient'

export function generateTD(thing : ServedThing, servient : Servient ) : ThingDescription {
    return null;
}

export function parseTDObj(td : Object) : ThingDescription {
    return null;
}

export function parseTDString(td : string) : ThingDescription {
    return parseTDObj(JSON.parse(td));
}

export function serializeTD(thing : ThingDescription) : string {
    return null;
}