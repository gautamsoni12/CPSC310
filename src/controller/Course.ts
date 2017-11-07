import Log from "../Util";
import * as JSzip from "jszip";

'use strict';
let JSZip = require('jszip');

export class Course {
    id: string;
    contents: string;


    constructor(id: string, content: string) {
        this.id = id;
        this.contents = content;
    }

    // Parameter : takes a zip file
    // Returns : Array containing content of Zip file.
    loadfile(file: string): Promise<Array<any>> {
        return new Promise(function (fulfill, reject) {

            let jsZip = new JSZip();
            let data1: Array<string> = new Array();

            try {
                if (file != null) {
                    let promiseArray: any[] = [];
                    jsZip.loadAsync(file, {base64: true}).then(function (zip: any) {
                        zip.forEach(function (filename: any, file: any) {
                            if (!file.dir)
                                promiseArray.push(jsZip.file(filename).async("string").then((content: string) => {
                                        try {
                                            data1.push(JSON.stringify(JSON.parse(content)));
                                        } catch (error) {

                                        }
                                    }).catch(function (error: any) {
                                    reject({code: 400, body: {error: error.message}});
                                    })
                                );
                        });

                        Promise.all(promiseArray).then(function (response: any) {

                            fulfill(data1);
                        }).catch(function (error) {

                            reject({code: 400, body: {error: ("error: " + "wrong id")}});
                        })
                    }).catch(function (err: any) {
                        console.log(err);
                        reject({code: 400, body: {error: err.message}});
                    });
                }
            }
            catch (emptyFileError) {
                emptyFileError('Zip file is empty');
            }
        });
    }

}