let evaluatedResult: Array<any> = [];

export class Options {
    node: any;
    queryArray: Array<any>;

    constructor(bodyNode: any, queryArray: Array<any>) {
        this.node = bodyNode;
        this.queryArray = queryArray;
    }

    evaluate() {

        let columnNode = (Object.getOwnPropertyDescriptor(this.node, "COLUMNS")).value;

        if (columnNode.length < 1) {
            throw "empty dataset";
        }

        for (let data of this.queryArray) {
            let resultObject: any = {};
            for (let queryColumn of columnNode) {

                resultObject[queryColumn] = Object.getOwnPropertyDescriptor(data, queryColumn).value;
            }
            evaluatedResult.push(resultObject);
        }
        let sortNode = (Object.getOwnPropertyDescriptor(this.node, "ORDER")).value;
        this.evaluateOrder(sortNode);
        this.queryArray = evaluatedResult;
       
    }

    evaluateOrder(node:any){

        if (node.keys){
            node.keys.forEach(function (key:any) {

                if (node.dir === 'UP'){
                    evaluatedResult.sort(function (a: any, b: any) {

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
                    evaluatedResult.sort(function (a: any, b: any) {

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


    }




}
