import ThingDescription from './thingdescription'
import ServedThing from './servedthing'
import Servient from './servient'

import { JsonMember, JsonObject, TypedJSON } from 'typedjson';

export function generateTD(thing : ServedThing, servient : Servient ) : ThingDescription {
    return null;
}

export function parseTDObj(td : Object) : ThingDescription {
    return parseTDString(JSON.stringify(td))
}

export function parseTDString(td : string) : ThingDescription {
        return TypedJSON.parse(td,ThingDescription);
}

export function serializeTD(thing : ThingDescription) : string {
           return TypedJSON.stringify(thing);
}
