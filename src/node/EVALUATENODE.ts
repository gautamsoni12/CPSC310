import Log from "../Util";

//NEGATION node: FILTER
export class EVALUATENODE {
    private columns:Array<string>;
    private andFilters: Array<string>;
    private orFilters: Array<string>;

    private avgLessThan: number;
    private passLessThan: number;
    private failLessThan: number;
    private auditLessThan: number;

    private avgGreaterThan: number;
    private passGreaterThan: number;
    private failGreaterThan: number;
    private auditGreaterThan: number;

    private avgEqualTo: number;
    private passEqualTo: number;
    private failEqualTo: number;
    private auditEqualTo: number;

    private deptInputString: string;
    private idInputString: string;
    private instructorInputString: string;
    private titleInputString: string;
    private uuidInputString: string;

    private negation: boolean;

    private gtAvg: boolean;
    private gtPass: boolean;
    private gtFail: boolean;
    private gtAudit: boolean;

    private ltAvg: boolean;
    private ltPass: boolean;
    private ltFail: boolean;
    private ltAudit: boolean;

    private eqAvg: boolean;
    private eqPass: boolean;
    private eqFail: boolean;
    private eqAudit: boolean;

    private inputS: boolean;




    private order: string;

    constructor() {
        this.andFilters = new Array();
        this.orFilters = new Array();
        this.columns = new Array();
        this.order = "none";
        this.negation = false;

        this.gtAvg = false;
        this.gtPass = false;
        this.gtFail = false;
        this.gtAudit = false;

        this.ltAvg = false;
        this.ltPass = false;
        this.ltFail = false;
        this.ltAudit = false;

        this.eqAvg = false;
        this.eqPass = false;
        this.eqFail = false;
        this.eqAudit = false;

        this.inputS = false;
    }

    addToColumns(key: string) {
        this.columns.push(key);
    }

    addToAndfilters(key: string) {
        this.andFilters.push(key);
    }

    addToOrfilters(key: string) {
        this.orFilters.push(key);
    }

    setLessThan(numb: number, key: string) {
        if (key == "avg") {
            this.avgLessThan = numb;
            this.ltAvg= true;
        } else if (key == "pass") {
            this.passLessThan = numb;
            this.ltPass= true;
        } else if (key == "audit") {
            this.auditLessThan = numb;
            this.ltAudit = true;
        } else if (key == "fail") {
            this.failLessThan = numb;
            this.ltFail = true;
        }
    }

    setGreaterThan(numb: number, key: string) {
        if (key == "avg") {
            this.avgGreaterThan = numb;
            this.gtAvg = true;
        } else if (key == "pass") {
            this.passGreaterThan = numb;
            this.gtPass = true;
        } else if (key == "audit") {
            this.auditGreaterThan = numb;
            this.gtAudit = true;
        } else if (key == "fail") {
            this.failGreaterThan = numb;
            this.gtFail = true;
        }
    }

    setEqualTo(numb: number, key: string) {
        if (key == "avg") {
            this.avgEqualTo = numb;
            this.eqAvg = true;
        } else if (key == "pass") {
            this.passEqualTo = numb;
            this.eqPass = true;
        } else if (key == "audit") {
            this.auditEqualTo = numb;
            this.eqAudit = true;
        } else if (key == "fail") {
            this.failEqualTo = numb;
            this.eqFail = true;
        }
    }

    setInputStrings(input: string, key: string) {
        if (key == "dept") {
            this.deptInputString = input;
            this.inputS = true;
        } else if (key == "instruct") {
            this.instructorInputString = input;
            this.inputS = true;
        } else if (key == "id") {
            this.idInputString = input;
            this.inputS = true;
        } else if (key == "uuid") {
            this.uuidInputString = input;
            this.inputS = true;
        } else if (key == "title") {
            this.titleInputString = input;
            this.inputS = true;
        }
    }

    setNegation() {
        this.negation = true;
    }

    setOrder(key: string) {
        this.order = key;
    }

    evaluate(dataset: any, obj: any) {
        for (let i = 0; i < dataset.length; i++) {
            if (this.eqAvg) {
                for  (let i  = 0; this.columns.length; i++) {
                    if (this.columns[i] == "courses_avg") {
                        
                    } else {

                    }
                }
            }
        }
    }

}