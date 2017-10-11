import Log from "../Util";

'use strict';
var fs = require("fs");
var request = require('request');
var JSZip = require('jszip');
var jsonfile = require('jsonfile');

export class Course{

    //fileDest: string;
    id: string;
    content: string;
    
    constructor(id: string, content: string) {
        this.id = id;
        this.content= content;
     }

    createNewFile() {
    let zip = new JSZip();
    zip.folder('Courses').file('Hello');

    }

    // Parameter : takes a zip file
    // Returns : Array containing content of Zip file. 

    loadfile(file: any) {
        
        var data:Array<any> = JSZip.loadAsync(file).then(function (zip:any) {
            Object.keys(zip.files).forEach(function (zipfile) {
              zip.files[zipfile].async('string').then(function (fileData:Array<any>) {
                console.log(fileData) // These are your file contents      
              })
            })
          })

          return data;
    }

    // Param : data from zip file
    // returns: Array of Json Object

    convertToJson(jszipFile: any) {
        var newFile:Array<any> = this.loadfile(jszipFile);
        var jsonArray: Array<any>;

        for (let entry of newFile){
            var jsonObject = JSON.parse(JSON.stringify(entry));
            jsonArray.push(jsonObject);
        }

        return jsonArray;
    }

    writeArrayToFile(){
        var file = 'courses.json'
        var object = this.convertToJson; 

        jsonfile.writeFileSync(file, object);
    }


}