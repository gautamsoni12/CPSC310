import Log from "../Util";
import * as JSzip from "jszip";

'use strict';
import {error} from "util";
import {Room} from "./Room";

let fs = require("fs");
let request = require('request');
let JSZip = require('jszip');
const parse5 = require('parse5');

export class Rooms {
    id: string;
    contents: string;

    listOfRooms: Array<any>;


    constructor(id: string, content: string) {
        this.id = id;
        this.contents = content;
    }

    buildings: Array<any> = [];

    rooms: Array<any> = [];


    loadFile(file: string): any {
        let promiseArray: any[] = [];
        let roomsList: Array<any> =[];

        let myroom = new Room();

        return new Promise(function (fulfill, reject) {
            let jsZip = new JSZip();
            let data1: Array<string> = [];
            try {
                if (file != null) {
                    jsZip.loadAsync(file, {base64: true}).then(function (zip: any) {
                        zip.forEach(function (filename: any, file: any) {

                            if (!file.dir) {
                                //if (filename === 'rooms/index.htm') {
                                promiseArray.push(file.async("string").then((content: string) => {

                                        if (filename === 'rooms/index.htm') {
                                            let indexFile = parse5.parse(content);
                                            this.recurse(indexFile);
                                            this.buildings = this.buildings.filter(function (word:string) {
                                                return word.length > 1;
                                            });
                                        } else {
                                            if (Rooms.isValidFile(filename)) {
                                                let roomFile = parse5.parse(content);
                                                this.roomRecurse(roomFile);
                                                this.rooms = this.rooms.filter(function (word:string) {
                                                    return word.length > 1;
                                                });

                                            }

                                        }
                                        try {
                                            data1.push(JSON.stringify(JSON.parse(content)));

                                        } catch (error) {

                                        }

                                    }).catch(function (err: any) {
                                        console.log(err);
                                    })
                                );
                                // }
                            }
                        });

                        Promise.all(promiseArray).then(function (response: any) {
                            console.log(1);

                            fulfill(data1);
                        }).catch(function (error) {
                            console.log(1.1);
                            reject('Error:' + error);
                        })
                    }).catch(function (err: any) {
                        // console.log(err);
                        console.log(1.2);
                        reject(err);
                    });
                }
            }
            catch (emptyFileError) {
                emptyFileError('Zip file is empty');
            }
        });
    }


    static isValidFile(fileName: String): Boolean {
        return fileName.substring(0, 46) === "rooms/campus/discover/buildings-and-classrooms";

    }




    static tableCheck(node: any): Boolean {

        let attributes: Array<any> = Object.getOwnPropertyNames(node);
        if (attributes.includes("tagName")) {
            let tagName = attributes[attributes.indexOf("tagName")];

            if (node[tagName] === "table") {
                return true;
            }
        }
        return false;
    }




    recurse(htmlNode: any) {

        var tempBuildingArray: Array<any> = [];

        if (typeof htmlNode === 'object') {
            if (htmlNode.childNodes != null) {
                let children: Array<any> = htmlNode.childNodes;
                for (let child of children) {
                    if (Rooms.tableCheck(child)) {
                        tempBuildingArray = Rooms.getBuildings(child);
                        //cleanArray(tempBuildingArray);
                        for (let i = 0; i < tempBuildingArray.length; i++) {
                            this.buildings.push(tempBuildingArray[i]);
                        }

                    }
                    this.recurse(child);
                }
            }
        }
    }



    roomRecurse(htmlNode: any) {

        let tempRoomArray: Array<any> = [];

        if (typeof htmlNode === 'object') {
            if (htmlNode.childNodes != null) {
                let children: Array<any> = htmlNode.childNodes;
                for (let child of children) {
                    if (Rooms.tableCheck(child)) {
                        Rooms.getRooms(child);

                        for (var i = 0; i < tempRoomArray.length; i++) {
                            this.rooms.push(tempRoomArray[i]);
                        }

                    }
                    this.roomRecurse(child);
                }
            }
        }
    }


    static getBuildings(table: any): Array<any> {

        let codes: Array<any> = [];

        let buildingInfo = new Room();

        let bodies: Array<any> = table.childNodes;

        for (let body of bodies) {
            let bodyTags: Array<any> = Object.getOwnPropertyNames(body);
            let bodyTagName = bodyTags[bodyTags.indexOf("tagName")];

            if (body[bodyTagName] === "tbody") {
                let rows = body.childNodes;
                for (let row of rows) {
                    let rowtags: Array<any> = Object.getOwnPropertyNames(row);
                    var rowTagName = rowtags[rowtags.indexOf("tagName")];

                    if (row[rowTagName] === "tr") {
                        var columns = row.childNodes;
                        for (var column of columns) {
                            let columnTags: Array<any> = Object.getOwnPropertyNames(column);
                            var columnTagName = columnTags[columnTags.indexOf("tagName")];
                            if (column[columnTagName] === "td") {
                                let columnChildren: Array<any> = column.childNodes;

                                let columnAttrs: Array<any> = column.attrs;
                                let buildingType = columnAttrs[columnAttrs.indexOf("value")];

                                for (let columnChild of columnChildren) {

                                    // let columnChildAttrs: Array<any> = columnChild.attrs;
                                    // let buildingName = columnChild[columnChildAttrs.indexOf("value")];

                                    let columnChildTags: Array<any> = Object.getOwnPropertyNames(columnChild);

                                   // let buildingNameTag = columnChildTags[columnChildTags.indexOf("tagName")];

                                    // if (columnChild[buildingNameTag] ==="a") {
                                    //     let buildingNameTagChildren = buildingNameTag.childNodes;
                                    //     for (let buildingNameTagChild of buildingNameTagChildren) {
                                    //
                                    //         let columnChildTags: Array<any> = Object.getOwnPropertyNames(columnChild);
                                    //         let buildNameValue = columnChildTags[columnChildTags.indexOf("value")];
                                    //         let buildingName = buildingNameTagChild[buildNameValue];
                                    //         buildingInfo.rooms_fullname = buildingName;
                                    //     }
                                    // }

                                    let childrenOfColumnChild: Array<any> = columnChild.childNodes;

                                    for (let childOfColumnChild of childrenOfColumnChild ) {
                                        let childOfColumnChildTags: Array<any> = Object.getOwnPropertyNames(childOfColumnChild);
                                        var childOfColumnChildTagName = childOfColumnChildTags[childOfColumnChildTags.indexOf("tagName")];
                                        if (childOfColumnChildTags[childOfColumnChildTagName] != null) {
                                            let info2: String = childOfColumnChildTags[childOfColumnChildTagName];

                                            // if (buildingName === "views-field views-field-field-building-code"){
                                            //     buildingInfo.rooms_shortname = info.toString();
                                            // }
                                            if (buildingType === "views-field views-field-title"){
                                                buildingInfo.rooms_fullname = info2.toString();
                                            }

                                        }
                                    }


                                    let columnValue = columnChildTags[columnChildTags.indexOf("value")];
                                    if ((columnChild[columnValue] != null) && (columnChild[columnValue] != "")) {
                                        let info: String = columnChild[columnValue];

                                        if (buildingType === "views-field views-field-field-building-code"){
                                            buildingInfo.rooms_shortname = info.toString();
                                        }
                                        else if (buildingType === "views-field views-field-field-building-address"){
                                            buildingInfo.rooms_address= info.toString();
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return codes;
    }


       static getRooms(table: any) {

        //let roomInfo: Array<any> = [];

        let myroom = new Room();

        var bodies: Array<any> = table.childNodes;

        for (let body of bodies) {
            let bodyTags: Array<any> = Object.getOwnPropertyNames(body);
            var bodyTagName = bodyTags[bodyTags.indexOf("tagName")];

            if (body[bodyTagName] === "tbody") {
                var rows = body.childNodes;
                for (var row of rows) {
                    let rowtags: Array<any> = Object.getOwnPropertyNames(row);
                    var rowTagName = rowtags[rowtags.indexOf("tagName")];

                    if (row[rowTagName] === "tr") {
                        var columns = row.childNodes;
                        for (var column of columns) {
                            let columnTags: Array<any> = Object.getOwnPropertyNames(column);
                            //let columnAttrs: Array<any> = Object.getOwnPropertyNames()
                            var columnTagName = columnTags[columnTags.indexOf("tagName")];
                            if (column[columnTagName] === "td") {
                                let columnChildren: Array<any> = column.childNodes;


                                let columnAttrs: Array<any> = column.attrs;
                                let roomType = columnAttrs[columnAttrs.indexOf("value")];

                                for (let columnChild of columnChildren) {

                                    let columnChildTags: Array<any> = Object.getOwnPropertyNames(columnChild);




                                    let childrenOfColumnChild: Array<any> = columnChild.childNodes;

                                    for (let childOfColumnChild of childrenOfColumnChild ) {
                                        let childOfColumnChildTags: Array<any> = Object.getOwnPropertyNames(childOfColumnChild);
                                        var childOfColumnChildValue = childOfColumnChildTags[childOfColumnChildTags.indexOf("value")];
                                        if (childOfColumnChildTags[childOfColumnChildValue] != null) {
                                            let info1: String = childOfColumnChildTags[childOfColumnChildValue];

                                            // if (buildingName === "views-field views-field-field-building-code"){
                                            //     buildingInfo.rooms_shortname = info.toString();
                                            // }
                                            if (roomType === "views-field views-field-field-room-number"){
                                                myroom.rooms_number = info1.toString();
                                            }

                                        }

                                        var childOfColumnChildTagName = childOfColumnChildTags[childOfColumnChildTags.indexOf("tagName")];

                                        if (childOfColumnChildTags[childOfColumnChildTagName] === "a") {
                                            let childOfColumnChildAttrs: Array<any> = childOfColumnChild.attrs;
                                            let roomName = childOfColumnChildAttrs[childOfColumnChildAttrs.indexOf("name")];
                                            if (roomName === "href"){
                                                var herf = childOfColumnChildAttrs[childOfColumnChildAttrs.indexOf("value")];
                                                myroom.rooms_href = herf;
                                            }
                                        }

                                    }



                                    let columnValue = columnChildTags[columnChildTags.indexOf("value")];
                                    if ((columnChild[columnValue] != null) && (columnChild[columnValue] != "")) {
                                        let info: String = columnChild[columnValue];
                                        if (roomType === "views-field views-field-field-room-capacity"){
                                            myroom.rooms_seats = parseInt(info.toString());
                                        }
                                        else if (roomType === "views-field views-field-field-room-furniture"){
                                            myroom.rooms_furniture = info.toString();
                                        }
                                        else if (roomType === "views-field views-field-field-room-type"){
                                            myroom.rooms_type = info.toString();
                                        }


                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    }

}








