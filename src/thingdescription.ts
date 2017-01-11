/** structured type representing a TD for internal usage */
export default class ThingDescription {

    public name : string /** Human readable name identifier of the Thing  */
    public base : string /** base uri of the interaction resources */

    /** interactions of this thing */
    public interactions : Array<TDInteraction>;

}

/**
 * Internal data structure for an interaction
 */
export class TDInteraction {
    /** name/identifier of the interaction */
    public name : string

    /** type of the interaction (action, property, event) */
    public interactionType : interactionTypeEnum

    /** interactions of this thing */
    public links : Array<TDInteractionLink>;

    /* writable flag for the property*/
    public writable : boolean;

    //how to handle types internally?
    // json schema objects
    public inputData : any
    public outputDate : any
}

/**
* Internal links information of an interaction
*/
export class TDInteractionLink {
  /* relativ or absulut URI path of the interaction resource */
  public href : string

  /* used mediaType of the interacion resources */
  public mediaType : mediaTypeEnum
}

enum mediaTypeEnum {
    "application/json",
    "application/xml",
    "application/exi"
    /* TODO: add more media types here */
}

enum interactionTypeEnum {
    property,
    action,
    event
}

enum dataTypePrimitiveEnum {
    string,
    boolean,
    number,
    array,
    object,
    null
}
