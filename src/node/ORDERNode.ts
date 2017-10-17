import Log from "../Util";
import {EVALUATENODE} from "./EVALUATENODE";

//ORDERNode: m_key | s_key
export class ORDERNode {

    constructor() {

    }

    typeCheck(query: any, eNode: EVALUATENODE) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "courses_avg" || keys[i] != "courses_pass" || keys[i] != "courses_fail" || keys[i] != "courses_audit" ||
                keys[i] != "courses_dept" || keys[i] != "courses_id" || keys[i] != "courses_instructor" || keys[i] != "courses_title" || keys[i] != "courses_uuid") {
                throw new Error("query is invalid");
            }
        }
        this.parse(query, eNode);
    }

    parse(query: any, eNode: EVALUATENODE) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] == "courses_avg" || keys[i] == "courses_pass" || keys[i] == "courses_fail" || keys[i] == "courses_audit" ||
                keys[i] == "courses_dept" || keys[i] == "courses_id" || keys[i] == "courses_instructor" || keys[i] == "courses_title" || keys[i] == "courses_uuid") {
                eNode.setOrder(keys[i])
            }
        }
    }

    evaluate() {

    }


}