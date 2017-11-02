import Log from "../Util";
import * as JSzip from "jszip";

'use strict';
import {error} from "util";
//import {Room} from "./Room";

let fs = require("fs");
let request = require('request');
let JSZip = require('jszip');
const parse5 = require('parse5');

export class Room {
    rooms_fullname: string;     //Full building name (e.g., "Hugh Dempster Pavilion").
    rooms_shortname: string;    //Short building name (e.g., "DMP").
    rooms_number: string;       //The room number. Not always a number, so represented as a string.
    rooms_name: string;         //The room id; should be rooms_shortname+"_"+rooms_number.
    rooms_address: string;      //The building address. (e.g., "6245 Agronomy Road V6T 1Z4").
    rooms_lat: number;          //The latitude of the building. Instructions for getting this field are below.
    rooms_lon: number;          //The longitude of the building. Instructions for getting this field are below.
    rooms_seats: number;        //The number of seats in the room.
    rooms_type: string;         //The room type (e.g., "Small Group").
    rooms_furniture: string;    //The room type (e.g., "Classroom-Movable Tables & Chairs").
    rooms_href: string;         //The link to full details online (e.g., "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201").


    // constructor(Rooms : Array<any>) {
    //     this.Rooms = Rooms;
    // }

}
