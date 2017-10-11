/**
 * This is the main programmatic entry point for the project.
 */
import { IInsightFacade, InsightResponse } from "./IInsightFacade";

import Log from "../Util"
import * as JSzip from "jszip";
var zip = new JSzip();


import { Course } from './Courses';

'use strict';

var fs = require("fs");
var request = require('request');
var JSZip = require('jszip');
var UBCInsight = new Map();
export default class InsightFacade implements IInsightFacade {


    constructor() {
        Log.trace('InsightFacadeImpl::init()');

    }

    addDataset(id: string, content: string): Promise<InsightResponse> {

        let myCourse = new Course(id, content);

        var zipContent: Array<any>;
        var code: number;

        return new Promise(function (resolve, reject) {
            try {

                zipContent = myCourse.loadfile(content);
                zipContent = myCourse.convertToJson(zipContent);
                if (UBCInsight.has(id)) {
                    code = 201;
                    resolve({ "code": code, "body": { res: 'the operation was successful and the id already existed' } });
                } else {
                    UBCInsight.set(id, zipContent);
                    myCourse.writeArrayToFile();
                    code = 204;
                    resolve({ "code": code, "body": { res: 'the operation was successful and the id was new' } });
                }
            } catch (error) {
                code = 400;
                reject({ "code": code, "body": { res: error } })
            }

        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        var code: number;
        return new Promise(function (resolve, reject) {

            try {
                if (UBCInsight.has(id)){
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
