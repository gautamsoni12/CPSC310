import Log from "../Util";
import {EVALUATENODE} from "./EVALUATENODE";
import {isNumber} from "util";

//LOGICCOMPARISON NODE : {FILTER, FILTER*}

export class LOGICCOMPNode  {

    constructor() {

    }

    /**
     * checks query to see if grammar is valid
     * @param query: query to be typeChecked
     * @param {string} key:
     */
    typeCheck(query: any, key: string, eNode: EVALUATENODE) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "AND" || keys[i] != "OR" || keys[i] != "LT" || keys[i] != "GT" || keys[i] != "EQ" ||
                keys[i] != "IS" || keys[i] != "NOT") {
                throw new Error("query is invalid");
            }
        }
        this.parse(query, eNode, key);
    }

    parse(query: any, eNode:EVALUATENODE, key: string) {
        /*
        if (key == "AND") {
            let lcNode = new LOGICCOMPNode();
            lcNode.typeCheck(query['AND'], "NA", eNode);

            let keys = Object.keys(query);
            for (let i = 0; i < keys.length; i++) {
                eNode.addToAndfilters(keys[i]);
            }

        }

        if (key == "OR") {
            let lcNode = new LOGICCOMPNode();
            lcNode.typeCheck(query['AND'], "NA", eNode);


            let keys = Object.keys(query);
            for (let i = 0; i < keys.length; i++) {
                eNode.addToOrfilters(keys[i]);
            }
        }

        if (key == "LT") {
            if (isNumber(query['LT'])) {
                throw new Error("query is invalid")
            }
            eNode.setLessThan(query['LT']);
        }

        if (key == "GT") {
            if (isNumber(query['GT'])) {
                throw new Error("query is invalid")
            }
            eNode.setLessThan(query['GT']);
        }

        if (key == "EQ") {
            if (isNumber(query['EQ'])) {
                throw new Error("query is invalid")
            }
            eNode.setLessThan(query['EQ']);
        }
        */
    }

    evaluate() {

    }

}