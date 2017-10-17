import Log from "../Util";
import {COLUMNSNode} from "./COLUMNSNode";
import {ORDERNode} from "./ORDERNode";

//OPTION NODE: COLUMNS , ORDER: KEYS

export class OPTIONnode {

    constructor() {

    }

    /**
     * checks query to make sure grammar is valid
     * @param query: query to be typeChecked
     */
    typeCheck(query: any) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "COLUMNS" || keys[i] != "ORDER") {
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
        if (query.hasOwnProperty('COLUMNS')) {
            let cNOde: COLUMNSNode = new COLUMNSNode();
            cNOde.typeCheck(query['COLUMNS']);
        }
        if (query.hasOwnProperty('ORDER')) {
            let oNode: ORDERNode = new ORDERNode();
            oNode.typeCheck(query['ORDER']);
        }
    }

    evaluate() {

    }


}
