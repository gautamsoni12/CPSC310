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
    dataset: Array<any>;
    negation: boolean;
    key: string;


    constructor(dataset: Array<any>) {
        this.course_audit = false;
        this.course_fail = false;
        this.course_pass = false;
        this.course_avg = false;
        this.dataset = dataset;
        this.negation = false;
        //this.columns = columns;
        this.key = "";
    }

    /**
     *
     * @param query: query to be typeChecked
     * @param {string} key
     * @param neg:
     */
    typeCheck(query: any, key: string, neg: boolean): Array<any> {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "courses_avg" || keys[i] != "courses_pass" ||
                keys[i] != "courses_audit" || keys[i] != "courses_fail") {
                throw new Error("query is invalid");
            }
        }
        this.negation = neg;
        this.key = key;
        return this.parse(query, key);
    }

    parse(query: any, key: string): Array<any> {

        if (query.hasOwnProperty('courses_avg')) {
            /*
            if (key == "LT") {
                if (!isNumber(query['courses_avg'])) {
                    throw new Error('query is invalid')
                }
            } else if (key == "GT") {
                if (!isNumber(query['courses_avg'])) {
                    throw new Error('query is invalid')
                }
            } else if (key == "EQ") {
                if (!isNumber(query['courses_avg'])) {
                    throw new Error('query is invalid')
                }
            }
            */
            this.checkIsNumber(query, key, 'courses_avg');
            return this.evaluate(query, key, 'courses_avg');


        }
        if (query.hasOwnProperty('courses_pass')) {
            /*
            if (key == "LT") {
                if (!isNumber(query['courses_pass'])) {
                    throw new Error('query is invalid')
                }
            } else if (key == "GT") {
                if (!isNumber(query['courses_pass'])) {
                    throw new Error('query is invalid')
                }
            } else if (key == "EQ") {
                if (!isNumber(query['courses_pass'])) {
                    throw new Error('query is invalid')
                }
            }
            */
            this.checkIsNumber(query, key, 'courses_pass');
            return this.evaluate(query, key, 'courses_pass');
        }
        if (query.hasOwnProperty('courses_fail')) {
            /*
            if (key == "LT") {
                if (!isNumber(query['courses_fail'])) {
                    throw new Error('query is invalid')
                }
            } else if (key == "GT") {
                if (!isNumber(query['courses_fail'])) {
                    throw new Error('query is invalid')
                }
            } else if (key == "EQ") {
                if (!isNumber(query['courses_fail'])) {
                    throw new Error('query is invalid')
                }
            }
            */
            this.checkIsNumber(query, key, 'courses_fail');
            return this.evaluate(query, key, 'courses_fail');
        }
        if (query.hasOwnProperty('courses_audit')) {
            /*
            if (key == "LT") {
                if (!isNumber(query['courses_audit'])) {
                    throw new Error('query is invalid')
                }
            } else if (key == "GT") {
                if (!isNumber(query['courses_audit'])) {
                    throw new Error('query is invalid')
                }
            } else if (key == "EQ") {
                if (!isNumber(query['courses_audit'])) {
                    throw new Error('query is invalid')
                }
            }
            */
            this.checkIsNumber(query, key, 'courses_audit');
            return this.evaluate(query, key, 'courses_audit');
        }

    }

    checkIsNumber(query: any, key: string, m_key: string) {
        if (key == "LT") {
            if (!isNumber(query[m_key])) {
                throw new Error('query is invalid')
            }
        } else if (key == "GT") {
            if (!isNumber(query[m_key])) {
                throw new Error('query is invalid')
            }
        } else if (key == "EQ") {
            if (!isNumber(query[m_key])) {
                throw new Error('query is invalid')
            }
        }
    }

    evaluate(query: any, key: string, m_key: string): Array<any> {
        let results: Array<any> =  new Array();
        for(let obj of this.dataset) {
            if (this.negation) {
                if (obj.hasOwnProperty(m_key)) {
                    if (key == "LT" && !obj[m_key] < query) {
                        results.push(obj);
                    } else if (key == "GT" && !obj[m_key] > query) {
                        results.push(obj);
                    } else if (key == "EQ" && !obj[m_key] == query) {
                        results.push(obj);
                    }
                }
            } else {
                if (obj.hasOwnProperty(m_key)) {
                    if (key == "LT" && obj[m_key] < query) {
                        results.push(obj);
                    } else if (key == "GT" && obj[m_key] > query) {
                        results.push(obj);
                    } else if (key == "EQ" && obj[m_key] == query) {
                        results.push(obj);
                    }
                }
            }
        }
        return results;
    }


}
