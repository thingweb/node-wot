/** structured type representing a TD for internal usage */
export default class ThingDescription {
    /** Name in this case is the machine-readable id of this thing */
    public name : string

    /** interactions of this thing */
    public interactions : Array<TDInterAction>;

}

/**
 * Internal data structure for an interaction
 */
export class TDInterAction {
    /** name/identifier of the interaction */
    readonly name : string
    /** complete (absolute) uri */
    readonly uri : string 
    /** type of the interaction (action, property, event) */
    readonly type : string

    //how to handle types internally?
    // json schema objects
    readonly reqType : any
    readonly pesType : any
}

enum DataTypePrimitive {
    string,
    boolean,
    number,
    array,
    object,
    null
}