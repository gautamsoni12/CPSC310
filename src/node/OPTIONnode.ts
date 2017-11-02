import Log from "../Util";
import {COLUMNSNode} from "./COLUMNSNode";
import {ORDERNode} from "./ORDERNode";
import {EVALUATENODE} from "./EVALUATENODE";

//OPTION NODE: COLUMNS , ORDER: KEYS

export class OPTIONnode {

    columnKey: boolean;
    orderKey: boolean;
    order: string;
    columns: Array<string>;

    constructor() {
        this.columnKey = false;
        this.orderKey = false;
        this.columns = new Array();
        this.order = "";
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
            //let cNOde: COLUMNSNode = new COLUMNSNode();
            //cNOde.typeCheck(query['COLUMNS']);
            this.columnKey = true;

        }
        if (query.hasOwnProperty('ORDER')) {
            //let oNode: ORDERNode = new ORDERNode();
            //oNode.typeCheck(query['ORDER']);
            this.orderKey = true;
        }
        this.evaluate(query);
    }

    evaluate(query: any) {
        if (this.columnKey) {
            let columnsNode: COLUMNSNode = new COLUMNSNode();
            this.columns = columnsNode.typeCheck(query['COLUMNS']);
        }
        if (this.orderKey) {
            let orderNode: ORDERNode = new ORDERNode();
            this.order = orderNode.typeCheck(query['ORDER']);
        }
    }

    getColumns(): Array<string> {
        return this.columns;
    }

    getOrder(): string {
        return this.order;
    }


}
