'use strict';

import {Course1} from "./Course1";

let JSZip = require('jszip');

let courses: Array<any> = [];

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
            try {
                if (file != null) {
                    let promiseArray: any[] = [];
                    jsZip.loadAsync(file, {base64: true}).then(function (zip: any) {
                        zip.forEach(function (filename: any, file: any) {
                            if (!file.dir)
                                promiseArray.push(jsZip.file(filename).async("string").then((content: string) => {
                                        try {
                                            var cJson: any = JSON.parse(content);
                                            recurse(cJson);
                                        } catch (error) {

                                        }
                                    }).catch(function (error: any) {
                                        reject(error);
                                    })
                                );
                        });
                        Promise.all(promiseArray).then(function (response: any) {

                            fulfill(courses);
                        }).catch(function (error) {

                            reject('Error:' + error);
                        })
                    }).catch(function (err: any) {
                        console.log(err);
                        reject(err);
                    });
                }
            }
            catch (emptyFileError) {
                emptyFileError('Zip file is empty');
            }
        });
    }
}

function recurse(htmlNode: any) {

    if (typeof htmlNode === 'object') {
        let jResult: Array<any> = htmlNode.result;
        if (jResult[0] != null) {
            for (let res of jResult) {
                getCourse(res);
            }
        }
    }
}

function getCourse(cNode: any): Promise<any> {

    return new Promise(function (resolve, reject) {
        try {
            var dept = (Object.getOwnPropertyDescriptor(cNode, "Subject")).value;
            var id = (Object.getOwnPropertyDescriptor(cNode, "Course")).value;
            var avg = (Object.getOwnPropertyDescriptor(cNode, "Avg")).value;
            var instructor = (Object.getOwnPropertyDescriptor(cNode, "Professor")).value;
            var title = (Object.getOwnPropertyDescriptor(cNode, "Title")).value;
            var pass = (Object.getOwnPropertyDescriptor(cNode, "Pass")).value;
            var fail = (Object.getOwnPropertyDescriptor(cNode, "Fail")).value;
            var audit = (Object.getOwnPropertyDescriptor(cNode, "Audit")).value;
            var uuid = (Object.getOwnPropertyDescriptor(cNode, "id")).value;
            var year = parseInt((Object.getOwnPropertyDescriptor(cNode, "Year")).value);
            if ((Object.getOwnPropertyDescriptor(cNode, "Section")).value === "overall") {
                year = 1900;
            }
            let myCourse: Course1 = {
                courses_dept: dept.toString(),
                courses_id: id.toString(),        //The course number (will be treated as a string, e.g., 499b).
                courses_avg: parseFloat(avg),      //The average of the course offering.
                courses_instructor: instructor.toString(),//The instructor teaching the course offering.
                courses_title: title.toString(),     //The name of the course.
                courses_pass: parseInt(pass),      //The number of students that passed the course offering.
                courses_fail: parseInt(fail),      //The number of students that failed the course offering.
                courses_audit: parseInt(audit),      //The number of students that audited the course offering.
                courses_uuid: uuid.toString(),      //The unique id of a course offering.
                courses_year: year,
            };

            resolve(courses.push(myCourse));
        }catch(error){
            reject(error);
        }
    });
}