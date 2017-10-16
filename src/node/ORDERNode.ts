import Log from "../Util";

//ORDERNode: m_key | s_key
export class ORDERNode {

    constructor() {

    }

    typeCheck(query: any) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "courses_avg" || keys[i] != "courses_pass" || keys[i] != "courses_fail" || keys[i] != "courses_audit" ||
                keys[i] != "courses_dept" || keys[i] != "courses_id" || keys[i] != "courses_instructor" || keys[i] != "courses_title" || keys[i] != "courses_uuid") {
                throw new Error("query is invalid");
            }
        }
        this.parse(query);
    }

    parse(query: any) {
        //do something TODO:
    }

    evaluate() {

    }


}