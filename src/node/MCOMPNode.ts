import Log from "../Util";
import {EVALUATENODE} from "./EVALUATENODE";
import {isNumber} from "util";

//MCOMPARISON NODE: m_key:number
//m_key: courses_('avg' | 'pass' | 'fail' | 'audit")
export class MCOMPNode {

    course_avg: boolean;
    course_pass: boolean;
    course_fail: boolean;
    course_audit: boolean;
    key: string


    constructor() {
        this.course_audit = false;
        this.course_fail = false;
        this.course_pass = false;
        this.course_avg = false;
        this.key = "";
    }

    /**
     *
     * @param query: query to be typeChecked
     * @param {string} key
     */
    typeCheck(query: any, key: string, eNode: EVALUATENODE) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "courses_avg" || keys[i] != "courses_pass" ||
                keys[i] != "courses_audit" || keys[i] != "courses_fail") {
                throw new Error("query is invalid");
            }
        }
        this.key = key;
        this.parse(query, key, eNode);
    }

    parse(query: any, key: string, eNode: EVALUATENODE) {
        if (query.hasOwnProperty('courses_avg')) {
            if (key == "LT") {
                if (!isNumber(query['courses_avg'])) {
                    throw new Error('query is invalid')
                }
                eNode.setLessThan(query['courses_avg'], "avg")
            } else if (key == "GT") {
                if (!isNumber(query['courses_avg'])) {
                    throw new Error('query is invalid')
                }
                eNode.setGreaterThan(query['courses_avg'], "avg")
            } else if (key == "EQ") {
                if (!isNumber(query['courses_avg'])) {
                    throw new Error('query is invalid')
                }
                eNode.setEqualTo(query['courses_avg'], "avg")
            }
        }
        if (query.hasOwnProperty('courses_pass')) {
            if (key == "LT") {
                if (!isNumber(query['courses_pass'])) {
                    throw new Error('query is invalid')
                }
                eNode.setLessThan(query['courses_pass'], "pass")
            } else if (key == "GT") {
                if (!isNumber(query['courses_pass'])) {
                    throw new Error('query is invalid')
                }
                eNode.setGreaterThan(query['courses_pass'], "pass")
            } else if (key == "EQ") {
                if (!isNumber(query['courses_pass'])) {
                    throw new Error('query is invalid')
                }
                eNode.setEqualTo(query['courses_pass'], "pass")
            }
        }
        if (query.hasOwnProperty('courses_fail')) {
            if (key == "LT") {
                if (!isNumber(query['courses_fail'])) {
                    throw new Error('query is invalid')
                }
                eNode.setLessThan(query['courses_fail'], "fail")
            } else if (key == "GT") {
                if (!isNumber(query['courses_fail'])) {
                    throw new Error('query is invalid')
                }
                eNode.setGreaterThan(query['courses_fail'], "fail")
            } else if (key == "EQ") {
                if (!isNumber(query['courses_fail'])) {
                    throw new Error('query is invalid')
                }
                eNode.setEqualTo(query['courses_fail'], "fail")
            }
        }
        if (query.hasOwnProperty('courses_audit')) {
            if (key == "LT") {
                if (!isNumber(query['courses_audit'])) {
                    throw new Error('query is invalid')
                }
                eNode.setLessThan(query['courses_audit'], "audit")
            } else if (key == "GT") {
                if (!isNumber(query['courses_audit'])) {
                    throw new Error('query is invalid')
                }
                eNode.setGreaterThan(query['courses_audit'], "audit")
            } else if (key == "EQ") {
                if (!isNumber(query['courses_audit'])) {
                    throw new Error('query is invalid')
                }
                eNode.setEqualTo(query['courses_audit'], "audit")
            }
        }

    }

    evaluate() {

    }


}
