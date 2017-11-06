/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util";

'use strict';


import {EVALUATENODE} from "../node/EVALUATENODE";

const fs = require("fs");
import {QUERYNode} from "../node/QUERYNode";
import {Course} from "./Course";
import {Rooms} from "./Rooms";

export interface Result {
    result: Array<any>;        // An array of dataset
}


export interface Dataset {

    id: string;                 // DataSet ID.
    dataset: Array<any>;        // An array of dataset

}

'use strict';

let JSZip = require('jszip');
const parse5 = require('parse5');

let UBCInsight1: Array<any> = [];
let UBCInsight = new Map();
let code: number = 400;
let queryColumns: Array<any> = [];
let tempResults: Array<any> = [];
let queryID: string;
let tempResult1: Array<any> = [];

export default class InsightFacade implements IInsightFacade {


    constructor() {
        Log.trace('InsightFacadeImpl::init()');

    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        return new Promise(function (resolve, reject) {
            try {
                if (content != null) {
                    var zipContent: Array<any> = [];
                    if (id === "courses") {
                        let newCourse = new Course(id, content);
                        newCourse.loadfile(content).then(function (value: Array<any>) {
                            zipContent = value;
                            code = addDatasetResult(id, zipContent);//.then(function (value: any) {
                                //code = value;

                            //});
                            if (code === 201) {
                                resolve({
                                    code: code,
                                    body: {res: 'the operation was successful and the id already existed'}
                                });
                            }
                            else if (code === 204) {
                                resolve({code: code, body: {res: 'the operation was successful and the id was new'}});
                            }

                        }).catch(function (error: any) {
                            reject(error);
                        });
                    }
                    else if (id === "rooms") {

                        let ubcRooms = new Rooms(id, content);
                        ubcRooms.loadFile(content).then(function (value: Array<any>) {
                            zipContent = value;
                            code = addDatasetResult(id, zipContent);//.then(function (value: any) {
                               // code = value;
                           // });
                            if (code === 201) {
                                resolve({
                                    code: code,
                                    body: {res: 'the operation was successful and the id already existed'}
                                });
                            }
                            else if (code === 204) {
                                resolve({code: code, body: {res: 'the operation was successful and the id was new'}});
                            }

                        }).catch(function (error: any) {
                            reject(error);
                        });
                    }
                    else{
                        code = 400;
                        reject({code: code, body: {res: ("error: " + "wrong id")}});
                    }
                }
            } catch (error) {
                code = 400;
                reject({code: code, body: {res: ("error: " + error)}});
            }
        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        let code: number;
        return new Promise(function (resolve, reject) {
            try {
                if (UBCInsight1 === null) {
                    code = 404;
                    reject({
                        code: code,
                        body: {res: 'the operation was unsuccessful because the delete was for a resource that was not previously added.'}
                    });
                }
                else {
                    for (let insight of UBCInsight1) {
                        if (insight.id === id) {
                            code = 204;
                            var i = UBCInsight1.indexOf(insight);
                            if(i != -1) {
                                UBCInsight1.splice(i, 1);
                            }
                            resolve({code: code, body: {res: 'the operation was successful.'}});
                            break;
                        }
                        else {
                            code = 404;
                            reject({
                                code: code,
                                body: {res: 'the operation was unsuccessful because the delete was for a resource that was not previously added.'}
                            });
                            break;
                        }
                    }
                }
            } catch (error) {
                code = 404;
                reject({
                    code: code,
                    body: {res: 'the operation was unsuccessful because the delete was for a resource that was not previously added.'}
                });
            }
        });
    }


    performQuery(query: any): Promise<InsightResponse> {

        return new Promise(function (resolve, reject) {
            try {
                let qObject = JSON.parse(JSON.stringify(query));
                let option = (Object.getOwnPropertyDescriptor(qObject, "OPTIONS")).value;
                var where = (Object.getOwnPropertyDescriptor(qObject, "WHERE")).value;

                optionNode(option);

                whereNode(where);
                //console.log(tempResult1);
               // console.log(tempResult1);
                let myResult: Result = {result: tempResult1};
                console.log(myResult);
                resolve({code: code, body: myResult});
            } catch (error) {
                reject({code: 424, body: {res: 'the query failed because of a missing dataset'}});
            }

        });
    }
}


let m_keymain: any;
let m_keyvalue: any;

function optionNode(node: any) {
    //let orderNode = (Object.getOwnPropertyDescriptor(node, "ORDER")).value;

    let columnNode = (Object.getOwnPropertyDescriptor(node, "COLUMNS")).value;
    queryID = columnNode[0].split("_", 1);

    for (let insight of UBCInsight1) {
        if (Object.getOwnPropertyDescriptor(insight, "id").value === queryID[0]) {
            var dataToQuery: Array<any> = Object.getOwnPropertyDescriptor(insight, "dataset").value;
            break;
        }
    }
    for (let data of dataToQuery) {

        let resultObject: any = {};
        for (let queryColumn of columnNode) {
            resultObject[queryColumn] = Object.getOwnPropertyDescriptor(data, queryColumn).value;
        }
        tempResults.push(resultObject);
    }
    tempResults.sort( function (a: any, b: any){
        let orderNode:any = (Object.getOwnPropertyDescriptor(node, "ORDER")).value;
        //let orderNode1 = (Object.getOwnPropertyNames(node));
        if (typeof a ==='object' && typeof b ==='object') {
            if (a[orderNode] < b[orderNode])
                return -1;
            if (a[orderNode] > b[orderNode])
                return 1;
            return 0;
        }
    });

}




function addDatasetResult(id: string, dataArray: Array<any>): number {
    //return new Promise(function (resolve, reject) {
    try {
        if (UBCInsight1.length === 0) {
            let myDataset: Dataset = {id: id, dataset: dataArray};
            UBCInsight1.push(myDataset);
            //fs.writeFile(dataArray);
            code = 204;
            return code;

        } else {
            for (let Insight of UBCInsight1) {
                if (id === Insight.id) {
                    Insight.dataset = dataArray;
                    //fs.writeFile(dataArray);
                    code = 201;
                    return code;
                } else {
                    let myDataset: Dataset = {id: id, dataset: dataArray};
                    UBCInsight1.push(myDataset);
                    //fs.writeFile(dataArray);
                    code = 204;
                    return code;
                }
            }
        }
    } catch (error) {
        code = 400;
        console.log(error);
    }
    //});
}



function whereNode(node: any) {

    var logicComarator = Object.getOwnPropertyNames(node);
    for (let logic of logicComarator) {
        if (logic === 'AND') {

        }
        else if (logic === 'OR') {

        }
        var m_key = Object.getOwnPropertyDescriptor(node, logic).value; // m_key is Object with course_avg = 95;
        var m_key1 = Object.getOwnPropertyNames(m_key);
        m_keymain = m_key1[0];
        for (let key of m_key1) {
            m_keyvalue = Object.getOwnPropertyDescriptor(m_key, key);
            break;
        }
        if (logic === 'LT') {
            lessThan(tempResults);
            break;

        }
        else if (logic === 'GT') {
            greaterThan(tempResults);
            break;
        }
        else if (logic === 'EQ') {
            equalTo(tempResults);
            break;
        }
        else if (logic === 'IS') {
            is(tempResults);
            break;

        }
    }

}

function and() {

}
function is(queryArray: Array<any>) {

    for (let result of queryArray) {
        var abc = result[m_keymain];
        if (result[m_keymain] >= m_keyvalue.value) {
            var index = queryArray.indexOf(result);
            if (index > -1) {
                queryArray.splice(index, 1);
            }
        }
    }
}

function or() {

}

function lessThan(queryArray: Array<any>) {

    tempResult1 = queryArray.filter(function(result){
        return result[m_keymain] < m_keyvalue.value;
    });
}

function greaterThan(queryArray: Array<any>){


    tempResult1= queryArray.filter(function(result){
        return result[m_keymain] > m_keyvalue.value;
    });
}

function equalTo(queryArray: Array<any>) {

    tempResult1 = queryArray.filter(function(result){
        return result[m_keymain] === m_keyvalue.value;
    });
}


// function addDatasetResult(id: string, dataArray: Array<any>): number {
//     //return new Promise(function (resolve, reject) {
//         try {
//             if (UBCInsight1.length === 0) {
//                 let myDataset: Dataset = {id: id, dataset: dataArray};
//                 UBCInsight1.push(myDataset);
//                 //fs.writeFile(dataArray);
//                 code = 204;
//                 return(code);
//
//             } else {
//                 for (let Insight of UBCInsight1) {
//                     if (id === Insight.id) {
//                         let myDataset: Dataset = {id: id, dataset: dataArray};
//                         UBCInsight1.push(myDataset);
//                         //fs.writeFile(dataArray);
//                         code = 201;
//                         return(code);
//                     } else {
//                         let myDataset: Dataset = {id: id, dataset: dataArray};
//                         UBCInsight1.push(myDataset);
//                         //fs.writeFile(dataArray);
//                         code = 204;
//                         return(code);
//                     }
//                 }
//             }
//         } catch (error) {
//            console.log(error);
//         }
//     //});
// }
//

// let obj: Array<any>;
// let columns: Array<string>;
// let qNode: QUERYNode;
//
//
//     try {
//
//         qNode.typeCheck(query);
//         resolve({code: 200, body: {message: 'Query is valid'}});
//
//         // Loop returns filtered contents of value that matches query criteria
//         // TODO: Find way to pass each value in Map UBCinsight into for loop
//         let courses = UBCInsight.get("courses");
//
//         console.log(courses);
//
//         // for (let value of courses) {
//         //     //value == dataset contained in UBCinsight
//         //     qNode = new QUERYNode(value);
//         //     obj = qNode.typeCheck(query);
//         // }
//
//         //Constructs object to return for each obj in value based on columns array
//         // {key: obj, ...}
//         //TODO:
//
//         //sort results based on ORDER
//         //TODO:
//
//         resolve({code: 200, body: {message: 'Query is valid'}});
//     } catch (error) {
//         reject({code: 400, body: {message: 'Query failed. query is invalid'}});
//     }