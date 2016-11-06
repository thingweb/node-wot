module Thingweb {
    export interface Resource {
        read(): Object;
        write(payload: Object): Object;
        execute(payload: Object): Object;
        unlink(): Object;
    }
}