
let evaluatedResult: Array<any> = [];
let evaluatedResult2: Array<any> = [];

export class Transformation {
    node: any;
    queryArray: Array<any>;

    constructor(bodyNode: any, queryArray: Array<any>) {
        this.node = bodyNode;
        this.queryArray = queryArray;
    }

    evaluate() {
        evaluatedResult = this.queryArray;

        let groupNode = (Object.getOwnPropertyDescriptor(this.node, "GROUP")).value;

        this.evaluateApply();

        groupNode.forEach(function (group: any) {

            evaluatedResult2 = evaluatedResult.map(function(obj:any){


            });

        });

    }

    evaluateApply(){
        let applyNode = (Object.getOwnPropertyDescriptor(this.node, "APPLY")).value;

        applyNode.forEach(function (apply: any) {

            let applyToken = Object.keys(apply);
            //console.log(applyToken);
            applyToken.forEach(function (token) {
                let tokenNode = (Object.getOwnPropertyDescriptor(apply, token)).value;

                if (Object.getOwnPropertyDescriptor(tokenNode, "MAX")) {
                    let maxNode = (Object.getOwnPropertyDescriptor(tokenNode, "MAX")).value;

                    var newObj = Math.max.apply(Math, evaluatedResult.map(function (o: any) {
                        return o[maxNode];
                    }));

                }
                else if (Object.getOwnPropertyDescriptor(tokenNode, "MIN")) {
                    let minNode = (Object.getOwnPropertyDescriptor(tokenNode, "MAX")).value;
                }
                else if (Object.getOwnPropertyDescriptor(tokenNode, "AVG")) {
                    let avgNode = (Object.getOwnPropertyDescriptor(tokenNode, "MAX")).value;
                }
                else if (Object.getOwnPropertyDescriptor(tokenNode, "SUM")) {
                    let sumNode = (Object.getOwnPropertyDescriptor(tokenNode, "MAX")).value;
                }
                else if (Object.getOwnPropertyDescriptor(tokenNode, "COUNT")) {
                    let countNode = (Object.getOwnPropertyDescriptor(tokenNode, "MAX")).value;
                }

            });
        });
    }

}