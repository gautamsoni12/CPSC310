
let evaluatedResult: Array<any> =[];
let m_comp:any;

export class Body{
    node:any;
    queryArray: Array<any> = [];
    queryID: string = "";


    constructor(bodyNode:any, queryArray:Array<any>){
        this.node = bodyNode;
        this.queryArray = queryArray;
    }

    evaluate(){

        if (Object.getOwnPropertyDescriptor(this.node, "AND")){
            let andArray: Array<any> = (Object.getOwnPropertyDescriptor(this.node, "AND")).value;
            for (let array_node of andArray){
                let andNode = new Body(array_node, this.queryArray);
                andNode.evaluate();
                this.queryArray = evaluatedResult;
            }

        }
        else if (Object.getOwnPropertyDescriptor(this.node, "OR")){
           let orArray: Array<any> = ( Object.getOwnPropertyDescriptor(this.node, "OR")).value;
            for (let array_node of orArray){
                let myOrNode = new Body(array_node, this.queryArray);
                myOrNode.evaluate();
                myOrNode.queryArray.forEach(function (result) {
                    evaluatedResult.push(result);
                });
            }
            this.queryArray = evaluatedResult;
        }
        else if (Object.getOwnPropertyDescriptor(this.node, "LT")){
            m_comp = ( Object.getOwnPropertyDescriptor(this.node, "LT")).value;
            this.evaluateLT(m_comp, this.queryArray);
            this.queryArray = evaluatedResult;
        }
        else if (Object.getOwnPropertyDescriptor(this.node, "GT")){
            m_comp = ( Object.getOwnPropertyDescriptor(this.node, "GT")).value;
            this.evaluateGT(m_comp, this.queryArray);
            this.queryArray = evaluatedResult;
        }
        else if (Object.getOwnPropertyDescriptor(this.node, "EQ")){
            m_comp = ( Object.getOwnPropertyDescriptor(this.node, "EQ")).value;
            this.evaluateEQ(m_comp, this.queryArray);
            this.queryArray = evaluatedResult;
        }
        else if (Object.getOwnPropertyDescriptor(this.node, "IS")){
            m_comp = ( Object.getOwnPropertyDescriptor(this.node, "IS")).value;
            this.evaluateIS(m_comp, this.queryArray);
            this.queryArray = evaluatedResult;
        }
        else if (Object.getOwnPropertyDescriptor(this.node, "NOT")){
            m_comp = ( Object.getOwnPropertyDescriptor(this.node, "NOT")).value;
            this.queryArray = evaluatedResult;
        }
    }


    evaluateLT(node:any , arrayToQuery: Array<any>){
        try {
            let m_comp_key_array = (Object.getOwnPropertyNames(node));
            let m_comp_key = m_comp_key_array[0];

            if(this.queryID === ""){
                let queryID_array = m_comp_key.split("_", 1);
                this.queryID = queryID_array[0];
            }

            let m_comp_value = Object.getOwnPropertyDescriptor(node,m_comp_key).value;
            var tempArray = arrayToQuery.filter(function (result) {
                if (typeof result[m_comp_key] === "number") {
                    return result[m_comp_key] < m_comp_value;
                }
                else {
                    throw "Invalid LT";
                }
            });
        } catch (error) {
            throw new Error(error);
        }

        evaluatedResult = tempArray;

    }


    evaluateGT(node:any, arrayToQuery: Array<any>) {

        try {
            let m_comp_key_array = (Object.getOwnPropertyNames(node));
            let m_comp_key = m_comp_key_array[0];
            if(this.queryID === ""){
                let queryID_array = m_comp_key.split("_", 1);
                this.queryID = queryID_array[0];
            }

            let m_comp_value = Object.getOwnPropertyDescriptor(node,m_comp_key).value;
            var tempArray = arrayToQuery.filter(function (result) {
                if (typeof result[m_comp_key] === "number") {
                    return result[m_comp_key] > m_comp_value;
                }
                else {
                    throw "Invalid LT";
                }
            });
        } catch (error) {
            throw new Error(error);
        }
        evaluatedResult = tempArray;
    }


    evaluateEQ(node:any ,arrayToQuery: Array<any>) {

        try {
            let m_comp_key_array = (Object.getOwnPropertyNames(node));
            let m_comp_key = m_comp_key_array[0];
            if(this.queryID === ""){
                let queryID_array = m_comp_key.split("_", 1);
                this.queryID = queryID_array[0];
            }

            let m_comp_value = Object.getOwnPropertyDescriptor(node,m_comp_key).value;
            var tempArray = arrayToQuery.filter(function (result) {
                if (typeof result[m_comp_key] === "number") {
                    return result[m_comp_key] === m_comp_value;
                }
                else {
                    throw "Invalid LT";
                }
            });
        } catch (error) {
            throw new Error(error);
        }
        evaluatedResult = tempArray;

    }

    evaluateIS(node:any ,arrayToQuery: Array<any>) {
        try {

            var m_comp_key_array = (Object.getOwnPropertyNames(node));
            var m_comp_key = m_comp_key_array[0];
            if(this.queryID === ""){
                let queryID_array = m_comp_key.split("_", 1);
                this.queryID = queryID_array[0];
            }

            var m_comp_value = Object.getOwnPropertyDescriptor(node,m_comp_key).value;
            var tempArray = arrayToQuery.filter(function (result) {
                if (typeof result[m_comp_key] === "string") {
                    if ((m_comp_value).includes("**")){
                        throw "Invalid string";
                    }
                    let inputString = m_comp_value.split("*", 3);
                    let inputString1 = inputString[0];
                    let inputString2 = inputString[1];
                    let inputString3 = inputString[2];
                    if (inputString1 != "") {
                        return (result[m_comp_key].includes(inputString1));
                    }
                    else if (inputString2 != "") {
                        return (result[m_comp_key].includes(inputString2));
                    }
                    else if (inputString3 != "") {
                        return (result[m_comp_key].includes(inputString3));
                    }
                }
            });
        } catch (error) {
            throw new Error(error);
        }
        evaluatedResult = tempArray;
    }
}
