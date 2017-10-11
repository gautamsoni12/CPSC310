/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import Log from "../Util"
import * as JSzip from "jszip";

var zip = new JSzip();


import { Course } from './Courses';

'use strict';

var fs = require("fs");
var request = require('request');
var JSZip = require('jszip');

export default class InsightFacade implements IInsightFacade {


    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {

        zip.loadAsync(content, {base64: true}).then(function (zipF) {
            //zipF is all files contained within zip?
            //if zip file contained multiple JSON and one is invalid, skip or invalidate entire zip?
            zipF.forEach(function (relativePath, file) {
                //For each file, check if valid then store in data structure
            });
        }).catch(function (err) {
            //return InsightResponse, (how?) err: 400, msge: invalid zip file
            //this block executes if loadAsync fails, meaning invalid zip file
        })
        return null;
        /*
        let myCourse = new Course(id, content);
        
            return new Promise  (function (resolve, reject){
        
    
            });
        */
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return null;
    }

    performQuery(query: any): Promise <InsightResponse> {
        
        return null;
    }
}
