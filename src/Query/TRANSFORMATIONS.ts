
let evaluatedResult: Array<any> = [];
let evaluatedResult2: Array<any> = [];
let evaluatedResult3: Array<any> = [];

export class Transformation {
    node: any;
    queryArray: Array<any>;

    constructor(bodyNode: any, queryArray: Array<any>) {
        this.node = bodyNode;
        this.queryArray = queryArray;
    }

    evaluate() {
        let x = this;
        evaluatedResult = this.queryArray;

        let groupNode = (Object.getOwnPropertyDescriptor(this.node, "GROUP")).value;

        groupNode.forEach(function (group: any) {

            evaluatedResult.map(function(obj:any){
                let group_each = obj[group];
                evaluatedResult2 = evaluatedResult.filter(function(e_res){
                    return e_res[group] === group_each;

                });
                x.evaluateApply(evaluatedResult2);
            });

        });
        this.queryArray = evaluatedResult3;

    }

    evaluateApply(gp_array: Array<any>){
        let applyNode = (Object.getOwnPropertyDescriptor(this.node, "APPLY")).value;


        applyNode.forEach(function (apply: any) {


            let applyToken = Object.keys(apply);


            applyToken.forEach(function (token) {
                let tokenNode = (Object.getOwnPropertyDescriptor(apply, token)).value;

                if (Object.getOwnPropertyDescriptor(tokenNode, "MAX")) {
                    let maxNode = (Object.getOwnPropertyDescriptor(tokenNode, "MAX")).value;

                    let maxItem = Math.max.apply(Math, gp_array.map(function (o: any) {
                        return o[maxNode];
                    }));


                    let maxObject = gp_array.filter(function(m_object){
                        return m_object[maxNode] === maxItem;
                    });

                    maxObject[0][token] = maxItem;
                    evaluatedResult3.push(maxObject[0]);


                }
                else if (Object.getOwnPropertyDescriptor(tokenNode, "MIN")) {
                    let minNode = (Object.getOwnPropertyDescriptor(tokenNode, "MIN")).value;

                    let minItem = Math.min.apply(Math, gp_array.map(function (o: any) {
                        return o[minNode];
                    }));

                    let minObject = gp_array.filter(function(m_object){
                        return m_object[minNode] === minItem;
                    });
                    minObject[0][token] = minItem;
                    evaluatedResult3.push(minObject[0]);

                }
                else if (Object.getOwnPropertyDescriptor(tokenNode, "AVG")) {
                    let avgNode = (Object.getOwnPropertyDescriptor(tokenNode, "AVG")).value;
                    var sum = 0;
                    gp_array.forEach(function (gp_object) {
                        sum += gp_object[avgNode];
                    });

                    var average = sum/gp_array.length;
                    gp_array[0][token] = average;
                    evaluatedResult3.push(gp_array[0]);

                }
                else if (Object.getOwnPropertyDescriptor(tokenNode, "SUM")) {
                    let sumNode = (Object.getOwnPropertyDescriptor(tokenNode, "SUM")).value;

                    var sum = 0;
                    gp_array.forEach(function (gp_object) {
                        sum += gp_object[sumNode];
                    });

                    gp_array[0][token] = sum;
                    evaluatedResult3.push(gp_array[0]);
                }
                else if (Object.getOwnPropertyDescriptor(tokenNode, "COUNT")) {
                    let countNode = (Object.getOwnPropertyDescriptor(tokenNode, "COUNT")).value;

                    let count = 0;
                    for (var i = 0; i < gp_array.length; i++){
                        count++;
                    }
                    gp_array[0][token] = count;
                    evaluatedResult3.push(gp_array[0]);
                }
            });
        });
    }

}