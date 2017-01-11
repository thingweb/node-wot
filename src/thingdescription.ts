import { JsonMember, JsonObject, TypedJSON } from 'typedjson-npm';

/** structured type representing a TD for internal usage */
export default class ThingDescription {

    @JsonMember({name : "@context"}) /** @context information of the TD */
    private context : Array<string> = ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"]

    @JsonMember({isRequired:true}) /** Human readable name identifier of the Thing  */
    public name : string

    @JsonMember /** base uri of the interaction resources */
    public base : string

    @JsonMember({isRequired:true})  /** interactions of this thing */
    public interactions : Array<TDInteraction>;

}

/**
 * Internal data structure for an interaction
 */
export class TDInteraction {

    @JsonMember({name : "@type"}) /** @ type information of the interaction */
    public  rdfType : Array<string>

    @JsonMember({isRequired:true})  /** name/identifier of the interaction */
    public name : string

    /** type of the interaction (action, property, event) */
    public interactionType : interactionTypeEnum

    @JsonMember({isRequired:true})  /** link information of the interaction resources */
    public links : Array<TDInteractionLink>;

    @JsonMember /* writable flag for the property*/
    public writable : boolean;

    //how to handle types internally?
    @JsonMember // json schema objects
    public inputData : any

    @JsonMember
    public outputDate : any
}

/**
* Internal links information of an interaction
*/
export class TDInteractionLink {
  @JsonMember({isRequired:true})  /* relativ or absulut URI path of the interaction resource */
  public href : string

  @JsonMember({isRequired:true})  /* used mediaType of the interacion resources */
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
