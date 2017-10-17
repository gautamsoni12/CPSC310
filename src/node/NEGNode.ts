import Log from "../Util";

//NEGATION node: FILTER
export class NEGNode {

    constructor() {

    }

    typeCheck(query: any) {
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
        //do something //TODO:
    }

    evaluate() {

    }


}