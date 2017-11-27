

export class Body{
    node:any;
    queryArray: Array<any> = [];
    queryID: string = "";
     evaluatedResult: Array<any> =[];
     evaluatedResult_OR: Array<any> =[];
     m_comp: any;


    constructor(bodyNode:any, queryArray:Array<any>){
        this.node = bodyNode;
        this.queryArray = queryArray;
    }

    evaluate(){
        let x = this;
        try {

            if (Object.getOwnPropertyDescriptor(this.node, "AND")) {
                let andArray: Array<any> = (Object.getOwnPropertyDescriptor(this.node, "AND")).value;
                if (andArray.length < 1 ){ throw "EMPTY AND !"; }
                for (let array_node of andArray) {
                    let andNode = new Body(array_node, this.queryArray);
                    andNode.evaluate();
                    this.queryArray = andNode.evaluatedResult;
                }

            }
            else if (Object.getOwnPropertyDescriptor(this.node, "OR")) {
                let orArray: Array<any> = ( Object.getOwnPropertyDescriptor(this.node, "OR")).value;
                if (orArray.length < 1 ){ throw "EMPTY OR !"; }
                for (let array_node of orArray) {
                    let myOrNode = new Body(array_node, this.queryArray);
                    myOrNode.evaluate();
                    myOrNode.queryArray.forEach(function (result) {
                        x.evaluatedResult_OR.push(result);
                    });
                }
                this.queryArray = x.evaluatedResult_OR;
                x.evaluatedResult = x.evaluatedResult_OR;

            }
            else if (Object.getOwnPropertyDescriptor(this.node, "LT")) {
                x.m_comp = ( Object.getOwnPropertyDescriptor(this.node, "LT")).value;
                this.evaluateLT(x.m_comp, this.queryArray);
                this.queryArray = x.evaluatedResult;
            }
            else if (Object.getOwnPropertyDescriptor(this.node, "GT")) {
                x.m_comp = ( Object.getOwnPropertyDescriptor(this.node, "GT")).value;
                this.evaluateGT(x.m_comp, this.queryArray);
                this.queryArray = x.evaluatedResult;
            }
            else if (Object.getOwnPropertyDescriptor(this.node, "EQ")) {
                x.m_comp = ( Object.getOwnPropertyDescriptor(this.node, "EQ")).value;
                this.evaluateEQ(x.m_comp, this.queryArray);
                this.queryArray = x.evaluatedResult;
            }
            else if (Object.getOwnPropertyDescriptor(this.node, "IS")) {
                x.m_comp = ( Object.getOwnPropertyDescriptor(this.node, "IS")).value;
                this.evaluateIS(x.m_comp, this.queryArray);
                this.queryArray = x.evaluatedResult;
            }
            else if (Object.getOwnPropertyDescriptor(this.node, "NOT")) {
                let notNode: any = ( Object.getOwnPropertyDescriptor(this.node, "NOT")).value;
                let notBody = new Body(notNode, this.queryArray);
                notBody.evaluate();
                let notArray = notBody.queryArray;
                this.queryArray = this.queryArray.filter( function( el ) {
                    return notArray.indexOf( el ) < 0;
                });
            }

        }catch(error){
            throw error.message;
        }
    }


    evaluateLT(node:any , arrayToQuery: Array<any>){
        let x = this;
        try {
            let m_comp_key_array = (Object.getOwnPropertyNames(node));
            let m_comp_key = m_comp_key_array[0];

            if( m_comp_key === "courses_avg" || m_comp_key === "courses_pass" || m_comp_key === "courses_fail" || m_comp_key === "courses_audit" || m_comp_key === "courses_year" || m_comp_key === "rooms_lat" || m_comp_key === "rooms_lon" || m_comp_key === "rooms_seats") {

                if (this.queryID === "") {
                    let queryID_array = m_comp_key.split("_", 1);
                    this.queryID = queryID_array[0];
                }

                let m_comp_value = Object.getOwnPropertyDescriptor(node, m_comp_key).value;
                var tempArray = arrayToQuery.filter(function (result) {
                    if (typeof m_comp_value === "number") {
                        return result[m_comp_key] < m_comp_value;
                    }
                    else {
                        throw "Invalid LT";
                    }
                });
            }
            else {
                throw "Invalid LT";
            }
        } catch (error) {
            throw new Error(error);
        }

        x.evaluatedResult = tempArray;

    }


    evaluateGT(node:any, arrayToQuery: Array<any>) {
        let x = this;

        try {
            let m_comp_key_array = (Object.getOwnPropertyNames(node));
            let m_comp_key = m_comp_key_array[0];

            if( m_comp_key === "courses_avg" || m_comp_key === "courses_pass" || m_comp_key === "courses_fail" || m_comp_key === "courses_audit" || m_comp_key === "courses_year" || m_comp_key === "rooms_lat" || m_comp_key === "rooms_lon" || m_comp_key === "rooms_seats") {

                if (this.queryID === "") {
                    let queryID_array = m_comp_key.split("_", 1);
                    this.queryID = queryID_array[0];
                }

                let m_comp_value = Object.getOwnPropertyDescriptor(node, m_comp_key).value;
                var tempArray = arrayToQuery.filter(function (result) {
                    if (typeof m_comp_value === "number") {
                        return result[m_comp_key] > m_comp_value;
                    }
                    else {
                        throw "Invalid GT";
                    }
                });
            }
            else {
                throw "Invalid GT";
            }
        } catch (error) {
            throw new Error(error);
        }
        x.evaluatedResult = tempArray;
    }


    evaluateEQ(node:any ,arrayToQuery: Array<any>) {
        let x = this;

        try {
            let m_comp_key_array = (Object.getOwnPropertyNames(node));
            let m_comp_key = m_comp_key_array[0];

            if( m_comp_key === "courses_avg" || m_comp_key === "courses_pass" || m_comp_key === "courses_fail" || m_comp_key === "courses_audit" || m_comp_key === "courses_year" || m_comp_key === "rooms_lat" || m_comp_key === "rooms_lon" || m_comp_key === "rooms_seats") {

                if (this.queryID === "") {
                    let queryID_array = m_comp_key.split("_", 1);
                    this.queryID = queryID_array[0];
                }

                let m_comp_value = Object.getOwnPropertyDescriptor(node, m_comp_key).value;
                var tempArray = arrayToQuery.filter(function (result) {
                    if (typeof m_comp_value === "number") {
                        return result[m_comp_key] === m_comp_value;
                    }
                    else {
                        throw "Invalid EQ";
                    }
                });
            }
            else {
                throw "Invalid EQ";
            }
        } catch (error) {
            throw new Error(error);
        }
        x.evaluatedResult = tempArray;

    }

    evaluateIS(node:any ,arrayToQuery: Array<any>) {
        let x = this;
        try {

            var m_comp_key_array = (Object.getOwnPropertyNames(node));
            var m_comp_key = m_comp_key_array[0];

            if( m_comp_key === "courses_dept" || m_comp_key === "courses_id" || m_comp_key === "courses_instructor" || m_comp_key === "courses_title" || m_comp_key === "courses_uuid" || m_comp_key === "rooms_fullname" || m_comp_key === "rooms_shortname" || m_comp_key === "rooms_number" || m_comp_key === "rooms_name" || m_comp_key === "rooms_address" || m_comp_key === "rooms_type" || m_comp_key === "rooms_furniture" || m_comp_key === "rooms_href") {

                if (this.queryID === "") {
                    let queryID_array = m_comp_key.split("_", 1);
                    this.queryID = queryID_array[0];
                }

                var m_comp_value = Object.getOwnPropertyDescriptor(node, m_comp_key).value;
                var tempArray = arrayToQuery.filter(function (result) {
                    if (typeof  m_comp_value === "string") {
                        if ((m_comp_value).includes("**")) {
                            throw "Invalid string";
                        }

                        let inputString = m_comp_value.split("*", 3);
                        let inputString1 = inputString[0];
                        let inputString2 = inputString[1];
                        let inputString3 = inputString[2];

                        if (m_comp_value.startsWith("*") && m_comp_value.endsWith("*")) {
                            return (result[m_comp_key].includes(inputString2));
                        }
                        else if (m_comp_value.startsWith("*")) {
                            return (result[m_comp_key].endsWith(inputString2));
                        }
                        else if (m_comp_value.endsWith("*")) {
                            return (result[m_comp_key].startsWith(inputString1));
                        }
                        else {
                            return (result[m_comp_key] === (inputString1));
                        }
                    }
                });
            }
            else {
                throw "Invalid IS";
            }
        } catch (error) {
            throw new Error(error);
        }
        x.evaluatedResult = tempArray;
    }
}
