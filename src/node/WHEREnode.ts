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

    public COLUMNS: Array<string> = [];

    andKey: boolean;
    orKey: boolean;
    ltKey: boolean;
    gtKey: boolean;
    eqKey: boolean;
    isKey: boolean;
    notKey: boolean;
    dataset: Array<any>;

    constructor(dataset: Array<any>) {
        this.dataset = dataset;
        this.andKey = false;
        this.orKey = false;
        this.ltKey = false;
        this.gtKey = false;
        this.eqKey = false;
        this.isKey = false;
        this.notKey = false;
    }

    /**
     * checks query to make sure grammar is valid
     * @param query: query to be typeChecked
     */
    typeCheck(query: any): Array<any> {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "AND" || keys[i] != "OR" || keys[i] != "LT" || keys[i] != "GT" || keys[i] != "EQ" ||
                keys[i] != "IS" || keys[i] != "NOT") {
                throw new Error("query is invalid");
            }
        }
        return this.parse(query);
    }

    /**
     * parses query to see if keys are present
     * @param query: query to be parsed
     */
    parse(query: any): Array<any> {
        if (query.hasOwnProperty('AND')) {
            this.andKey = true;
        }
        if (query.hasOwnProperty('OR')) {
            this.orKey  =true;
        }
        if (query.hasOwnProperty('LT')) {
            this.ltKey = true;
        }
        if (query.hasOwnProperty('GT')) {
            this.gtKey = true;
        }
        if (query.hasOwnProperty('EQ')) {
            this.eqKey = true;
        }
        if (query.hasOwnProperty('IS')) {
            this.isKey = true;
        }
        if (query.hasOwnProperty('NOT')) {
            this.notKey = true;
        }
        return this.evaluate(query);
    }



    evaluate(query: any): Array<any> {
        let results: Array<any> = [];
        if (this.andKey) {

        }
        if (this.orKey) {

        }
        if (this.ltKey) {
            let mNode = new MCOMPNode(this.dataset);
            results = mNode.typeCheck(query['LT'], "LT", false);
        }
        if (this.gtKey) {
            let mNode = new MCOMPNode(this.dataset);
            results = mNode.typeCheck(query['GT'], "GT", false);
        }
        if (this.eqKey) {
            let mNode =  new MCOMPNode(this.dataset);
            results = mNode.typeCheck(query['EQ'], "EQ", false)
        }
        if (this.isKey) {
            let sNode = new SCOMPNode(this.dataset);
            //sNode.typeCheck(query['IS']);
        }
        if (this.notKey) {
            let negNode = new NEGNode(this.dataset);
            //negNode.typeCheck(query['NOT']);
        }
        return results;

    }

}