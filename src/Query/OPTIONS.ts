// let evaluatedResult: Array<any> = [];

export class Options {
    node: any;
    queryArray: Array<any>;
    evaluatedResult: Array<any> = [];

    constructor(bodyNode: any, queryArray: Array<any>) {
        this.node = bodyNode;
        this.queryArray = queryArray;
    }

    evaluate() {
        let x = this;
        let columnNode = (Object.getOwnPropertyDescriptor(this.node, "COLUMNS")).value;

        if (columnNode.length < 1) {
            throw "empty dataset";
        }

        for (let data of this.queryArray) {
            let resultObject: any = {};
            for (let queryColumn of columnNode) {

                resultObject[queryColumn] = Object.getOwnPropertyDescriptor(data, queryColumn).value;
            }
            x.evaluatedResult.push(resultObject);
        }
        if (Object.getOwnPropertyDescriptor(this.node, "ORDER")){
            let sortNode = (Object.getOwnPropertyDescriptor(this.node, "ORDER")).value;
            this.evaluateOrder(sortNode);
        }

        this.queryArray = x.evaluatedResult;

    }

    evaluateOrder(node:any){
        let x = this;
        if (node.keys){
            node.keys.forEach(function (key:any) {

                if (node.dir === 'UP'){
                    x.evaluatedResult.sort(function (a: any, b: any) {

                        if (typeof a === 'object' && typeof b === 'object') {
                            if (a[key] < b[key])
                                return -1;
                            if (a[key] > b[key])
                                return 1;
                            return 0;
                        }
                    });
                }
                else if (node.dir === 'DOWN'){
                    x.evaluatedResult.sort(function (a: any, b: any) {

                        if (typeof a === 'object' && typeof b === 'object') {
                            if (a[key] > b[key])
                                return -1;
                            if (a[key] < b[key])
                                return 1;
                            return 0;
                        }
                    });
                }
            });
        }
        else{
            x.evaluatedResult.sort(function (a: any, b: any) {
                if (typeof a === 'object' && typeof b === 'object') {
                    if (a[node] < b[node])
                        return -1;
                    if (a[node] > b[node])
                        return 1;
                    return 0;
                }
            });

        }


    }




}
