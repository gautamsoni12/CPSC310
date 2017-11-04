/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util";

'use strict';


import {EVALUATENODE} from "../node/EVALUATENODE";

const fs = require("fs");
import {QUERYNode} from "../node/QUERYNode";
import {Course} from "./Courses";
import {Rooms} from "./Rooms";
import {Dataset} from "./Dataset";
//import isEmpty = ts.isEmpty;


let JSZip = require('jszip');
const parse5 = require('parse5');

let UBCInsight1:Array<any> =[];
let UBCInsight = new Map();
let code: number = null;

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
                                resolve({code: code, body: {res: 'the operation was successful and the id already existed'}});
                            }
                            else if (code === 204) {
                                resolve({code: code, body: {res: 'the operation was successful and the id was new'}});
                            }

                        }).catch(function (error) {
                            reject(error);
                        });

                    }

                    else if (id === "rooms") {

                        let ubcRooms = new Rooms(id, content);
                        ubcRooms.loadFile(content).then(function (value: any) {
                            zipContent = ubcRooms.listOfRooms;

                            code = addDatasetResult(id, zipContent);

                            if (code === 201) {
                                resolve({code: code, body: {res: 'the operation was successful and the id already existed'}});
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
        let obj: Array<any>;
        let columns: Array<string>;
        let qNode: QUERYNode;

        return new Promise(function (resolve, reject) {
            try {

                qNode.typeCheck(query);
                resolve({code: 200, body: {message: 'Query is valid'}});

                // Loop returns filtered contents of value that matches query criteria
                // TODO: Find way to pass each value in Map UBCinsight into for loop
                let courses = UBCInsight.get("courses");

                console.log(courses);

                // for (let value of courses) {
                //     //value == dataset contained in UBCinsight
                //     qNode = new QUERYNode(value);
                //     obj = qNode.typeCheck(query);
                // }

                //Constructs object to return for each obj in value based on columns array
                // {key: obj, ...}
                //TODO:

                //sort results based on ORDER
                //TODO:

                resolve({code: 200, body: {message: 'Query is valid'}});
            } catch (error) {
                reject({code: 400, body: {message: 'Query failed. query is invalid'}});
            }
        });
    }
}

function addDatasetResult(id: string, dataArray: Array<any>): number {

    if(UBCInsight1.length === 0){
        let myDataset: Dataset = {id: id, dataset: dataArray};
        UBCInsight1.push(myDataset);
        //fs.writeFile(dataArray);
        code = 204;
        return code;
    }else {
    for (let Insight of UBCInsight1){
        if (id === Insight.id) {
            let myDataset: Dataset = {id: id, dataset: dataArray};
            UBCInsight1.push(myDataset);
            //fs.writeFile(dataArray);
            code = 201;
            return code;
        }else {
            let myDataset: Dataset = {id: id, dataset: dataArray};
            UBCInsight1.push(myDataset);
            //fs.writeFile(dataArray);
            code = 204;
            return code;
        }

        }

    }

}
