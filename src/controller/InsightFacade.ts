/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util";

//import { Course } from './Courses';

'use strict';

const fs = require("fs");

import {QUERYNode} from "../node/QUERYNode";
import {Course} from "./Course";
import {Rooms} from "./Rooms";

let JSZip = require('jszip');
const parse5 = require('parse5');

let UBCInsight = new Map();
let code: number = null;

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');

    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        //let zipContent: any[];
        //let code: number = null;
        //let jsonArray: any[];

        return new Promise(function (resolve, reject) {
            try {
                if (content != null) {
                    let zipContent: any[];
                    if (id === "courses"){

                        let jsonArray: any[];

                        let newCourse = new Course(id, content);
                        newCourse. loadfile(content).then(function (value: Array<any>) {
                            zipContent = value;
                        }).catch(function (error) {
                            console.log(error,  'Not valid zip file') });
                        for (let files in zipContent) {
                            jsonArray.push(JSON.parse(files));
                        }
                        code = addDatasetResult(id,jsonArray);
                        if (code === 201){
                            resolve({ code: code, body: {res: 'the operation was successful and the id already existed'}});
                        }
                        else if (code === 204){
                            resolve({code: code, body: {res: 'the operation was successful and the id was new'}});
                        }

                    }

                    else if (id === "rooms"){

                        let ubcRooms = new Rooms(id, content);

                        ubcRooms.loadFile(content).then(function (value: any) {
                            zipContent = ubcRooms.listOfRooms;
                        }).catch(function (error: any) {
                            console.log(4);
                            console.log(error);
                        });

                        code = addDatasetResult(id,zipContent);
                        if (code === 201){
                            resolve({ code: code, body: {res: 'the operation was successful and the id already existed'}});
                        }
                        else if (code === 204){
                            resolve({code: code, body: {res: 'the operation was successful and the id was new'}});
                        }

                    }


                    //(content).then(function (value: any) {
                    //     console.log(value);



                        // if (UBCInsight.has(id)) {
                        //     UBCInsight.set(id, jsonArray);
                             //code = 201;
                        //     UBCInsight.set(id, jsonArray);
                        //     fs.writeFile(UBCInsight);
                             //resolve({ code: code, body: {res: 'the operation was successful and the id already existed'}});
                        // } else {
                        //     UBCInsight.set(id, jsonArray);
                        //     //fs.writeFile(UBCInsight);
                        //      code = 204;
                        //      resolve({code: code, body: {res: 'the operation was successful and the id was new'}});
                        // }



                    // loadfile(content).then(function (value: Array<any>) {
                    //     zipContent = value;
                    // }).catch(function (error) {
                    //     console.log(error,  'Not valid zip file') });
                    // for (let files in zipContent) {
                    //     jsonArray.push(JSON.parse(files));
                    // }


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
        let qNode: QUERYNode = new QUERYNode();
        return new Promise(function (resolve, reject) {
            try {
                qNode.typeCheck(query);
                resolve({code: 200, body: {message: 'Query is valid'}});
            } catch (error) {
                reject({code: 400, body: {message: 'Query failed. query is invalid'}});
            }
        })
    }
}


function addDatasetResult(id:string , dataArray: Array<any>) : number{

    if (UBCInsight.has(id)) {
        UBCInsight.set(id, dataArray);

        UBCInsight.set(id, dataArray);
        fs.writeFile(UBCInsight);
        code = 201;
        // resolve({
        //     code: code,
        //     body: {res: 'the operation was successful and the id already existed'}
        // });
    } else {
        UBCInsight.set(id, dataArray);
        fs.writeFile(UBCInsight);
        code = 204;
        // resolve({code: code, body: {res: 'the operation was successful and the id was new'}});
    }

    return code;

}






// let buildings: Array<any> = [];
//
// let rooms: Array<any> = [];
//
// function parseHtml(file: string): any {
//     let promiseArray: any[] = [];
//
//     return new Promise(function (fulfill, reject) {
//         let jsZip = new JSZip();
//         let data1: Array<string> = [];
//         try {
//             if (file != null) {
//                 jsZip.loadAsync(file, {base64: true}).then(function (zip: any) {
//                     zip.forEach(function (filename: any, file: any) {
//
//                         if (!file.dir) {
//                             //if (filename === 'rooms/index.htm') {
//                             promiseArray.push(file.async("string").then((content: string) => {
//
//                                     if (filename === 'rooms/index.htm') {
//                                         let indexFile = parse5.parse(content);
//                                         recurse(indexFile);
//                                         buildings = buildings.filter(function (word) {
//                                             return word.length > 1;
//                                         });
//                                     } else {
//                                         if (isValidFile(filename)) {
//                                             let roomFile = parse5.parse(content);
//                                             roomRecurse(roomFile);
//                                             rooms = rooms.filter(function (word) {
//                                                 return word.length > 1;
//                                             });
//                                             console.log(rooms);
//
//                                         }
//
//                                     }
//                                         try {
//                                             data1.push(JSON.stringify(JSON.parse(content)));
//
//                                         } catch (error) {
//
//                                         }
//
//                                 }).catch(function (err: any) {
//                                     console.log(err);
//                                 })
//                             );
//                             // }
//                         }
//                     });
//
//                     Promise.all(promiseArray).then(function (response: any) {
//                         console.log(1);
//
//                         fulfill(data1);
//                     }).catch(function (error) {
//                         console.log(1.1);
//                         reject('Error:' + error);
//                     })
//                 }).catch(function (err: any) {
//                     // console.log(err);
//                     console.log(1.2);
//                     reject(err);
//                 });
//             }
//         }
//         catch (emptyFileError) {
//             emptyFileError('Zip file is empty');
//         }
//     });
// }
//
// function isValidFile(fileName:String):Boolean{
//     if (fileName.substring(0,46) === "rooms/campus/discover/buildings-and-classrooms"){
//         return true;
//     }
//     return false;
//
// }
//
//
// function tableCheck(node: any): Boolean {
//
//     let attributes: Array<any> = Object.getOwnPropertyNames(node);
//     if (attributes.includes("tagName")) {
//         let tagName = attributes[attributes.indexOf("tagName")];
//
//         if (node[tagName] === "table") {
//             return true;
//         }
//     }
//     return false;
// }
//
//
// function recurse(htmlNode: any) {
//
//     var tempBuildingArray: Array<any> = [];
//
//     if (typeof htmlNode === 'object') {
//         if (htmlNode.childNodes != null) {
//             let children: Array<any> = htmlNode.childNodes;
//             for (let child of children) {
//                 if (tableCheck(child)) {
//                     tempBuildingArray = getBuildings(child);
//                     //cleanArray(tempBuildingArray);
//                     for (var i = 0; i < tempBuildingArray.length; i++) {
//                         buildings.push(tempBuildingArray[i]);
//                     }
//
//                 }
//                 recurse(child);
//             }
//         }
//     }
// }
//
// function roomRecurse(htmlNode: any) {
//
//     var tempRoomArray: Array<any> = [];
//
//     if (typeof htmlNode === 'object') {
//         if (htmlNode.childNodes != null) {
//             let children: Array<any> = htmlNode.childNodes;
//             for (let child of children) {
//                 if (tableCheck(child)) {
//                     tempRoomArray = getRooms(child);
//
//                     for (var i = 0; i < tempRoomArray.length; i++) {
//                         rooms.push(tempRoomArray[i]);
//                     }
//
//                 }
//                 roomRecurse(child);
//             }
//         }
//     }
// }
//
//
// function getBuildings(table: any): Array<any> {
//
//     let codes: Array<any> = [];
//
//     var bodies: Array<any> = table.childNodes;
//
//     for (let body of bodies) {
//         let bodyTags: Array<any> = Object.getOwnPropertyNames(body);
//         var bodyTagName = bodyTags[bodyTags.indexOf("tagName")];
//
//         if (body[bodyTagName] === "tbody") {
//             var rows = body.childNodes;
//             for (var row of rows) {
//                 let rowtags: Array<any> = Object.getOwnPropertyNames(row);
//                 var rowTagName = rowtags[rowtags.indexOf("tagName")];
//
//                 if (row[rowTagName] === "tr") {
//                     var columns = row.childNodes;
//                     for (var column of columns) {
//                         let columnTags: Array<any> = Object.getOwnPropertyNames(column);
//
//
//                         var columnTagName = columnTags[columnTags.indexOf("tagName")];
//                         if (column[columnTagName] === "td") {
//                             let columnChildren: Array<any> = column.childNodes;
//                             for (let columnChild of columnChildren) {
//                                 let columnChildTags: Array<any> = Object.getOwnPropertyNames(columnChild);
//                                 let columnValue = columnChildTags[columnChildTags.indexOf("value")];
//                                 if ((columnChild[columnValue] != null) && (columnChild[columnValue] != "")) {
//                                     let info: String = columnChild[columnValue];
//                                     codes.push(info.trim());
//
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     return codes;
// }
//
// function getRooms(table: any): Array<any> {
//
//     let roomInfo: Array<any> = [];
//
//     var bodies: Array<any> = table.childNodes;
//
//     for (let body of bodies) {
//         let bodyTags: Array<any> = Object.getOwnPropertyNames(body);
//         var bodyTagName = bodyTags[bodyTags.indexOf("tagName")];
//
//         if (body[bodyTagName] === "tbody") {
//             var rows = body.childNodes;
//             for (var row of rows) {
//                 let rowtags: Array<any> = Object.getOwnPropertyNames(row);
//                 var rowTagName = rowtags[rowtags.indexOf("tagName")];
//
//                 if (row[rowTagName] === "tr") {
//                     var columns = row.childNodes;
//                     for (var column of columns) {
//                         let columnTags: Array<any> = Object.getOwnPropertyNames(column);
//                         var columnTagName = columnTags[columnTags.indexOf("tagName")];
//                         if (column[columnTagName] === "td") {
//                             let columnChildren: Array<any> = column.childNodes;
//                             for (let columnChild of columnChildren) {
//                                 let columnChildTags: Array<any> = Object.getOwnPropertyNames(columnChild);
//                                 let columnValue = columnChildTags[columnChildTags.indexOf("value")];
//                                 if ((columnChild[columnValue] != null) && (columnChild[columnValue] != "")) {
//                                     let info: String = columnChild[columnValue];
//                                     roomInfo.push(info.trim());
//
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     return roomInfo;
// }
//
//
//
//
//
//
//
//
//
//
// function loadfile(file: string): Promise<Array<any>> {
//     return new Promise(function (fulfill, reject) {
//
//         let jsZip = new JSZip();
//         let data1: Array<string> = new Array();
//
//         try {
//             if (file != null) {
//                 let promiseArray: any[] = [];
//                 jsZip.loadAsync(file, {base64: true}).then(function (zip: any) {
//                     zip.forEach(function (filename: any, file: any) {
//                         if (!file.dir)
//                             promiseArray.push(jsZip.file(filename).async("string").then((content: string) => {
//                                 try {
//                                     data1.push(JSON.stringify(JSON.parse(content)));
//
//                                 } catch (error) {
//
//                                 }
//                             }));
//                     });
//
//                     Promise.all(promiseArray).then(function (response: any) {
//
//                         fulfill(data1);
//                     }).catch(function (error) {
//
//                         reject('Error:' + error);
//                     })
//                 }).catch(function (err: any) {
//                     console.log(err);
//                     reject(err);
//                 });
//             }
//         }
//         catch (emptyFileError) {
//             emptyFileError('Zip file is empty');
//         }
//     });
//
//}

