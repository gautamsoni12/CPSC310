import Log from "../Util";
import {InsightResponse} from "../controller/IInsightFacade";
import {WHEREnode} from "./WHEREnode";
import {OPTIONnode} from "./OPTIONnode";
import {EVALUATENODE} from "./EVALUATENODE";

//QUERY NODE
export class QUERYNode {
    private obj: any; //dont need this?
    private dataset: Array<any>;
    private whereKey: boolean;
    private optionKey: boolean;
    private columns: Array<string>;
    private order: string;

    constructor(dataset: Array<any>) {
        this.dataset = dataset;
        this.whereKey = false;
        this.optionKey = false;
        this.columns = new Array();
        this.order = "";


    }

    /**
     *@param query: query to be typeChecked
     *checks grammar of query to see if it matches grammar
     */
    typeCheck(query: any): Array<any> {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "WHERE" || keys[i] != "OPTIONS") {
                throw new Error;
            }
        }
        return this.parse(query);
    }

    /**
     * @param query: query to be parsed
     * Parses query to see if WHERE or OPTIONS keys are present
     **/
    parse(query: any): Array<any> {
        if (query.hasOwnProperty('WHERE')) {
            this.whereKey = true;
        }
        if (query.hasOwnProperty('OPTIONS')) {
            this.optionKey = true;
        }
        return this.evaluate(query)
    }



    evaluate(query: any):Array<any> {
        let oNode: OPTIONnode = new OPTIONnode();
        oNode.typeCheck(query['OPTIONS']);
        this.columns = oNode.getColumns();
        this.order = oNode.getOrder();

        let wNode: WHEREnode = new WHEREnode(this.dataset);
        return wNode.typeCheck(query['WHERE']);
    }

    getColumns(): Array<string> {
        return this.columns;
    }

    getOrder() :string {
        return this.order;
    }


}