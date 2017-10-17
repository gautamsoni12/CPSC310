import Log from "../Util";
import {LOGICCOMPNode} from "./LOGICCOMPNode";
import {SCOMPNode} from "./SCOMPNode";
import {NEGNode} from "./NEGNode";
import {MCOMPNode} from "./MCOMPNode";
import {InsightResponse} from "../controller/IInsightFacade";
import {EVALUATENODE} from "./EVALUATENODE";

//WHERE NODE: FILTER
//FILTER: 'AND' | 'OR' (LOGICCOMPARISON)
//        'LT' | 'GT' | 'EQ" (MCOMPARISON)
//        'IS' (SCOMPARISON)
//        'NOT" (NEGATION)
export class WHEREnode {

    public COLUMNS: Array<string> = new Array();

    constructor() {

    }

    /**
     * checks query to make sure grammar is valid
     * @param query: query to be typeChecked
     */
    typeCheck(query: any, eNode: EVALUATENODE) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "AND" || keys[i] != "OR" || keys[i] != "LT" || keys[i] != "GT" || keys[i] != "EQ" ||
                keys[i] != "IS" || keys[i] != "NOT") {
                throw new Error("query is invalid");
            }
        }
        this.parse(query, eNode);
    }

    /**
     * parses query to see if keys are present
     * @param query: query to be parsed
     */
    parse(query: any, eNode: EVALUATENODE) {
        if (query.hasOwnProperty('AND')) {
            let lcNode: LOGICCOMPNode = new LOGICCOMPNode();
            lcNode.typeCheck(query['AND'], "AND", eNode);
        }
        if (query.hasOwnProperty('OR')) {
            let lcNode: LOGICCOMPNode = new LOGICCOMPNode();
            lcNode.typeCheck(query['OR'], "OR", eNode);
        }

        if (query.hasOwnProperty('LT')) {
            let mNode: MCOMPNode = new MCOMPNode();
            mNode.typeCheck(query['LT'], "LT", eNode);
        }
        if (query.hasOwnProperty('GT')) {
            let mNode: MCOMPNode = new MCOMPNode();
            mNode.typeCheck(query['GT'], "GT",eNode);
        }
        if (query.hasOwnProperty('EQ')) {
            let mNode: MCOMPNode = new MCOMPNode();
            mNode.typeCheck(query['EQ'], "EQ", eNode);
        }

        if (query.hasOwnProperty('IS')) {
            let scNode: SCOMPNode = new SCOMPNode();
            scNode.typeCheck(query['IS'], eNode);
        }
        if (query.hasOwnProperty('NOT')) {
            let nNode: NEGNode = new NEGNode();
            nNode.typeCheck(query['NOT'], eNode);
        }
    }

    evaluate(dataset: Array<any>): Promise<InsightResponse> {

        return null;
    }


}