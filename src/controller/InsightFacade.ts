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
import {Dataset} from "./Dataset";

//import isEmpty = ts.isEmpty;


let JSZip = require('jszip');
const parse5 = require('parse5');

let UBCInsight1: Array<any> = [];
let UBCInsight = new Map();
let code: number = null;
let queryColumns: Array<any> = [];
let tempResults: Array<any> = [];
let queryID: string;

export default class InsightFacade implements IInsightFacade {



    constructor() {
        Log.trace('InsightFacadeImpl::init()');

    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        var x =this;
        return new Promise(function (resolve, reject) {
            try {
                if (content != null) {
                    var zipContent: Array<any> = [];
                    if (id === "courses") {
                        let newCourse = new Course(id, content);
                        newCourse.loadfile(content).then(function (value: Array<any>) {
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

                    else if (id === "rooms") {

                        let ubcRooms = new Rooms(id, content);
                        ubcRooms.loadFile(content).then(function (value: any) {
                            zipContent = ubcRooms.listOfRooms;
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
                }
            } catch (error) {
                code = 400;
                reject({"code": code, "body": {res: ("error" + error)}});
            }
        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        let code: number;
        return new Promise(function (resolve, reject) {
            try {
                if (UBCInsight.has(id)) {
                    code = 204;
                    UBCInsight.delete(id);
                    resolve({code: code, body: {res: 'the operation was successful.'}});
                }
                else {
                    code = 404;
                    reject({
                        code: code,
                        body: {res: 'the operation was unsuccessful because the delete was for a resource that was not previously added.'}
                    });

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
                let where = (Object.getOwnPropertyDescriptor(qObject, "WHERE")).value;

                //whereNode(where);

                var orderNode = (Object.getOwnPropertyDescriptor(option, "ORDER")).value;

                let columnNode = (Object.getOwnPropertyDescriptor(option, "COLUMNS")).value;
                queryID = columnNode[0].split("_", 1);

                for (let insight of UBCInsight1) {
                    if (Object.getOwnPropertyDescriptor(insight, "id").value === queryID[0]) {
                        var dataToQuery: Array<any> = Object.getOwnPropertyDescriptor(insight, "dataset").value;
                        break;
                    }
                }
                for (let data of dataToQuery) {
                    let resultObject: any = {};
                    for (let queryColumn of queryColumns) {
                        resultObject.queryColumn = Object.getOwnPropertyDescriptor(data, queryColumn).value;
                    }
                    tempResults.push(resultObject);
                }

                tempResults.sort(compare);
                resolve(tempResults);
            }catch (error){
                reject(error);
            }

        });
    }
}
function compare(a: any, b: any) {
    if (a.orderNode < b.orderNode)
        return -1;
    if (a.orderNode > b.orderNode)
        return 1;
    return 0;
}

let m_keymain:any;
let m_keyvalue:any;

function whereNode(node:any){

    var logicComarator = Object.getOwnPropertyNames(node);
    for (let logic of logicComarator) {
        var m_key = Object.getOwnPropertyDescriptor(node, logic).value; // m_key is Object with  course_avg = 95;
        var m_key1 =  Object.getOwnPropertyNames(m_key);
        m_keymain = m_key1[0];
        for (let key of m_key1){
            m_keyvalue = Object.getOwnPropertyDescriptor(m_key, key);
        }
        if (logic === 'LT'){
            lessThan(tempResults);

        }
        else if (logic === 'GT'){
            greaterThan(tempResults);
        }
        else if (logic === 'EQ'){
            equalTo(tempResults);
        }
        else if (logic === 'AND'){

        }
        else if (logic === 'OR'){

        }
    }

}

function and(){

}
function or(){

}

function lessThan(queryArray: Array<any>){
    for( let result of tempResults){
        if (result[m_keymain] >= m_keyvalue){
            var index = tempResults.indexOf(result);
            if (index > -1) {
                tempResults.splice(index, 1);
            }
        }
    }

}

function greaterThan(queryArray: Array<any>){
    for( let result of tempResults){
        if (result[m_keymain] <= m_keyvalue){
            var index = tempResults.indexOf(result);
            if (index > -1) {
                tempResults.splice(index, 1);
            }
        }
    }
}

function equalTo(queryArray: Array<any>){
    for( let result of tempResults){
        if (result[m_keymain] != m_keyvalue){
            var index = tempResults.indexOf(result);
            if (index > -1) {
                tempResults.splice(index, 1);
            }
        }
    }
}



function addDatasetResult(id: string, dataArray: Array<any>): number {

    if (UBCInsight1.length === 0) {
        let myDataset: Dataset = {id: id, dataset: dataArray};
        UBCInsight1.push(myDataset);
        //fs.writeFile(dataArray);
        code = 204;
        return code;

    } else {
        for (let Insight of UBCInsight1) {
            if (id === Insight.id) {
                let myDataset: Dataset = {id: id, dataset: dataArray};
                UBCInsight1.push(myDataset);
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
}



let query = {
    "WHERE":{
        "GT":{
            "courses_avg":97
        }
    },
    "OPTIONS":{
        "COLUMNS":[
            "courses_dept",
            "courses_avg"
        ],
        "ORDER":"courses_avg"
    }
};


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