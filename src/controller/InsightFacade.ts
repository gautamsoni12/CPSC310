/**
 * This is the main programmatic entry point for the project.
 */
import { IInsightFacade, InsightResponse } from "./IInsightFacade";

import Log from "../Util";

//import { Course } from './Courses';

'use strict';

var JSZip = require('jszip');
let jsonfile = require('jsonfile');

let UBCInsight = new Map();

export default class InsightFacade implements IInsightFacade {


    constructor() {
        Log.trace('InsightFacadeImpl::init()');

    }

    addDataset(id: string, content: string): Promise<InsightResponse> {

        //let myCourse = new Course(id, content);

        let zipContent: Array<any> = new Array();
        let code: number = null;

        return new Promise(function (resolve, reject) {
            try {

                zipContent = loadfile(content);
                zipContent = convertToJson(zipContent);
                if (UBCInsight.has(id)) {
                    code = 201;
                    resolve({ "code": code, "body": { res: 'the operation was successful and the id already existed' } });
                } else {
                    UBCInsight.set(id, zipContent);
                    writeArrayToFile(id);
                    code = 204;
                    resolve({ "code": code, "body": { res: 'the operation was successful and the id was new' } });
                }
            } catch (error) {
                code = 400;
                reject({ "code": code, "body": { res: error } })
            }

        });

       // return newPromise;
    }

    removeDataset(id: string): Promise<InsightResponse> {
        var code: number;
        return new Promise(function (resolve, reject) {

            try {
                if (UBCInsight.has(id)) {
                    code = 204;
                    UBCInsight.delete(id);
                    resolve({ "code": code, "body": { res: 'the operation was successful' } })
                }
            } catch (error) {
                code = 404;
                reject({ "code": code, "body": { res: 'the operation was unsuccessful because the delete was for a resource that was not previously added.' } });
            }
        });

    }


    performQuery(query: any): Promise<InsightResponse> {
        return null;
    }
}


function loadfile(file: string): Array<any> {

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

function convertToJson(jszipFile: any): Array<any> {

    var newFile: Array<any> = this.loadfile(jszipFile);
    var jsonArray: Array<any>;

    for (let entry of newFile) {
        var jsonObject = JSON.parse(JSON.stringify(entry));
        jsonArray.push(jsonObject);
    }

    return jsonArray;
}

function writeArrayToFile(file:any): void {

    var object = this.convertToJson;
    jsonfile.writeFileSync(file, object);
}



