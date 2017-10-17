/**
 * This is the main programmatic entry point for the project.
 */
import { IInsightFacade, InsightResponse } from "./IInsightFacade";

import Log from "../Util";

//import { Course } from './Courses';

'use strict';
import {unzip} from "zlib";
import forEach = require("core-js/fn/array/for-each");

const fs = require("fs");

var JSZip = require('jszip');
let jsonfile = require('jsonfile');
var extract = require('extract-zip');

//var zip = require('node-zip')(data, {base64: false, checkCRC32: true});
var zip = require('node-zip')();
var path = require('path');

let UBCInsight = new Map();

export default class InsightFacade implements IInsightFacade {


    constructor() {
        Log.trace('InsightFacadeImpl::init()');

    }

    addDataset(id: string, content: string): Promise<InsightResponse> {

        //let myCourse = new Course(id, content);

        let zipContent: any;
        let code: number = null;

        return new Promise(function (resolve, reject) {
            try {

                zipContent = loadfile(content);
                //console.log(zipContent);
                //zipContent = readFile(content);
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

function readFileFunction(file:any): any{

    fs.readFile(file, function (err: any, data: string) {
        if (err) throw err;
        console.log(data);
        return data;
    });

}
function loadfile(file: string):Array<any> {


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



