import Thing from './thing'

export function parseTDObj(td : Object) : Thing {
    return null;
}

export function parseTDString(td : string) : Thing {
    return parseTDObj(JSON.parse(td));
}

export function serializeTD(thing : Thing) : string {
    return null;
}