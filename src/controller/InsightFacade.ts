/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util";

'use strict';

const fs = require("fs");

import {Course} from "./Course";
import {Rooms} from "./Rooms";

export interface Dataset {

    id: string;                 // DataSet ID.
    dataset: Array<any>;        // An array of dataset

}

'use strict';

import {Body} from "../Query/BODY";
import {Options} from "../Query/OPTIONS";
import {Transformation} from "../Query/TRANSFORMATIONS";

let UBCInsight1: Array<any> = [];
let code: number = 0;
let where: any;
let qID: string;


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
                            reject({code: code, body: {error: ("error: " + error.message)}});
                        });
                    }
                    else {
                        code = 400;
                        reject({code: code, body: {error: ("error: " + "wrong id")}});
                    }
                }
            } catch (error) {
                code = 400;
                reject({code: code, body: {error: ("error: " + error.message)}});
            }
        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function (resolve, reject) {
            try {
                if (UBCInsight1.length < 1) {
                    code = 404;
                    reject({
                        code: code,
                        body: {error: 'the operation was unsuccessful because the delete was for a resource that was not previously added.'}
                    });
                }
                else {
                    for (let insight of UBCInsight1) {
                        if (insight.id === id) {
                            code = 204;
                            let i = UBCInsight1.indexOf(insight);
                            if (i != -1) {
                                UBCInsight1.splice(i, 1);
                            }
                            fs.unlink(i);
                            resolve({code: code, body: {res: 'the operation was successful.'}});

                        }
                        else {
                            code = 404;
                            reject({
                                code: code,
                                body: {error: 'the operation was unsuccessful because the delete was for a resource that was not previously added.'}
                            });

                        }
                    }
                }
            } catch (error) {
                code = 404;
                reject({
                    code: code,
                    body: {error: 'the operation was unsuccessful because the delete was for a resource that was not previously added.'}
                });
            }
        });
    }


    performQuery(query: any): Promise<InsightResponse> {
        return new Promise(function (resolve, reject) {
            try {
                let qObject = JSON.parse(JSON.stringify(query));
                try {
                    where = (Object.getOwnPropertyDescriptor(qObject, "WHERE")).value;
                    if (typeof where === 'undefined') {
                        throw "Invalid query. Body missing.";
                    }
                    getID(where);

                    let dataToQuery = getData(qID);
                    let queryBody = new Body(where, dataToQuery);
                    queryBody.evaluate();
                    let Array1: Array<any> = queryBody.queryArray;

                    if ((Object.getOwnPropertyDescriptor(qObject, "TRANSFORMATIONS"))) {
                        let transformation = (Object.getOwnPropertyDescriptor(qObject, "TRANSFORMATIONS")).value;
                        let queryTransformation = new Transformation(transformation, Array1);
                        queryTransformation.evaluate();
                        var Array3: Array<any> = queryTransformation.queryArray;
                    }


                    let option = (Object.getOwnPropertyDescriptor(qObject, "OPTIONS")).value;
                    if (typeof option === 'undefined') {
                        throw "Invalid query. Options missing.";
                    }
                    if (Array3) {
                        var queryOption = new Options(option, Array3);
                    }
                    else if (!Array3) {
                        var queryOption = new Options(option, Array1);
                    }

                    queryOption.evaluate();

                    let Array2: Array<any> = queryOption.queryArray;

                      console.log(Array2);


                    code = 200;
                    resolve({code: code, body: {result: Array2}});

                } catch (error) {
                    if (error.message === "missing dataset") {
                        code = 424;
                        reject({code: code, body: {error: 'the query failed' + error}});
                    }
                    else if (error) {
                        code = 400;
                        reject({code: code, body: {error: 'the query failed'}});
                    }
                }
            } catch (error) {

                reject({code: code, body: {error: 'the query failed because of a missing dataset'}});
            }

        });
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
                    fs.writeFileSync(id, dataArray);
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
        return code;
    }
}

function getID(whereNode: any){

    if (Object.getOwnPropertyDescriptor(whereNode, "AND")){
        let AND = (Object.getOwnPropertyDescriptor(whereNode, "AND")).value;
        for (let a of AND){
            getID(a);
            break;
        }
    }

    else if (Object.getOwnPropertyDescriptor(whereNode, "OR")){
        let OR = (Object.getOwnPropertyDescriptor(whereNode, "OR")).value;
        for (let a of OR){
            getID(a);
            break;
        }
    }
    else if (Object.getOwnPropertyDescriptor(whereNode, "NOT")){
        let NOT = (Object.getOwnPropertyDescriptor(whereNode, "NOT")).value;
        for (let a of NOT){
            getID(a);
            break;
        }
    }
    else if (Object.getOwnPropertyDescriptor(whereNode, "IS")){
        let IS = (Object.getOwnPropertyDescriptor(whereNode, "IS")).value;
        let qID_temp = Object.getOwnPropertyNames(IS);
        let qID_temp2 = qID_temp[0].split("_",1);
        qID = qID_temp2[0];


    }
    else if (Object.getOwnPropertyDescriptor(whereNode, "GT")){
        let GT = (Object.getOwnPropertyDescriptor(whereNode, "GT")).value;
        let qID_temp = Object.getOwnPropertyNames(GT);
        let qID_temp2 = qID_temp[0].split("_",1);
         qID = qID_temp2[0];

    }
    else if (Object.getOwnPropertyDescriptor(whereNode, "LT")){
        let LT = (Object.getOwnPropertyDescriptor(whereNode, "LT")).value;
        let qID_temp = Object.getOwnPropertyNames(LT);
        let qID_temp2 = qID_temp[0].split("_",1);
         qID = qID_temp2[0];
    }
    else if (Object.getOwnPropertyDescriptor(whereNode, "EQ")){
        let EQ = (Object.getOwnPropertyDescriptor(whereNode, "EQ")).value;
        let qID_temp = Object.getOwnPropertyNames(EQ);
        let qID_temp2 = qID_temp[0].split("_",1);
         qID = qID_temp2[0];

    }


}


function getData(id: any): Array<any>{

    for (let insight of UBCInsight1) {
        if (Object.getOwnPropertyDescriptor(insight, "id").value === id) {
            var dataToQuery: Array<any> = Object.getOwnPropertyDescriptor(insight, "dataset").value;
            if (dataToQuery === null) {
                throw new Error("missing dataset");
            }

        }
    }
    return dataToQuery;
}