let Decimal = require('decimal.js');

export class Transformation {
    node: any;
    queryArray: Array<any>;
    evaluatedResult: Array<any> = [];
    evaluatedResult3: Array<any> = [];

    constructor(bodyNode: any, queryArray: Array<any>) {
        this.node = bodyNode;
        this.queryArray = queryArray;
    }

    evaluate() {
        try {
            let x = this;
            x.evaluatedResult = this.queryArray;

            let groupNode = (Object.getOwnPropertyDescriptor(this.node, "GROUP")).value;
            // let groupArray: Array<any>= [];
            //
            // x.evaluatedResult.forEach(function (obj:any) {
            //     let smallGroupArray: Array<any> = [];
            //     groupNode.forEach(function (group:any) {
            //         smallGroupArray.push(obj[group]);
            //     });
            //     groupArray.push(smallGroupArray);
            // });
            //
            // var tmp:Array<any> = [];
            //
            // var b = groupArray.filter(function (v) {
            //     if (tmp.indexOf(v.toString()) < 0) {
            //         tmp.push(v.toString());
            //         return v;
            //     }
            // });
            //
            // console.log(b);
            //
            //
            // let bucket: Array<any> = [];
            // b.forEach(function (value) {
            //     x.evaluatedResult.forEach(function(obj)
            //     {
            //         value.forEach(function (a: any) {
            //             groupNode.forEach(function (g:any) {
            //                if( obj[g] === a){
            //                    bucket.push(obj);
            //                }
            //             })
            //             });
            //
            //             bucket.push(obj);
            //
            //     });
            // });
            //
            //


            groupNode.forEach(function (group: any) {
                let groupArray: Array<any> = [];

                x.evaluatedResult.forEach(function (obj: any) {
                    let g = obj[group];
                    groupArray.push(g);
                });
                groupArray = groupArray.filter(function (item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });

                groupArray.forEach(function (value) {
                    let bucket: Array<any> = [];

                    x.evaluatedResult.forEach(function (g_obj) {
                        if (g_obj[group] === value) {
                            bucket.push(g_obj);
                        }
                    });
                    let applyNode = (Object.getOwnPropertyDescriptor(x.node, "APPLY")).value;
                    if (applyNode.length >= 1) {
                        x.evaluateApply(bucket);
                    } else {
                        let p = bucket[0];
                        x.evaluatedResult3.push(p);
                    }
                });

            });

            this.queryArray = x.evaluatedResult3;
        }catch (err){
            throw "invalid Group!";
        }

    }

    evaluateApply(gp_array: Array<any>) {
        let x = this;

        try {
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

                        let maxObject = gp_array.filter(function (m_object) {
                            return m_object[maxNode] === maxItem;
                        });

                        maxObject[0][token] = maxItem;
                        x.evaluatedResult3.push(maxObject[0]);

                    }
                    else if (Object.getOwnPropertyDescriptor(tokenNode, "MIN")) {
                        let minNode = (Object.getOwnPropertyDescriptor(tokenNode, "MIN")).value;

                        let minItem = Math.min.apply(Math, gp_array.map(function (o: any) {
                            return o[minNode];
                        }));

                        let minObject = gp_array.filter(function (m_object) {
                            return m_object[minNode] === minItem;
                        });
                        minObject[0][token] = minItem;
                        x.evaluatedResult3.push(minObject[0]);

                    }
                    else if (Object.getOwnPropertyDescriptor(tokenNode, "AVG")) {
                        let avgNode = (Object.getOwnPropertyDescriptor(tokenNode, "AVG")).value;


                        let arrayNum: Array<any> = [];
                        gp_array.forEach(function (value) {
                            arrayNum.push(value[avgNode]);
                        });

                        let avg: number = Number((arrayNum.map(val => <any>new Decimal(val)).reduce((a, b) => a.plus(b)).toNumber() / arrayNum.length).toFixed(2));

                        gp_array[0][token] = avg;
                        x.evaluatedResult3.push(gp_array[0]);

                    }
                    else if (Object.getOwnPropertyDescriptor(tokenNode, "SUM")) {
                        let sumNode = (Object.getOwnPropertyDescriptor(tokenNode, "SUM")).value;

                        let arrayNum: Array<any> = [];
                        gp_array.forEach(function (value) {
                            arrayNum.push(value[sumNode]);
                        });

                        let sum = Number(arrayNum.map((val: any) => new Decimal(val)).reduce((a, b) => a.plus(b)).toNumber().toFixed(2));
                        gp_array[0][token] = sum;
                        x.evaluatedResult3.push(gp_array[0]);
                    }
                    else if (Object.getOwnPropertyDescriptor(tokenNode, "COUNT")) {
                        let countNode = (Object.getOwnPropertyDescriptor(tokenNode, "COUNT")).value;

                        let count = 0;
                        for (var i = 0; i < gp_array.length; i++) {
                            count++;
                        }
                        gp_array[0][token] = count;
                        x.evaluatedResult3.push(gp_array[0]);
                    }
                });
            });
        } catch (error) {
            throw "Invalid ApplyToken"
        }

    }

}