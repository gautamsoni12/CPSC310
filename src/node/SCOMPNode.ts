import Log from "../Util";

//SCOMPARISON NODE: s_key
//s_key: courses_('dept' | 'id' | 'instructor' | 'title' | 'uuid')
export class SCOMPNode {

    constructor() {

    }

    typeCheck(query: any) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "course_dept" || keys[i] != "course_id" || keys[i] != "course_instructor" ||
                keys[i] != "course_title" || keys[i] != "course_uuid") {
                throw new Error("query is invalid");
            }
        }
        this.parse(query);
    }

    parse(query: any) {
        if (query.hasOwnProperty('courses_dept')) {
            //do something
        }
        if (query.hasOwnProperty('courses_id')) {
            //do something
        }
        if (query.hasOwnProperty('courses_instructor')) {
            //do something
        }
        if (query.hasOwnProperty('courses_title')) {
            //do something
        }
        if (query.hasOwnProperty('courses_uuid')) {
            //do something
        }
    }

    evaluate() {

    }


}