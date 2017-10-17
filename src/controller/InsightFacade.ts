/**
 * This is the main programmatic entry point for the project.
 */
import { IInsightFacade, InsightResponse } from "./IInsightFacade";

import Log from "../Util";

//import { Course } from './Courses';

'use strict';

const fs = require("fs");
import forEach = require("core-js/fn/array/for-each");
import { QUERYNode } from "../node/QUERYNode";

var JSZip = require('jszip');

let UBCInsight = new Map();

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');

    }

    addDataset(id: string, content: string): Promise<InsightResponse> {

        let zipContent: any[];
        let code: number = null;
        let jsonArray: any[];

        return new Promise(function (resolve, reject) {

            try {
                if (content != null){
                loadfile(content).then(function (value: Array<any>) {
                    zipContent = value;
                }).catch(function (error) {
                    error('Not valid zip file') });
                for (let files in zipContent) {
                    jsonArray.push(JSON.parse(files));
                }

                if (UBCInsight.has(id)) {
                    UBCInsight.set(id, jsonArray);
                    code = 201;
                    UBCInsight.set(id, zipContent);
                    writeArrayToFile(UBCInsight);
                    resolve({ code: code, body: { res: 'the operation was successful and the id already existed' } });
                } else {
                    UBCInsight.set(id, jsonArray);
                    writeArrayToFile(id);
                    code = 204;
                    resolve({ code: code, body: { res: 'the operation was successful and the id was new' } });
                }
            }
            }catch (error) {
                code = 400;
                reject({ "code": code, "body": { res:("error" + error)} });
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
                    resolve({ code: code, body: { res: 'the operation was successful.' } });
                }
                else{
                    code = 404;
                    reject({ code: code, body: { res: 'the operation was unsuccessful because the delete was for a resource that was not previously added.' } });

                }
            } catch (error) {
                code = 404;
                reject({ code: code, body: { res: 'the operation was unsuccessful because the delete was for a resource that was not previously added.' } });
            }
        });

    }

    performQuery(query: any): Promise<InsightResponse> {
        let qNode: QUERYNode = new QUERYNode();
        return new Promise(function (resolve, reject) {
            try {
                qNode.typeCheck(query);
                resolve({ code: 200, body: { message: 'Query is valid' } });
            } catch (error) {
                reject({ code: 400, body: { message: 'Query failed. query is invalid' } });
            }
        })
    }
}

function loadfile(file: string): Promise<Array<any>> {
    return new Promise(function (fulfill, reject) {

        var jsZip = new JSZip();
        var data1: Array<string> = new Array();

        try {
            if (file != null) {
                let promiseArray: any[] = [];
                jsZip.loadAsync(file, { base64: true }).then(function (zip: any) {
                    zip.forEach(function (filename: any, file: any) {
                        if (!file.dir)
                            promiseArray.push(jsZip.file(filename).async("string").then((content: string) => {
                                try {
                                        data1.push(JSON.stringify(JSON.parse(content)));

                                } catch (error) {
                                    error('inner', error.message) ;
                                }
                            }));
                    });
                    Promise.all(promiseArray).then(function (response: any) {
                        fulfill(data1);
                    }).catch(function(error) {
                        reject('Error:'+ error);
                    })
                });
            }
        }
        catch (emptyFileError) {
            emptyFileError('Zip file is empty');

        }
    });

}

function writeArrayToFile(file: any): void {

    var object = this.convertToJson;
    fs.writeFile(file, object);
}





