import {Room} from "./Room";

let fs = require("fs");
let JSZip = require('jszip');
const parse5 = require('parse5');
const http = require('http');
'use strict';

let buildings: Array<any> = [];
let rooms: Array<any> = [];

var buildingCode: string = "";

export interface Building {

    building_fullname?: string;     //Full building name (e.g., "Hugh Dempster Pavilion").
    building_shortname?: string;    //Short building name (e.g., "DMP").
    building_address?: string;      //The building address. (e.g., "6245 Agronomy Road V6T 1Z4").
}

export class Rooms {
    id: string;
    contents: string;

    constructor(id: string, content: string) {
        this.id = id;
        this.contents = content;
    }

    loadFile(file: string): any {
        let promiseArray: any[] = [];

        return new Promise(function (fulfill, reject) {
            let jsZip = new JSZip();

            try {
                if (file != null) {
                    jsZip.loadAsync(file, {base64: true}).then(function (zip: any) {
                        zip.forEach(function (filename: any, file: any) {
                            if (!file.dir) {
                                promiseArray.push(file.async("string").then((content: string) => {
                                        if (filename === 'index.htm') {
                                            let indexFile = parse5.parse(content);
                                            recurse(indexFile);
                                        } else if (isValidFile(filename)) {

                                            buildingCode = filename.substring(41, 50);
                                            let roomFile = parse5.parse(content);
                                            roomRecurse(roomFile);
                                        }

                                    }).catch(function (err: any) {
                                        console.log(err);
                                    })
                                );
                            }
                        });

                        Promise.all(promiseArray).then(function (response: any) {


                            fulfill(comleteRoom(buildings, rooms));

                        }).catch(function (error) {
                            reject('Error:' + error);
                        })
                    }).catch(function (err: any) {
                        reject(err);
                    });
                }
            }
            catch (emptyFileError) {
                reject(emptyFileError);
                emptyFileError('Zip file is empty');

            }
        });
    }
}

function comleteRoom(buildingsArray: Array<any>, roomsArray: Array<any>): Promise<Array<any>> {

    return new Promise(function (resolve, reject) {
        var latlonPrimiseArray: Array<any> = [];
        try {
            buildingsArray = buildings;
            roomsArray = rooms;
            for (let building of buildingsArray) {
                for (let room of roomsArray) {
                    if (building.building_shortname === room.rooms_shortname) {
                        room.rooms_fullname = building.building_fullname;
                        room.rooms_name = building.building_shortname + "_" + room.rooms_number;
                        room.rooms_address = building.building_address;

                        latlonPrimiseArray.push(new Promise(function (fulfill, reject) {
                                getlatLon(building.building_address, room).then(function (value: any) {
                                    fulfill(value);
                                    //console.log(value);
                                }).catch(function (error: any) {
                                    throw ("Lat-Lon empty" + error.message);
                                });
                            })
                        );

                        Promise.all(latlonPrimiseArray).then(function (response: any) {
                            //console.log(response);
                        }).catch(function (error: string) {
                            reject(error);
                        })

                    }
                }
            }
            resolve(rooms);
        } catch (error) {
            reject(error);
        }
    });

}


function getlatLon(address: string, room: any):Promise<any> {
    return new Promise(function (resolve, reject) {

        let tempUrl: string = "http://skaha.cs.ubc.ca:11316/api/v1/team126/" + address;

        let url: string = tempUrl.split(' ').join('%20');
        //console.log(url);

        http.get(url, function (result: any) {
            const {statusCode} = result;
            const contentType = result.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.error(error.message);
                // consume response data to free up memory
                result.resume();
                return;
            }

            result.setEncoding('utf8');
            let rawData = '';
            result.on('data', (chunk: any) => {
                rawData += chunk;
            });
            result.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);

                    if (parsedData.error) {
                        room.rooms_lat = 0;
                        room.rooms_lon = 0;
                    }
                    room.rooms_lat = parsedData.lat;
                    room.rooms_lon = parsedData.lon;
                    resolve(true);
                } catch (e) {
                    console.error(e.message);
                }
            });
        }).on('error', (e: any) => {
            resolve({error: e.message});
        });
    });

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
                                    try {
                                        let childrenOfColumnChild: Array<any> = columnChild.childNodes;
                                        if (childrenOfColumnChild != null) {
                                            for (let childOfColumnChild of childrenOfColumnChild) {
                                                let buildingTitle: string = childOfColumnChild.value;
                                                if (buildingInfoType.value === "views-field views-field-title") {
                                                    var buildingName = buildingTitle.toString().trim();
                                                }
                                            }
                                        }
                                    } catch (error) {
                                        buildingName = "";
                                    }
                                    try {
                                        if (columnChild.value != null) {
                                            let info: string = columnChild.value;
                                            if (buildingInfoType.value === "views-field views-field-field-building-code") {

                                                var buildingCode = info.toString().trim();
                                            }
                                            else if (buildingInfoType.value === "views-field views-field-field-building-address") {
                                                var buildingAddress = info.toString().trim();
                                            }
                                        }
                                    } catch (error) {
                                        buildingCode = "";
                                        buildingAddress = "";
                                    }
                                }
                            }
                        }
                    }
                    let myBuilding: Building = {
                        building_shortname: buildingCode,
                        building_fullname: buildingName,
                        building_address: buildingAddress
                    };
                    buildings.push(myBuilding);
                }
            }
        }
    }
}

function getListOfRooms(): Array<any> {
    return this.listOfRooms;
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

                                    try {
                                        let childrenOfColumnChild: Array<any> = columnChild.childNodes;
                                        if (childrenOfColumnChild != null) {
                                            for (let childOfColumnChild of childrenOfColumnChild) {
                                                let roomNum: string = childOfColumnChild.value;
                                                if (roomInfoType.value === "views-field views-field-field-room-number") {
                                                    var roomNumber = roomNum.toString();
                                                }
                                                let herfAttrs = columnChild.attrs;
                                                for (let herfAttr of herfAttrs) {
                                                    if (herfAttr.name === "href") {
                                                        var roomHerf = herfAttr.value.toString();
                                                    }
                                                }
                                            }
                                        }
                                    } catch (error) {
                                        roomNumber = "";
                                        roomHerf = "";
                                    }
                                    try {
                                        if (columnChild.value != null) {
                                            let info: string = columnChild.value;
                                            if (roomInfoType.value === "views-field views-field-field-room-capacity") {
                                                var roomSeats = parseInt(info.toString().trim());
                                            }
                                            else if (roomInfoType.value === "views-field views-field-field-room-furniture") {
                                                var roomFurniture = info.toString().trim();
                                            }
                                            else if (roomInfoType.value === "views-field views-field-field-room-type") {
                                                var roomType = info.toString().trim();
                                            }

                                        }

                                    } catch (error) {
                                        roomSeats = 0;
                                        roomFurniture = "";
                                        roomType = "";
                                    }
                                }
                            }
                        }
                    }
                    let myRoom: Room = {
                        rooms_fullname: "",
                        rooms_shortname: buildingCode,
                        rooms_number: roomNumber,
                        rooms_name: "",
                        rooms_address: "",
                        rooms_lat: 0,
                        rooms_lon: 0,
                        rooms_seats: roomSeats,
                        rooms_type: roomType,
                        rooms_furniture: roomFurniture,
                        rooms_href: roomHerf
                    };
                    rooms.push(myRoom);
                }
            }
        }
    }
}










