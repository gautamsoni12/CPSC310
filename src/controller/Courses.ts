import Log from "../Util";

import * as JSzip from "jszip";

'use strict';
let fs = require("fs");
let request = require('request');
let JSZip = require('jszip');
let jsonfile = require('jsonfile');

//var Promise = require('promise');

export class Course {
    id: string;
    contents: string;


    constructor(id: string, content: string) {
        this.id = id;
        this.contents = content;
    }

    // Parameter : takes a zip file
    // Returns : Array containing content of Zip file. 

    loadfile(file: string): Array<any> {
        this.constructor().contents = file;
        let jsZip = new JSZip();

        try {
            if (file != null) {

                var data: Array<any>;
                jsZip.loadAsync(file, {base64: true}).then(function (zip: any) {
                    Object.keys(zip.files).forEach(function (zipfile) {
                        zip.files(zipfile).async('string').then(function (fileData: Array<any>) {
                            console.log(fileData) // These are file contents
                            data = fileData;
                        })
                    })
                })

            }

        } catch (emptyFileError) {
            emptyFileError('Zip file is empty');
        }
        return data;
    }

    // Param : data from zip file
    // returns: Array of Json Object

    convertToJson(jszipFile: any): Array<any> {

        var newFile: Array<any> = this.loadfile(jszipFile);
        var jsonArray: Array<any>;

        for (let entry of newFile) {
            var jsonObject = JSON.parse(JSON.stringify(entry));
            jsonArray.push(jsonObject);
        }

        return jsonArray;
    }

    writeArrayToFile(): void {
        var file = this.id;
        var object = this.convertToJson;
        jsonfile.writeFileSync(file, object);
    }

}