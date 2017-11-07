import Log from "../Util";
import {EVALUATENODE} from "./EVALUATENODE";
import {isString} from "util";
import {Rooms} from "../controller/Rooms";

//SCOMPARISON NODE: s_key
//s_key: courses_('dept' | 'id' | 'instructor' | 'title' | 'uuid')
export class SCOMPNode {

    dataset: Array<any>

    constructor(dataset: Array<any>) {
        this.dataset = dataset;
    }

    typeCheck(query: any) {
        let keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] == "course_dept" || keys[i] == "course_id" || keys[i] == "course_instructor" ||
                keys[i] == "course_title" || keys[i] == "course_uuid" && isString(query[keys[i]])) {
                this.parseCourse(query);
            } else if (keys[i] == "rooms_fullname" || keys[i] == "rooms_shortname" || keys[i] == "rooms_number" ||
                       keys[i] == "rooms_name" || keys[i] == "rooms_address" || keys[i] == "rooms_type" ||
                       keys[i] == "rooms_furniture" || keys[i] == "rooms_href" &&  isString(query[keys[i]])) {
                this.parseRoom(query);
            } else {
                throw new Error("Invlaid Query");
            }
        }

    }

    parseCourse(query: any) {
        if (query.hasOwnProperty('courses_dept')) {
            this.hasStarValidLocation(query, 'courses_dept');
        }
        if (query.hasOwnProperty('courses_id')) {
            this.hasStarValidLocation(query, 'courses_id');
        }
        if (query.hasOwnProperty('courses_instructor')) {
            this.hasStarValidLocation(query, 'courses_instructor');
        }
        if (query.hasOwnProperty('courses_title')) {
            this.hasStarValidLocation(query, 'courses_title')
        }
        if (query.hasOwnProperty('courses_uuid')) {
            this.hasStarValidLocation(query, 'courses_uuid')
        }
        this.evaluateCourses(query);
    }

    parseRoom(query: any) {
        if (query.hasOwnProperty('room_fullname')) {
            this.hasStarValidLocation(query, 'room_fullname');
        }
        if (query.hasOwnProperty('room_shortname')) {
            this.hasStarValidLocation(query, 'room_shortname');
        }
        if (query.hasOwnProperty('rooms_number')) {
            this.hasStarValidLocation(query, 'rooms_number');
        }
        if (query.hasOwnProperty('rooms_name')) {
            this.hasStarValidLocation(query, 'rooms_name')
        }
        if (query.hasOwnProperty('rooms_address')) {
            this.hasStarValidLocation(query, 'rooms_address')
        }
        if (query.hasOwnProperty('rooms_type')) {
            this.hasStarValidLocation(query, 'rooms_type')
        }
        if (query.hasOwnProperty('rooms_furniture')) {
            this.hasStarValidLocation(query, 'rooms_furniture')
        }
        if (query.hasOwnProperty('rooms_href')) {
            this.hasStarValidLocation(query, 'rooms_href')
        }
        this.evaluateRooms(query);
    }

    private hasStarValidLocation(query: any, s_key: string) {
        if (query[s_key].includes('*') && !query[s_key].startsWith('*') ||
            !query[s_key].endsWith('*')) {
            throw new Error("query is invalid");
        }
    }

    evaluateCourses(query: any) {

    }

    //Dataset is array<rooms>
    //returns array<rooms>
    evaluateRooms(query: any) {
        let toReturn: Array<any> = new Array();
        let keys = Object.keys(query);
        if (query[keys[0]].startsWith('*')) {
            for (let rooms in this.dataset) {
                let roomInfo =
            }
        }
    }


}