import Log from "../Util";
import {WHEREnode} from "./WHEREnode";
import {EVALUATENODE} from "./EVALUATENODE";

//COLUMNS NODE: (m_key | s_key)*
//m_key: courses_('avg' | 'pass' | 'fail' | 'audit')
//s_key: courses_('dept' | 'id' | 'instructor' | 'title' | 'uuid')
export class COLUMNSNode {

    columns: Array<String>;

    constructor() {
        this.columns = new Array();
    }

    /**
     * checks query to see if grammar is valid
     * @param query: query to be typeChecked
     */
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

    /**
     * parses query to see if certain keys are present
     * @param query: query to be parsed
     */
    parse(query: any, eNode: EVALUATENODE) {
        let keys = Object.keys(query);
        for (let i  = 0; i < keys.length; i++) {
            if (keys[i] == "courses_avg") {
                eNode.addToColumns("courses_avg");
            } else if (keys[i] == "courses_pass") {
                eNode.addToColumns("courses_pass");
            } else if (keys[i] == "courses_fail") {
                eNode.addToColumns("courses_fail");
            } else if (keys[i] == "courses_audit") {
                eNode.addToColumns("courses_audit");
            } else if (keys[i] == "courses_dept") {
                eNode.addToColumns("courses_dept");
            } else if (keys[i] == "courses_id") {
                eNode.addToColumns("courses_id");
            } else if (keys[i] == "courses_instructor") {
                eNode.addToColumns("courses_instructor");
            } else if (keys[i] == "courses_title") {
                eNode.addToColumns("courses_title")
            } else if (keys[i] == "courses_uuid") {
                eNode.addToColumns("courses_uuid");
            }
        }
    }

    evaluate() {

    }

}