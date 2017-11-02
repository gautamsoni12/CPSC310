import Log from "../Util";
import {LOGICCOMPNode} from "./LOGICCOMPNode";
import {SCOMPNode} from "./SCOMPNode";
import {NEGNode} from "./NEGNode";
import {MCOMPNode} from "./MCOMPNode";

//WHERE NODE: FILTER
//FILTER: 'AND' | 'OR' (LOGICCOMPARISON)
//        'LT' | 'GT' | 'EQ" (MCOMPARISON)
//        'IS' (SCOMPARISON)
//        'NOT" (NEGATION)
export class WHEREnode {

    constructor() {

    }

    /**
     * checks query to make sure grammar is valid
     * @param query: query to be typeChecked
     */
    typeCheck(query: any) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "AND" || keys[i] != "OR" || keys[i] != "LT" || keys[i] != "GT" || keys[i] != "EQ" ||
                keys[i] != "IS" || keys[i] != "NOT") {
                throw new Error("query is invalid");
            }
        }
        this.parse(query);
    }

    /**
     * parses query to see if keys are present
     * @param query: query to be parsed
     */
    parse(query: any) {
        if (query.hasOwnProperty('AND')) {
            let lcNode: LOGICCOMPNode = new LOGICCOMPNode();
            lcNode.typeCheck(query['AND'], "AND");
        }
        if (query.hasOwnProperty('OR')) {
            let lcNode: LOGICCOMPNode = new LOGICCOMPNode();
            lcNode.typeCheck(query['OR'], "OR");
        }

        if (query.hasOwnProperty('LT') || query.hasOwnProperty('GT') || query.hasOwnProperty('EQ')) {
            let mNode: MCOMPNode = new MCOMPNode();
            mNode.typeCheck(query['LT'], "LT")
        }
        if (query.hasOwnProperty('GT')) {
            let mNode: MCOMPNode = new MCOMPNode();
            mNode.typeCheck(query['GT'], "GT")
        }
        if (query.hasOwnProperty('EQ')) {
            let mNode: MCOMPNode = new MCOMPNode();
            mNode.typeCheck(query['EQ'], "EQ")
        }

        if (query.hasOwnProperty('IS')) {
            let scNode: SCOMPNode = new SCOMPNode();
            scNode.parse(query['IS']);
        }
        if (query.hasOwnProperty('NOT')) {
            let nNode: NEGNode = new NEGNode();
            nNode.typeCheck(query['NOT']);
        }
    }

    evaluate() {



    }


}