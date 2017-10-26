import Log from "../Util";
import {EVALUATENODE} from "./EVALUATENODE";
import {isString} from "util";

//SCOMPARISON NODE: s_key
//s_key: courses_('dept' | 'id' | 'instructor' | 'title' | 'uuid')
export class SCOMPNode {

    dataset: Array<any>

    constructor(dataset: Array<any>) {
        this.dataset = dataset;
    }

    typeCheck(query: any) {
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
        this.parse(query);
    }

    parse(query: any) {
        if (query.hasOwnProperty('courses_dept')) {
            this.hasStarValidLocation(query, 'courses_dept');
        }
        if (query.hasOwnProperty('courses_id')) {
            this.hasStarValidLocation(query, 'courses_id');
        }
        if (query.hasOwnProperty('courses_instructor')) {
            this.hasStarValidLocation(query, 'courses_instructor');
        }
        if (query.hasOwnProperty('courses_title')) {
            this.hasStarValidLocation(query, 'courses_title')
        }
        if (query.hasOwnProperty('courses_uuid')) {
            this.hasStarValidLocation(query, 'courses_uuid')
        }
        this.evaluate(query);
    }

    private hasStarValidLocation(query: any, s_key: string) {
        if (query[s_key].includes('*') && !query[s_key].startsWith('*') ||
            !query[s_key].endsWith('*')) {
            throw new Error("query is invalid");
        }
    }

    evaluate(query: any) {
        //TODO:
    }


}