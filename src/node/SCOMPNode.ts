import Log from "../Util";
import {EVALUATENODE} from "./EVALUATENODE";
import {isString} from "util";

//SCOMPARISON NODE: s_key
//s_key: courses_('dept' | 'id' | 'instructor' | 'title' | 'uuid')
export class SCOMPNode {

    constructor() {

    }

    typeCheck(query: any, eNode: EVALUATENODE) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "course_dept" || keys[i] != "course_id" || keys[i] != "course_instructor" ||
                keys[i] != "course_title" || keys[i] != "course_uuid") {
                throw new Error("query is invalid");
            }
            if (!isString(query[keys[i]])) {
                throw new Error("query is invalid");
            }
        }
        this.parse(query, eNode);
    }

    parse(query: any, eNode: EVALUATENODE) {
        if (query.hasOwnProperty('courses_dept')) {
            if (query['courses_dept'].includes('*') && !query['courses_dept'].startsWith('*') &&
                (query['courses_dept'].endsWith('*'))) {
                throw new Error("query is invalid");
            }
            eNode.setInputStrings(query['courses_dept'], "dept");
        }
        if (query.hasOwnProperty('courses_id')) {
            if (query['courses_id'].includes('*') && !query['courses_id'].startsWith('*') &&
                (query['courses_id'].endsWith('*'))) {
                throw new Error("query is invalid");
            }
            eNode.setInputStrings(query['courses_id'], "id");
        }
        if (query.hasOwnProperty('courses_instructor')) {
            if (query['courses_instructor'].includes('*') && !query['courses_instructor'].startsWith('*') &&
                (query['courses_instructor'].endsWith('*'))) {
                throw new Error("query is invalid");
            }
            eNode.setInputStrings(query['courses_instructor'], "instruct");
        }
        if (query.hasOwnProperty('courses_title')) {
            if (query['courses_title'].includes('*') && !query['courses_title'].startsWith('*') &&
                (query['courses_title'].endsWith('*'))) {
                throw new Error("query is invalid");
            }
            eNode.setInputStrings(query['courses_title'], "title");
        }
        if (query.hasOwnProperty('courses_uuid')) {
            if (query['courses_uuid'].includes('*') && !query['courses_uuid'].startsWith('*') &&
                (query['courses_uuid'].endsWith('*'))) {
                throw new Error("query is invalid");
            }
            eNode.setInputStrings(query['courses_uuid'], "uuid");
        }
    }

    evaluate() {

    }


}