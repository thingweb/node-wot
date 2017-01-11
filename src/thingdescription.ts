import { JsonMember, JsonObject} from 'typedjson';

/** structured type representing a TD for internal usage */
export default class ThingDescription {

    @JsonMember({name : "@context",  elements: String }) /** @context information of the TD */
    private context : Array<string> = ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"]

    @JsonMember({isRequired:true, type: String}) /** Human readable name identifier of the Thing  */
    public name : string

    @JsonMember({type: String}) /** base uri of the interaction resources */
    public base : string

    @JsonMember({isRequired:true,  elements: Object })  /** interactions of this thing */
    public interactions : Array<TDInteraction>;

}

/**
 * Internal data structure for an interaction
 */
export class TDInteraction {

    @JsonMember({name : "@type",  elements: String }) /** @ type information of the interaction */
    public  rdfType : Array<string>

    @JsonMember({isRequired:true, type: String})  /** name/identifier of the interaction */
    public name : string

    /** type of the interaction (action, property, event) */
    public interactionType : interactionTypeEnum

    @JsonMember({isRequired:true,  elements: Object})  /** link information of the interaction resources */
    public links : Array<TDInteractionLink>;

    @JsonMember({type: Boolean}) /* writable flag for the property*/
    public writable : boolean;

    //TODO: how to handle types internally?
    @JsonMember({type: String}) // json schema objects
    public inputData : any

    @JsonMember({type: String})
    public outputDate : any
}

/**
* Internal links information of an interaction
*/
export class TDInteractionLink {
  @JsonMember({isRequired:true, type: String})   /* relativ or absulut URI path of the interaction resource */
  public href : string

  @JsonMember({isRequired:true, type: String})   /* used mediaType of the interacion resources */
  public mediaType : mediaTypeEnum
}

/* media type selection */
export enum mediaTypeEnum {
    "application/json",
    "application/xml",
    "application/exi"
    /* TODO: add more media types here */
}

/* interaction type selection */
export enum interactionTypeEnum {
    property,
    action,
    event
}
/* simple type selection */
export enum dataTypePrimitiveEnum {
    string,
    boolean,
    number,
    array,
    object,
    null
}
