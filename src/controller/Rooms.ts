import Log from "../Util";
import * as JSzip from "jszip";

'use strict';
import {error} from "util";
import {Room} from "./Room";

let fs = require("fs");
let JSZip = require('jszip');
const parse5 = require('parse5');

let buildings: Array<any> = [];
let rooms: Array<any> = [];
let myRoom: Room = {rooms_fullname: "",     //Full building name (e.g., "Hugh Dempster Pavilion").
    rooms_shortname: "",    //Short building name (e.g., "DMP").
    rooms_number: "",       //The room number. Not always a number, so represented as a string.
    rooms_name: "",         //The room id; should be rooms_shortname+"_"+rooms_number.
    rooms_address: "",      //The building address. (e.g., "6245 Agronomy Road V6T 1Z4").
    rooms_lat: 0,          //The latitude of the building. Instructions for getting this field are below.
    rooms_lon: 0,          //The longitude of the building. Instructions for getting this field are below.
    rooms_seats: 0,        //The number of seats in the room.
    rooms_type: "",         //The room type (e.g., "Small Group").
    rooms_furniture: "",    //The room type (e.g., "Classroom-Movable Tables & Chairs").
    rooms_href: "" }        //The link to full details online (e.g., "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201").};

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
        let roomsList: Array<any> = [];

        return new Promise(function (fulfill, reject) {
            let jsZip = new JSZip();
            //let data1: Array<string> = [];
            try {
                if (file != null) {
                    jsZip.loadAsync(file, {base64: true}).then(function (zip: any) {
                        zip.forEach(function (filename: any, file: any) {
                            if (!file.dir) {
                                promiseArray.push(file.async("string").then((content: string) => {
                                        if (filename === 'index.htm') {
                                            let indexFile = parse5.parse(content);
                                            recurse(indexFile);
                                            buildings = buildings.filter(function (word: string) {
                                                return word.length > 1;
                                            });
                                        } else {
                                            if (isValidFile(filename)) {
                                                let roomFile = parse5.parse(content);
                                                roomRecurse(roomFile);
                                                rooms = rooms.filter(function (word: string) {
                                                    return word.length > 1;
                                                });
                                            }
                                        }

                                    }).catch(function (err: any) {
                                        console.log(err);
                                    })
                                );
                            }
                        });

                        Promise.all(promiseArray).then(function (response: any) {
                            fulfill(roomsList);
                        }).catch(function (error) {
                            // console.log(1.1);
                            reject('Error:' + error);
                        })
                    }).catch(function (err: any) {

                        //console.log(1.2);
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

function isValidFile(fileName: String): Boolean {
    return fileName.substring(0, 40) === "campus/discover/buildings-and-classrooms";
}


function tableCheck(node: any): Boolean {

    let attributes: Array<any> = Object.getOwnPropertyNames(node);
    if (attributes.includes("tagName")) {
        let tagName = attributes[attributes.indexOf("tagName")];

        if (node[tagName] === "table") {
            return true;
        }
    }
    return false;
}


function recurse(htmlNode: any) {

    if (typeof htmlNode === 'object') {
        if (htmlNode.childNodes != null) {
            let children: Array<any> = htmlNode.childNodes;
            for (let child of children) {
                if (tableCheck(child)) {
                    getBuildings(child);
                }
                recurse(child);
            }
        }
    }
}

function roomRecurse(htmlNode: any) {

    if (typeof htmlNode === 'object') {
        if (htmlNode.childNodes != null) {
            let children: Array<any> = htmlNode.childNodes;
            for (let child of children) {
                if (tableCheck(child)) {
                    getRooms(child);
                }
                roomRecurse(child);
            }
        }
    }
}


function getBuildings(table: any) {

    let bodies: Array<any> = table.childNodes;
    for (let body of bodies) {
        if (body.tagName === "tbody") {
            let rows = body.childNodes;
            for (let row of rows) {
                if (row.tagName === "tr") {
                    let columns = row.childNodes;
                    for (let column of columns) {
                        if (column.tagName === "td") {


                            let buildingTypes: Array<any> = column.attrs;
                            for (let buildingInfoType of buildingTypes) {

                                let columnChildren = column.childNodes;
                                for (let columnChild of columnChildren) {

                                    let childrenOfColumnChild: Array<any> = columnChild.childNodes;
                                    if (childrenOfColumnChild != null) {
                                        for (let childOfColumnChild of childrenOfColumnChild) {
                                            let buildingTitle: string = childOfColumnChild.value;
                                            if (buildingInfoType.value === "views-field views-field-title") {
                                                myRoom.rooms_number = buildingTitle.toString();
                                            }
                                        }
                                    }


                                    if (columnChild.value != null) {
                                        let info: string = columnChild.value;
                                        if (buildingInfoType.value === "views-field views-field-field-building-code") {
                                            console.log(info.trim());
                                            myRoom.rooms_shortname = info.toString().trim();
                                        }
                                        else if (buildingInfoType.value === "views-field views-field-field-building-address") {
                                            myRoom.rooms_address = info.toString().trim();
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


function getRooms(table: any) {

    let bodies: Array<any> = table.childNodes;
    for (let body of bodies) {
        if (body.tagName === "tbody") {
            let rows = body.childNodes;
            for (let row of rows) {
                if (row.tagName === "tr") {
                    let columns = row.childNodes;
                    for (let column of columns) {
                        if (column.tagName === "td") {
                            let roomInfoTypes: Array<any> = column.attrs;

                            for (let roomInfoType of roomInfoTypes) {
                                let columnChildren: Array<any> = column.childNodes;
                                for (let columnChild of columnChildren) {


                                    let childrenOfColumnChild: Array<any> = columnChild.childNodes;
                                    if (childrenOfColumnChild != null) {
                                        for (let childOfColumnChild of childrenOfColumnChild) {
                                            let roomNum: string = childOfColumnChild.value;
                                            if (roomInfoType.value === "views-field views-field-field-room-number") {
                                                myRoom.rooms_number = roomNum.toString();
                                            }
                                            let herfAttrs = columnChild.attrs;
                                            for (let herfAttr of herfAttrs) {
                                                if (herfAttr.name === "href") {
                                                    myRoom.rooms_href = herfAttr.value;
                                                }
                                            }
                                        }
                                    }
                                    if (columnChild.value != null) {
                                        let info: string = columnChild.value;
                                        if (roomInfoType.value === "views-field views-field-field-room-capacity") {
                                            myRoom.rooms_seats = parseInt(info.toString().trim());
                                        }
                                        else if (roomInfoType.value === "views-field views-field-field-room-furniture") {
                                            myRoom.rooms_furniture = info.toString().trim();
                                        }
                                        else if (roomInfoType.value === "views-field views-field-field-room-type") {
                                            myRoom.rooms_type = info.toString().trim();
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










