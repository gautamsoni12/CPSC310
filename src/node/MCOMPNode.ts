import Log from "../Util";

//MCOMPARISON NODE: m_key:number
//m_key: courses_('avg' | 'pass' | 'fail' | 'audit")
export class MCOMPNode {

    constructor() {

    }

    /**
     *
     * @param query: query to be typeChecked
     * @param {string} key
     */
    typeCheck(query: any, key: string) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "courses_avg" || keys[i] != "courses_pass" ||
                keys[i] != "courses_audit" || keys[i] != "courses_fail") {
                throw new Error("query is invalid");
            }
        }
        this.parse(query);
    }

    parse(query: any) {
        if (query.hasOwnProperty('courses_avg')) {
            //do something
        }
        if (query.hasOwnProperty('courses_pass')) {
            //do something
        }
        if (query.hasOwnProperty('courses_fail')) {
            //do something
        }
        if (query.hasOwnProperty('courses_audit')) {
            //do something
        }

    }

    evaluate() {

    }


}
