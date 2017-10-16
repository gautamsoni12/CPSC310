import Log from "../Util";

//LOGICCOMPARISON NODE : {FILTER, FILTER*}

export class LOGICCOMPNode  {

    constructor() {

    }

    /**
     * checks query to see if grammar is valid
     * @param query: query to be typeChecked
     * @param {string} key:
     */
    typeCheck(query: any, key: string) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "AND" || keys[i] != "OR" || keys[i] != "LT" || keys[i] != "GT" || keys[i] != "EQ" ||
                keys[i] != "IS" || keys[i] != "NOT") {
                throw new Error("query is invalid");
            }
        }
        this.parse(query);
    }

    parse(query: any) {
        //PARSE FILTER
    }

    evaluate() {

    }

}