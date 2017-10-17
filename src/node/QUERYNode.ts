import Log from "../Util";
import {InsightResponse} from "../controller/IInsightFacade";
import {WHEREnode} from "./WHEREnode";
import {OPTIONnode} from "./OPTIONnode";
import {EVALUATENODE} from "./EVALUATENODE";

//QUERY NODE
export class QUERYNode {
    private obj: any; //dont need this?
    private whereKey: boolean = false;
    private optionKey: boolean = false;

    constructor() {

    }

    /**
     *@param query: query to be typeChecked
     * @param eNode: node to add keys to
     *checks grammar of query to see if it matches grammar
     */
    typeCheck(query: any, eNode: EVALUATENODE) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "WHERE" || keys[i] != "OPTIONS") {
                throw new Error;
            }
        }
        this.parse(query, eNode);
    }

    /**
     * @param query: query to be parsed
     * @param eNode: node to add keys to
     * Parses query to see if WHERE or OPTIONS keys are present
     **/
    parse(query: any, eNode: EVALUATENODE) {
        if (query.hasOwnProperty('WHERE')) {
            let wNode: WHEREnode = new WHEREnode();
            wNode.typeCheck(query['WHERE'], eNode);
        }
        if (query.hasOwnProperty('OPTIONS')) {
            let oNode: OPTIONnode =  new OPTIONnode();
            oNode.typeCheck(query['OPTIONS'], eNode);
        }
    }



    evaluate(query: any, dataset: Array<any>) {

    }


}