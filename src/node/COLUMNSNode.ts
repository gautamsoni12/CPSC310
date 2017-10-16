import Log from "../Util";

//COLUMNS NODE: (m_key | s_key)*
//m_key: courses_('avg' | 'pass' | 'fail' | 'audit')
//s_key: courses_('dept' | 'id' | 'instructor' | 'title' | 'uuid')
export class COLUMNSNode {

    constructor() {

    }

    /**
     * checks query to see if grammar is valid
     * @param query: query to be typeChecked
     */
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

    /**
     * parses query to see if certain keys are present
     * @param query: query to be parsed
     */
    parse(query: any) {
        //do something TODO:
    }

    evaluate() {

    }

}