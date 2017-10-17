/**
 * This is the main programmatic entry point for the project.
 */
import { IInsightFacade, InsightResponse } from "./IInsightFacade";

import Log from "../Util";

//import { Course } from './Courses';

'use strict';
import {QUERYNode} from "../node/QUERYNode";
import {Course} from "./Courses";
import * as fs from "fs";

var JSZip = require('jszip');

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

    convertToJson(jszipFile: any): Array<any> {

        var newFile: Array<any> = this.loadFile(jszipFile);
        var jsonArray: Array<any>;

        for (let entry of newFile) {
            var jsonObject = JSON.parse(JSON.stringify(entry));
            jsonArray.push(jsonObject);
        }

        return jsonArray;
    }

     writeArrayToFile(id: string, file:any) {

        var object = this.convertToJson;
        fs.writeFile(id ,file);
        //jsonfile.writeFileSync(file, object);
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {

        let myCourse = new Course(id, content);

        let zipContent: Array<any> = new Array();
        let code: number = null;

        return new Promise(function (resolve, reject) {
            try {

                zipContent = this.loadFile(content);
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
                reject({ code: code, body: { res: error } })
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
                    resolve({ code: code, body: { res: 'the operation was successful' } })
                }
            } catch (error) {
                code = 404;
                reject({ code: code, body: { res: 'the operation was unsuccessful because the delete was for a resource that was not previously added.' } });
            }
        });

    }



    performQuery(query: any): Promise <InsightResponse> {
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



