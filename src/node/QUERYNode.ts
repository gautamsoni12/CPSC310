import Log from "../Util";
import {InsightResponse} from "../controller/IInsightFacade";
import {WHEREnode} from "./WHEREnode";
import {OPTIONnode} from "./OPTIONnode";

//QUERY NODE
export class QUERYNode {
    private obj: any; //dont need this?
    private whereKey: boolean = false;
    private optionKey: boolean = false;

    constructor() {

    }

    /**
     *@param query: query to be typeChecked
     *checks grammar of query to see if it matches grammar
     */
    typeCheck(query: any) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "WHERE" || keys[i] != "OPTIONS") {
                throw new Error;
            }
        }
        this.parse(query);
    }

    /**
     * @param query: query to be parsed
     * Parses query to see if WHERE or OPTIONS keys are present
     **/
    parse(query: any) {
        if (query.hasOwnProperty('WHERE')) {
            let wNode: WHEREnode = new WHEREnode();
            wNode.typeCheck(query['WHERE']);
        }
        if (query.hasOwnProperty('OPTIONS')) {
            let oNode: OPTIONnode =  new OPTIONnode();
            oNode.typeCheck(query['OPTIONS']);
        }
    }

    /**
     * evaluates query based on keys found
     * @param query: query to be evaluated
     */
    evaluate(query: any) {

    }


}