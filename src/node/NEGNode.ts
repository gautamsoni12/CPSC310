import Log from "../Util";
import {EVALUATENODE} from "./EVALUATENODE";
import {MCOMPNode} from "./MCOMPNode";

//NEGATION node: FILTER
export class NEGNode {

    ltKey: boolean;
    gtKey: boolean;
    eqKey: boolean;
    isKey: boolean;
    dataset: Array<any>;

    constructor(dataset: Array<any>) {
        this.ltKey = false;
        this.gtKey = false;
        this.eqKey = false;
        this.isKey = false;
        this.dataset = dataset;
    }

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

    parse(query: any) {
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
        this.evaluate(query);
    }

    evaluate(query: any) {
        if (this.ltKey) {
            let mNode = new MCOMPNode(this.dataset);
            return mNode.typeCheck(query['LT'], "LT", true);
        }
        if (this.gtKey) {
            let mNode = new MCOMPNode(this.dataset);
            return mNode.typeCheck(query['GT'], "GT", true);
        }
        if (this.eqKey) {
            let mNode = new MCOMPNode(this.dataset);
            return mNode.typeCheck(query['EQ'], "EQ", true);
        }
        if (this.isKey) {

        }
    }


}