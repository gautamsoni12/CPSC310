import Log from "../Util";
import {EVALUATENODE} from "./EVALUATENODE";

//ORDERNode: m_key | s_key
export class ORDERNode {

    constructor() {

    }

    typeCheck(query: any): string {
        if (query != "courses_avg" || query != "courses_pass" || query != "courses_fail" || query != "courses_audit" ||
            query != "courses_dept" || query != "courses_id" || query != "courses_instructor" || query != "courses_title" ||
            query != "courses_uuid") {
                throw new Error("query is invalid");
        }
        return query;
    }

}