import Log from "../Util";
import {WHEREnode} from "./WHEREnode";
import {EVALUATENODE} from "./EVALUATENODE";

//COLUMNS NODE: (m_key | s_key)*
//m_key: courses_('avg' | 'pass' | 'fail' | 'audit')
//s_key: courses_('dept' | 'id' | 'instructor' | 'title' | 'uuid')
export class COLUMNSNode {

    columns: Array<string>;

    constructor() {
        this.columns = new Array();
    }

    /**
     * checks query to see if grammar is valid
     * @param query: query to be typeChecked
     */
    typeCheck(query: any): Array<string> {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "courses_avg" || keys[i] != "courses_pass" || keys[i] != "courses_fail" || keys[i] != "courses_audit" ||
                keys[i] != "courses_dept" || keys[i] != "courses_id" || keys[i] != "courses_instructor" || keys[i] != "courses_title" || keys[i] != "courses_uuid") {
                throw new Error("query is invalid");
            }
        }
        return this.parse(query);
    }

    /**
     * parses query to see if certain keys are present
     * @param query: query to be parsed
     */
    parse(query: any): Array<string> {
        let keys = Object.keys(query);
        //For loop finds all the keys in columns
        for (let i  = 0; i < keys.length; i++) {
            if (keys[i] == "courses_avg") {
                this.columns.push('Avg');
            } else if (keys[i] == "courses_pass") {
                this.columns.push('Pass');
            } else if (keys[i] == "courses_fail") {
                this.columns.push('Fail');
            } else if (keys[i] == "courses_audit") {
                this.columns.push('Audit');
            } else if (keys[i] == "courses_dept") {
                this.columns.push('Dept');
            } else if (keys[i] == "courses_id") {
                this.columns.push('Id');
            } else if (keys[i] == "courses_instructor") {
                this.columns.push('Instructor');
            } else if (keys[i] == "courses_title") {
                this.columns.push('Title');
            } else if (keys[i] == "courses_uuid") {
                this.columns.push('Uuid');
            }
        }
        return this.columns;
    }

}