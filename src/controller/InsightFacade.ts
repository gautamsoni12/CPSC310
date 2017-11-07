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

let UBCInsight1: Array<any> = [];
let code: number = 400;
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
                            code = addDatasetResult(id, zipContent);
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
                    else {
                        code = 400;
                        reject({code: code, body: {res: ("error: " + "wrong id")}});
                    }
                }
            } catch (error) {
                code = 400;
                reject({code: code, body: {res: ("error: " + error.message)}});
            }
        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        let code: number;
        return new Promise(function (resolve, reject) {
            try {
                if (UBCInsight1.length < 1) {
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
                            if (i != -1) {
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
        /*
        return new Promise(function (resolve, reject) {
            try {
                //Dataset: {id: , dataArray: array}
                for (let dataset of UBCInsight1) {
                    let qNode = new QUERYNode(dataset.dataset);
                    qNode.typeCheck(query);

                }
            } catch (err) {
                reject({code: 400, body: {res: "Query is Invalid"}})
            }
            return null
        })
        */

        return new Promise(function (resolve, reject) {
            try {
                let qObject = JSON.parse(JSON.stringify(query));
                let option = (Object.getOwnPropertyDescriptor(qObject, "OPTIONS")).value;
                var where = (Object.getOwnPropertyDescriptor(qObject, "WHERE")).value;
                try {
                    optionNode(option);
                    //console.log(tempResults);

                    whereNode(where);
                    let myResult: Result = {result: tempResult1};
                    //console.log(myResult);
                    code = 200;

                    resolve({code: code, body: myResult});

                } catch (error) {
                    if (error.message === "missing dataset") {
                        code = 424;
                        reject({code: code, body: {error: 'the query failed' + error}});
                    }
                    else if (error) {
                        code = 400;
                        reject({code: code, body: {error: 'the query failed' + error}});
                    }
                }
            } catch (error) {

                reject({code: 400, body: {res: 'the query failed because of a missing dataset'}});
            }

        });

    }
}

let m_keymain: any;
let m_keyvalue: any;

function optionNode(node: any) {
    //try {
        let columnNode = (Object.getOwnPropertyDescriptor(node, "COLUMNS")).value;

        queryID = columnNode[0].split("_", 1);
        if (UBCInsight1.length === 0) {
            throw "empty dataset";
        }

        for (let insight of UBCInsight1) {
            if (Object.getOwnPropertyDescriptor(insight, "id").value === queryID[0]) {
                var dataToQuery: Array<any> = Object.getOwnPropertyDescriptor(insight, "dataset").value;
                if (dataToQuery === null) {
                    throw new Error("missing dataset");
                }
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
        if ((Object.getOwnPropertyDescriptor(node, "ORDER"))) {
        let orderNode: any = (Object.getOwnPropertyDescriptor(node, "ORDER")).value;

            tempResults.sort(function (a: any, b: any) {


                if (typeof a === 'object' && typeof b === 'object') {
                    if (a[orderNode] < b[orderNode])
                        return -1;
                    if (a[orderNode] > b[orderNode])
                        return 1;
                    return 0;
                }
            });
        }

    // } catch (error) {
    //     throw Error(error.message);
    // }
}



function whereNode(node: any) {
    try {

        let logicComarator = Object.getOwnPropertyNames(node);
        let andNode = Object.getOwnPropertyDescriptor(node, "AND");
        let orNode = Object.getOwnPropertyDescriptor(node, "OR");
        for (let logic of logicComarator) {
            if (andNode) {
                andFunction(andNode.value);
            }
            else if (orNode) {
                andFunction(orNode.value);
            }
            let m_key = Object.getOwnPropertyDescriptor(node, logic).value; // m_key is Object with course_avg = 95;
            var m_key1 = Object.getOwnPropertyNames(m_key);
            m_keymain = m_key1[0];
            for (let key of m_key1) {
                m_keyvalue = Object.getOwnPropertyDescriptor(m_key, key);
                break;
            }
            if (logic === 'LT') {
                lessThan(tempResults);

            }
            else if (logic === 'GT') {
                greaterThan(tempResults);
            }
            else if (logic === 'EQ') {
                equalTo(tempResults);

            }
            else if (logic === 'IS') {
                is(tempResults);

            }
            else if (logic === 'IS') {
                not(tempResults);


            }
        }
    }
    catch (error) {
        throw Error(error.message);
    }

}

function andFunction(node: Array<any>) {
    try {
        node.forEach(function(innerNode:any){

            let andNode = Object.getOwnPropertyDescriptor(innerNode, "AND");
            let orNode = Object.getOwnPropertyDescriptor(innerNode, "OR");
            if (andNode) {
                andFunction(andNode.value);
            }
            else if (orNode) {
                andFunction(orNode.value);
            }
            else{
                whereNode(innerNode);
            }
        });

    }
    catch (error) {
        throw Error(error.message);
    }

}



function not(queryArray: Array<any>) {
    try {

        tempResult1 = queryArray.filter(function (result) {
            if (typeof result[m_keymain] === "string" && result[m_keymain] != "") {
                var inputString = m_keyvalue.value.split("*", 1);
                return !(result[m_keymain].includes(inputString));
            }
        });
    } catch (error) {
        throw new Error(error);
    }

}

function is(queryArray: Array<any>) {
    try {

        tempResult1 = queryArray.filter(function (result) {
            if (typeof result[m_keymain] === "string" && result[m_keymain] != "") {
                let inputString = m_keyvalue.value.split("*", 3);
                let inputString1 = inputString[0];
                let inputString2 = inputString[1];
                let inputString3 = inputString[2];
                if (inputString1 != ""){
                return (result[m_keymain].includes(inputString1));
            }
                else if (inputString2 != ""){
                    return (result[m_keymain].includes(inputString2));
                }
                else if (inputString3 != ""){
                    return (result[m_keymain].includes(inputString3));
                }
            }
        });
    } catch (error) {
        throw new Error(error);
    }

}


function lessThan(queryArray: Array<any>) {
    try {
        tempResult1 = queryArray.filter(function (result) {
            //if (Number.isInteger(result[m_keymain])) {
                return result[m_keymain] < m_keyvalue.value;
            //}
        });
    } catch (error) {
        throw new Error(error);
    }
}

function greaterThan(queryArray: Array<any>) {

    try {

        tempResult1 = queryArray.filter(function (result) {
            //if (Number.isInteger(result[m_keymain])) {
                //console.log(result[m_keymain]);
                return result[m_keymain] > m_keyvalue.value;
            //}
        });
    } catch (error) {
        throw new Error(error);
    }
}

function equalTo(queryArray: Array<any>) {

    try {

        tempResult1 = queryArray.filter(function (result) {
            //if (Number.isInteger(result[m_keymain])) {
                return result[m_keymain] === m_keyvalue.value;
            //}
        });
    } catch (error) {
        throw new Error(error);
    }
}
function addDatasetResult(id: string, dataArray: Array<any>): number {

    try {
        if (UBCInsight1.length === 0) {
            let myDataset: Dataset = {id: id, dataset: dataArray};
            UBCInsight1.push(myDataset);
            fs.writeFileSync(id, dataArray);
            code = 204;
            return code;

        } else {
            for (let Insight of UBCInsight1) {
                if (id === Insight.id) {
                    Insight.dataset = dataArray;
                    fs.writeFileSync(id,dataArray);
                    code = 201;
                    return code;
                } else {
                    let myDataset: Dataset = {id: id, dataset: dataArray};
                    UBCInsight1.push(myDataset);
                    fs.writeFileSync(id, dataArray);
                    code = 204;
                    return code;
                }
            }
        }
    } catch (error) {
        code = 400;
        console.log(error);
    }

}

