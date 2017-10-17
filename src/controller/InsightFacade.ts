/**
 * This is the main programmatic entry point for the project.
 */
import { IInsightFacade, InsightResponse } from "./IInsightFacade";

import Log from "../Util";
'use strict';

import {QUERYNode} from "../node/QUERYNode";
import {EVALUATENODE} from "../node/EVALUATENODE";

const fs = require("fs");

var JSZip = require('jszip');
var path = require('path');

let UBCInsight = new Map();

export default class InsightFacade implements IInsightFacade {


    constructor() {
        Log.trace('InsightFacadeImpl::init()');

    }

    loadFile(file: string): Array<any> {

        var jsZip = new JSZip();
        var data: Array<string> = new Array();

        try {
            if (file != null) {

                jsZip.loadAsync(file, { base64: true }).then(function (zip: any) {
                    Object.keys(zip.files).forEach(function (filename) {
                        zip.files[filename].async('string').then(function(content:any){
                            data.push(content);
                            console.log(content); // These are file contents
                            data = content;
                        })
                    })
                })

            }

        } catch (emptyFileError) {
            emptyFileError('Zip file is empty');
        }
        return data;
    }

     writeArrayToFile(id: string, file:any) {

        var object = this.convertToJson;
        fs.writeFile(id ,file);
        //jsonfile.writeFileSync(file, object);
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        let zipContent: any;
        let code: number = null;

        return new Promise(function (resolve, reject) {
            try {
                zipContent = this.loadfile(content);
                //console.log(zipContent);
                //zipContent = readFile(content);
                zipContent = this.convertToJson(zipContent);

                if (UBCInsight.has(id)) {
                    code = 201;
                    UBCInsight.set(id, zipContent);
                    this.writeArrayToFile(id, zipContent);
                    resolve({ code: code, body: { res: 'the operation was successful and the id already existed' } });
                } else {
                    UBCInsight.set(id, zipContent);
                    this.writeArrayToFile(id, zipContent);
                    code = 204;
                    resolve({ code: code, body: { res: 'the operation was successful and the id was new' } });
                }
            } catch (error) {
                code = 400;
                reject({ "code": code, "body": { res: error('Error: Error thrown ! ') } })
            }
        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        var code: number;
        return new Promise(function (resolve, reject) {

            try {
                if (UBCInsight.has(id)) {
                    code = 204;
                    UBCInsight.delete(id);
                    resolve({ code: code, body: { res: 'the operation was successful' } })
                }
            } catch (error) {
                code = 404;
                reject({ code: code, body: { res: 'the operation was unsuccessful because the delete was for a resource that was not previously added.' } });
            }
        });

    }

    performQuery(query: any): Promise <InsightResponse> {
        let obj: Array<any>;
        var m = new Map();
        let qNode: QUERYNode = new QUERYNode();
        let evalNode: EVALUATENODE = new EVALUATENODE();
        return new Promise(function (resolve, reject) {
            try {
                qNode.typeCheck(query, evalNode);
                for (let value in UBCInsight.values()) {
                    evalNode.evaluate(value, obj);
                }

            resolve({code: 200, body: {message: 'Query is valid'}});

            } catch (error) {
                reject({code: 400, body: {message: 'Query failed. query is invalid'}});
            }
        })
}
/*
function readFile(file: any): Array<any> {

    var path = file.toString();
    var data1: Array<string> = new Array();

    fs.readFile("path", 'base64', function(err:any, data: any) {
        if (err) throw err;
        JSZip.loadAsync(data, { base64: true }).then(function (zip: any) {
            data1 = zip;
        });
    });

    return data1;
}
*/

    readFileFunction(file:any): any{

    fs.readFile(file, function (err: any, data: string) {
        if (err) throw err;
        console.log(data);
        return data;
    });

}
    loadfile(file: string):Array<any> {


        var jsZip = new JSZip();
        var data1: Array<string> = new Array();

        try {
            if (file != null) {

                let promiseArray: any[] = [];
                // var jsZip = require('jszip')
                jsZip.loadAsync(file, {base64: true}).then(function (zip: any) {
                    zip.forEach(function (filename: any, file: any) {
                        promiseArray.push(new Promise(function (fulfill, reject) {
                            file.async('string').then(function (content: any) {
                                try {
                                    if (zip.file(filename) != null) {
                                        fulfill(JSON.stringify(content));
                                    }
                                } catch (parseError) {

                                    reject("Promise Error");
                                }
                            })
                        }));
                    });

                        //console.log(promiseArray);

                        Promise.all(promiseArray).then(function (response: any) {

                            data1 = response;
                            console.log(data1);

                        }).catch(function (error: string) {
                            throw new Error;

                            /*
                            object.async('string').then(function (fileData: any) {
                                console.log(fileData) // These are your file contents
                                data1 = fileData;
                            })
                            */
                        })

                })
            }
        } catch (emptyFileError) {
            emptyFileError('Zip file is empty');
        }
        return data1;

}

 convertToJson(jszipFile: any) {

    var newFile: Array<any> = this.loadfile(jszipFile);
    var jsonArray: Array<any>;

    for (let entry of newFile) {
        var jsonObject = JSON.parse(JSON.stringify(entry));
        jsonArray.push(jsonObject);
    }
}
}



