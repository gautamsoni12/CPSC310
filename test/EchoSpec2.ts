/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";


import chai = require('chai');
import chaiHttp = require('chai-http');
import Response = ChaiHttp.Response;
import restify = require('restify');
import * as fs from "fs";
import {error} from "util";


describe("EchoSpec", function () {


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }


    let insightFacade: InsightFacade = null;
    beforeEach(function () {
        insightFacade = new InsightFacade();
    });

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });
    it("Test Server", function () {

        // Init
        chai.use(chaiHttp);
        let server = new Server(4321);
        let URL = "http://127.0.0.1:4321";

        // Test
        expect(server).to.not.equal(undefined);
        try {
            Server.echo((<restify.Request>{}), null, null);
            expect.fail()
        } catch (err) {
            expect(err.message).to.equal("Cannot read property 'json' of null");
        }

        return server.start().then(function (success: boolean) {
            return chai.request(URL)
                .get("/")
        }).catch(function (err) {
            expect.fail()
        }).then(function (res: Response) {
            expect(res.status).to.be.equal(200);
            return chai.request(URL)
                .get("/echo/Hello")
        }).catch(function (err) {
            expect.fail()
        }).then(function (res: Response) {
            expect(res.status).to.be.equal(200);
            return server.start()
        }).then(function (success: boolean) {
            expect.fail();
        }).catch(function (err) {
            expect(err.code).to.equal('EADDRINUSE');
            return server.stop();
        }).catch(function (err) {
            expect.fail();
        });
    });

    it("Should be able to echo", function () {
        let out = Server.performEcho('echo');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: 'echo...echo'});
    });

    it("Should be able to echo silence", function () {
        let out = Server.performEcho('');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: '...'});
    });

    it("Should be able to handle a missing echo message sensibly", function () {
        let out = Server.performEcho(undefined);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });

    it("Should be able to handle a null echo message sensibly", function () {
        let out = Server.performEcho(null);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.have.property('error');
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });

    let query = {
        "WHERE": {
            "GT": {
                "courses_avg": 97
            }
        },
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "courses_avg"
            ],
            "ORDER": "courses_avg"
        }
    };

    it("Course Query 1", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses.zip', "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            // console.log(value);
            Log.test('Value:' + value);
            insightFacade.performQuery(query).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                expect(result.body).to.deep.equal({
                    result: [{courses_dept: 'math', courses_avg: 97.09},
                        {courses_dept: 'math', courses_avg: 97.09},
                        {courses_dept: 'epse', courses_avg: 97.09},
                        {courses_dept: 'epse', courses_avg: 97.09},
                        {courses_dept: 'math', courses_avg: 97.25},
                        {courses_dept: 'math', courses_avg: 97.25},
                        {courses_dept: 'epse', courses_avg: 97.29},
                        {courses_dept: 'epse', courses_avg: 97.29},
                        {courses_dept: 'nurs', courses_avg: 97.33},
                        {courses_dept: 'nurs', courses_avg: 97.33},
                        {courses_dept: 'epse', courses_avg: 97.41},
                        {courses_dept: 'epse', courses_avg: 97.41},
                        {courses_dept: 'cnps', courses_avg: 97.47},
                        {courses_dept: 'cnps', courses_avg: 97.47},
                        {courses_dept: 'math', courses_avg: 97.48},
                        {courses_dept: 'math', courses_avg: 97.48},
                        {courses_dept: 'educ', courses_avg: 97.5},
                        {courses_dept: 'nurs', courses_avg: 97.53},
                        {courses_dept: 'nurs', courses_avg: 97.53},
                        {courses_dept: 'epse', courses_avg: 97.67},
                        {courses_dept: 'epse', courses_avg: 97.69},
                        {courses_dept: 'epse', courses_avg: 97.78},
                        {courses_dept: 'crwr', courses_avg: 98},
                        {courses_dept: 'crwr', courses_avg: 98},
                        {courses_dept: 'epse', courses_avg: 98.08},
                        {courses_dept: 'nurs', courses_avg: 98.21},
                        {courses_dept: 'nurs', courses_avg: 98.21},
                        {courses_dept: 'epse', courses_avg: 98.36},
                        {courses_dept: 'epse', courses_avg: 98.45},
                        {courses_dept: 'epse', courses_avg: 98.45},
                        {courses_dept: 'nurs', courses_avg: 98.5},
                        {courses_dept: 'nurs', courses_avg: 98.5},
                        {courses_dept: 'nurs', courses_avg: 98.58},
                        {courses_dept: 'nurs', courses_avg: 98.58},
                        {courses_dept: 'epse', courses_avg: 98.58},
                        {courses_dept: 'epse', courses_avg: 98.58},
                        {courses_dept: 'epse', courses_avg: 98.7},
                        {courses_dept: 'nurs', courses_avg: 98.71},
                        {courses_dept: 'nurs', courses_avg: 98.71},
                        {courses_dept: 'eece', courses_avg: 98.75},
                        {courses_dept: 'eece', courses_avg: 98.75},
                        {courses_dept: 'epse', courses_avg: 98.76},
                        {courses_dept: 'epse', courses_avg: 98.76},
                        {courses_dept: 'epse', courses_avg: 98.8},
                        {courses_dept: 'spph', courses_avg: 98.98},
                        {courses_dept: 'spph', courses_avg: 98.98},
                        {courses_dept: 'cnps', courses_avg: 99.19},
                        {courses_dept: 'math', courses_avg: 99.78},
                        {courses_dept: 'math', courses_avg: 99.78}]
                });

            });
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        });

    });

    let query2 = {
        "WHERE": {
            "IS": {
                "rooms_name": "DMP_*"
            }
        },
        "OPTIONS": {
            "COLUMNS": [
                "rooms_name"
            ],
            "ORDER": "rooms_name"
        }
    };

    it("Room query 2", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(query2).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                expect(result.body).to.deep.equal({
                    result: [{rooms_name: 'DMP_101'},
                        {rooms_name: 'DMP_110'},
                        {rooms_name: 'DMP_201'},
                        {rooms_name: 'DMP_301'},
                        {rooms_name: 'DMP_310'}]
                });

            });
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });

    let query3 = {
        "WHERE": {
            "IS": {
                "rooms_fullname": "Hugh Dempster Pavilion"
            }
        },
        "OPTIONS": {
            "COLUMNS": [
                "rooms_address", "rooms_name"
            ]
        }
    };

    it("Room query 3", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(query3).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                expect(result.body).to.deep.equal({ result:
                    [ { rooms_address: '6245 Agronomy Road V6T 1Z4',
                        rooms_name: 'DMP_101' },
                        { rooms_address: '6245 Agronomy Road V6T 1Z4',
                            rooms_name: 'DMP_110' },
                        { rooms_address: '6245 Agronomy Road V6T 1Z4',
                            rooms_name: 'DMP_201' },
                        { rooms_address: '6245 Agronomy Road V6T 1Z4',
                            rooms_name: 'DMP_301' },
                        { rooms_address: '6245 Agronomy Road V6T 1Z4',
                            rooms_name: 'DMP_310' } ] });

            });
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });

    let invalid_query = {
        "WHERE": {
            "WHEN": {
                "rooms_furniture": 'Classroom-Movable*'
            }
        },
        "OPTIONS": {
            "COLUMNS": [
                "rooms_address", "rooms_name", "rooms_furniture"
            ]
        }
    };

    it("Room query - invalid_query", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });

            return insightFacade.performQuery(invalid_query).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(400);
                expect(result.body).to.deep.equal({error: "Invalid Query - 400 !"});

            }).catch(err => {
                console.log("performQUery error: ", err);
                expect.fail();
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            console.log("addDataset error: ", error);
            expect.fail();
        })
    });

    let query4_room = {
        "WHERE": {
            "EQ": {
                "rooms_seats": 30
            }
        },
        "OPTIONS": {
            "COLUMNS": [
                "rooms_address", "rooms_name", "rooms_seats"
            ]
        }
    };

    it("Room query 4_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            return insightFacade.performQuery(query4_room).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                //console.log(result.body);
                expect(result.body).to.deep.equal({ result:
                    [ { rooms_address: '2194 Health Sciences Mall',
                        rooms_name: 'WOOD_B75',
                        rooms_seats: 30 },
                        { rooms_address: '2194 Health Sciences Mall',
                            rooms_name: 'WOOD_G41',
                            rooms_seats: 30 },
                        { rooms_address: '1866 Main Mall',
                            rooms_name: 'BUCH_D205',
                            rooms_seats: 30 },
                        { rooms_address: '1866 Main Mall',
                            rooms_name: 'BUCH_D207',
                            rooms_seats: 30 },
                        { rooms_address: '1866 Main Mall',
                            rooms_name: 'BUCH_D213',
                            rooms_seats: 30 },
                        { rooms_address: '1866 Main Mall',
                            rooms_name: 'BUCH_D221',
                            rooms_seats: 30 },
                        { rooms_address: '1866 Main Mall',
                            rooms_name: 'BUCH_D229',
                            rooms_seats: 30 },
                        { rooms_address: '1866 Main Mall',
                            rooms_name: 'BUCH_D304',
                            rooms_seats: 30 },
                        { rooms_address: '1866 Main Mall',
                            rooms_name: 'BUCH_D307',
                            rooms_seats: 30 },
                        { rooms_address: '1866 Main Mall',
                            rooms_name: 'BUCH_D313',
                            rooms_seats: 30 },
                        { rooms_address: '6331 Crescent Road V6T 1Z1',
                            rooms_name: 'UCLL_101',
                            rooms_seats: 30 },
                        { rooms_address: '6331 Crescent Road V6T 1Z1',
                            rooms_name: 'UCLL_109',
                            rooms_seats: 30 },
                        { rooms_address: '1984 Mathematics Road',
                            rooms_name: 'MATH_105',
                            rooms_seats: 30 },
                        { rooms_address: '1984 Mathematics Road',
                            rooms_name: 'MATH_202',
                            rooms_seats: 30 },
                        { rooms_address: '1984 Mathematics Road',
                            rooms_name: 'MATH_204',
                            rooms_seats: 30 },
                        { rooms_address: '6224 Agricultural Road',
                            rooms_name: 'HENN_301',
                            rooms_seats: 30 },
                        { rooms_address: '6224 Agricultural Road',
                            rooms_name: 'HENN_302',
                            rooms_seats: 30 },
                        { rooms_address: '1961 East Mall V6T 1Z1',
                            rooms_name: 'IBLC_461',
                            rooms_seats: 30 },
                        { rooms_address: '2206 East Mall',
                            rooms_name: 'SPPH_B108',
                            rooms_seats: 30 } ] });
            }).catch(err => {
                console.log("performQUery error: ", err);
                expect.fail();
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            console.log("addDataset error: ", error);
            expect.fail();
        })
    });

    let query5_room = {
        "WHERE":{
            "OR":[
                {
                    "AND":[
                        {
                            "GT":{
                                "courses_avg":90
                            }
                        },
                        {
                            "IS":{
                                "courses_dept":"adhe"
                            }
                        }
                    ]
                },
                {
                    "EQ":{
                        "courses_avg":95
                    }
                }
            ]
        },
        "OPTIONS":{
            "COLUMNS":[
                "courses_dept",
                "courses_id",
                "courses_avg"
            ],
            "ORDER":"courses_avg"
        }
    };

    it("Room query 5_room", function () {
        let content: string = fs.readFileSync("/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_full.zip", "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });

            return insightFacade.performQuery(query5_room).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                //console.log(result.body);
                expect(result.body).to.deep.equal({ result:
                    [ { courses_dept: 'adhe', courses_id: '329', courses_avg: 90.02 },
                        { courses_dept: 'adhe', courses_id: '412', courses_avg: 90.16 },
                        { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.17 },
                        { courses_dept: 'adhe', courses_id: '412', courses_avg: 90.18 },
                        { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.5 },
                        { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.72 },
                        { courses_dept: 'adhe', courses_id: '329', courses_avg: 90.82 },
                        { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.85 },
                        { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.29 },
                        { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33 },
                        { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33 },
                        { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.48 },
                        { courses_dept: 'adhe', courses_id: '329', courses_avg: 92.54 },
                        { courses_dept: 'adhe', courses_id: '329', courses_avg: 93.33 },
                        { courses_dept: 'cpsc', courses_id: '589', courses_avg: 95 },
                        { courses_dept: 'sowk', courses_id: '570', courses_avg: 95 },
                        { courses_dept: 'mtrl', courses_id: '599', courses_avg: 95 },
                        { courses_dept: 'mtrl', courses_id: '564', courses_avg: 95 },
                        { courses_dept: 'mtrl', courses_id: '564', courses_avg: 95 },
                        { courses_dept: 'nurs', courses_id: '424', courses_avg: 95 },
                        { courses_dept: 'nurs', courses_id: '424', courses_avg: 95 },
                        { courses_dept: 'kin', courses_id: '500', courses_avg: 95 },
                        { courses_dept: 'kin', courses_id: '500', courses_avg: 95 },
                        { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                        { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                        { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                        { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                        { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                        { courses_dept: 'cpsc', courses_id: '589', courses_avg: 95 },
                        { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                        { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                        { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                        { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                        { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                        { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                        { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
                        { courses_dept: 'cnps', courses_id: '535', courses_avg: 95 },
                        { courses_dept: 'cnps', courses_id: '535', courses_avg: 95 },
                        { courses_dept: 'edcp', courses_id: '473', courses_avg: 95 },
                        { courses_dept: 'edcp', courses_id: '473', courses_avg: 95 },
                        { courses_dept: 'obst', courses_id: '549', courses_avg: 95 },
                        { courses_dept: 'epse', courses_id: '606', courses_avg: 95 },
                        { courses_dept: 'math', courses_id: '532', courses_avg: 95 },
                        { courses_dept: 'math', courses_id: '532', courses_avg: 95 },
                        { courses_dept: 'bmeg', courses_id: '597', courses_avg: 95 },
                        { courses_dept: 'bmeg', courses_id: '597', courses_avg: 95 },
                        { courses_dept: 'epse', courses_id: '682', courses_avg: 95 },
                        { courses_dept: 'epse', courses_id: '682', courses_avg: 95 },
                        { courses_dept: 'econ', courses_id: '516', courses_avg: 95 },
                        { courses_dept: 'econ', courses_id: '516', courses_avg: 95 },
                        { courses_dept: 'psyc', courses_id: '501', courses_avg: 95 },
                        { courses_dept: 'psyc', courses_id: '501', courses_avg: 95 },
                        { courses_dept: 'kin', courses_id: '499', courses_avg: 95 },
                        { courses_dept: 'rhsc', courses_id: '501', courses_avg: 95 },
                        { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
                        { courses_dept: 'adhe', courses_id: '329', courses_avg: 96.11 } ] });
            }).catch(err => {
                console.log("performQUery error: ", err);
                expect.fail();
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            console.log("addDataset error: ", error);
            expect.fail();
        })
    });

    let query6_room = {
        "WHERE": {
            "AND": [{
                "IS": {
                    "rooms_furniture": "*Tables*"
                }
            }, {
                "GT": {
                    "rooms_seats": 300
                }
            }]
        },
        "OPTIONS": {
            "COLUMNS": [
                "rooms_shortname",
                "maxSeats"
            ],
            "ORDER": {
                "dir": "DOWN",
                "keys": ["maxSeats"]
            }
        },
        "TRANSFORMATIONS": {
            "GROUP": ["rooms_shortname"],
            "APPLY": [{
                "maxSeats": {
                    "MAX": "rooms_seats"
                }
            }]
        }
    };

    it("Room query 6_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(query6_room).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                expect(result.body).to.deep.equal({body: {result : [ { rooms_shortname: 'OSBO', maxSeats: 442 },
                    { rooms_shortname: 'HEBB', maxSeats: 375 },
                    { rooms_shortname: 'LSC', maxSeats: 350 },
                    { rooms_shortname: 'LSC', maxSeats: 350 } ]}});

            });
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });


    let query7_room = {
        "WHERE": {
            "AND": [{
                "IS": {
                    "rooms_furniture": "*Tables*"
                }
            }, {
                "GT": {
                    "rooms_seats": 300
                }
            }]
        },
        "OPTIONS": {
            "COLUMNS": [
                "rooms_shortname",
                "avgSeats"
            ],
            "ORDER": {
                "dir": "DOWN",
                "keys": ["avgSeats"]
            }
        },
        "TRANSFORMATIONS": {
            "GROUP": ["rooms_shortname"],
            "APPLY": [{
                "avgSeats": {
                    "AVG": "rooms_seats"
                }
            }]
        }
    };

    it("Room query 113_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });

            return insightFacade.performQuery(query7_room).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                //console.log(result.body);
                expect(result.body).to.deep.equal({ result:
                    [ { rooms_shortname: 'OSBO', avgSeats: 442 },
                        { rooms_shortname: 'HEBB', avgSeats: 375 },
                        { rooms_shortname: 'LSC', avgSeats: 350 } ] });
            }).catch(err => {
                console.log("performQUery error: ", err);
                expect.fail();
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            console.log("addDataset error: ", error);
            expect.fail();
        })
    });

    let complexQuery = {
        "WHERE": {
            "AND": [
                {
                    "GT": {
                        "courses_avg": 90
                    }
                },
                {
                    "IS": {
                        "courses_dept": "adhe"
                    }
                }
            ]
        },
        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "courses_id",
                "courses_avg"
            ],
            "ORDER": "courses_avg"
        }
    };
    it("Room query 12_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_3.zip', "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(complexQuery).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(400);
                expect(result.body).to.deep.equal({body: {error: 'the query failed' + error}});

            });
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });
    it("Room query 8_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_3.zip', "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(complexQuery).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(400);
                expect(result.body).to.deep.equal({body: {error: 'the query failed' + error}});

            });
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });
    it("Room query 9_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_3.zip', "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(complexQuery).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(400);
                expect(result.body).to.deep.equal({body: {error: 'the query failed' + error}});

            });
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });
    it("Room query 10_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_3.zip', "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(complexQuery).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(400);
                expect(result.body).to.deep.equal({body: {error: 'the query failed' + error}});

            });
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });it("Room query 7_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_3.zip', "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(complexQuery).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(400);
                expect(result.body).to.deep.equal({body: {error: 'the query failed' + error}});

            });
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });
    it("Room query 11_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_3.zip', "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(complexQuery).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(400);
                expect(result.body).to.deep.equal({body: {error: 'the query failed' + error}});

            });
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });


    let complexQuery5 ={
        "WHERE":{
            "AND": [{
                "IS": {
                    "courses_instructor":"*a"
                }
            },
                {
                    "IS": {
                        "courses_dept":"cpsc"
                    }
                }
            ]},
        "OPTIONS":{
            "COLUMNS":[
                "courses_dept",
                "courses_instructor"
            ],
            "ORDER":"courses_instructor"
        }
    };
    it("Room query 20_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_3.zip', "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });

            return insightFacade.performQuery(complexQuery5).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                console.log(result.body);
                expect(result.body).to.deep.equal({ result:
                    [ { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'berg, celina' },
                        { courses_dept: 'cpsc', courses_instructor: 'berg, celina' },
                        { courses_dept: 'cpsc', courses_instructor: 'conati, cristina' },
                        { courses_dept: 'cpsc', courses_instructor: 'conati, cristina' },
                        { courses_dept: 'cpsc', courses_instructor: 'conati, cristina' },
                        { courses_dept: 'cpsc', courses_instructor: 'conati, cristina' },
                        { courses_dept: 'cpsc', courses_instructor: 'conati, cristina' },
                        { courses_dept: 'cpsc', courses_instructor: 'conati, cristina' },
                        { courses_dept: 'cpsc', courses_instructor: 'conati, cristina' },
                        { courses_dept: 'cpsc', courses_instructor: 'conati, cristina' },
                        { courses_dept: 'cpsc', courses_instructor: 'conati, cristina' },
                        { courses_dept: 'cpsc', courses_instructor: 'conati, cristina' },
                        { courses_dept: 'cpsc', courses_instructor: 'cooper, kendra' },
                        { courses_dept: 'cpsc', courses_instructor: 'cooper, kendra' },
                        { courses_dept: 'cpsc',
                            courses_instructor: 'darwish, mohammad mostafa' },
                        { courses_dept: 'cpsc', courses_instructor: 'dawson, jessica' },
                        { courses_dept: 'cpsc', courses_instructor: 'dawson, jessica' },
                        { courses_dept: 'cpsc', courses_instructor: 'dawson, jessica' },
                        { courses_dept: 'cpsc', courses_instructor: 'dawson, jessica' },
                        { courses_dept: 'cpsc', courses_instructor: 'dunfield, joshua' },
                        { courses_dept: 'cpsc',
                            courses_instructor: 'mcgrenere, joanna' },
                        { courses_dept: 'cpsc',
                            courses_instructor: 'mcgrenere, joanna' },
                        { courses_dept: 'cpsc',
                            courses_instructor: 'mcgrenere, joanna' },
                        { courses_dept: 'cpsc',
                            courses_instructor: 'mcgrenere, joanna' },
                        { courses_dept: 'cpsc',
                            courses_instructor: 'mcgrenere, joanna' },
                        { courses_dept: 'cpsc',
                            courses_instructor: 'mcgrenere, joanna' },
                        { courses_dept: 'cpsc',
                            courses_instructor: 'mcgrenere, joanna' },
                        { courses_dept: 'cpsc',
                            courses_instructor: 'mcgrenere, joanna' },
                        { courses_dept: 'cpsc', courses_instructor: 'munzner, tamara' },
                        { courses_dept: 'cpsc', courses_instructor: 'munzner, tamara' },
                        { courses_dept: 'cpsc', courses_instructor: 'munzner, tamara' },
                        { courses_dept: 'cpsc', courses_instructor: 'munzner, tamara' },
                        { courses_dept: 'cpsc', courses_instructor: 'munzner, tamara' },
                        { courses_dept: 'cpsc', courses_instructor: 'munzner, tamara' },
                        { courses_dept: 'cpsc', courses_instructor: 'munzner, tamara' },
                        { courses_dept: 'cpsc', courses_instructor: 'munzner, tamara' },
                        { courses_dept: 'cpsc', courses_instructor: 'munzner, tamara' },
                        { courses_dept: 'cpsc', courses_instructor: 'sheffer, alla' },
                        { courses_dept: 'cpsc', courses_instructor: 'sheffer, alla' },
                        { courses_dept: 'cpsc', courses_instructor: 'sheffer, alla' },
                        { courses_dept: 'cpsc', courses_instructor: 'sheffer, alla' } ] });
            }).catch(err => {
                console.log("performQUery error: ", err);
                expect.fail();
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            console.log("addDataset error: ", error);
            expect.fail();
        })
    });

    let complexQuery9 ={
        "WHERE":{
            "AND": [{
                "OR":[{
                    "IS": {"courses_instructor": "*elisa*"}
                }, {
                    "IS": {"courses_instructor": "*reid*"}

                }]
            },
                {
                    "IS": {
                        "courses_dept":"cpsc"
                    }
                }
            ]},
        "OPTIONS":{
            "COLUMNS":[
                "courses_dept",
                "courses_instructor"
            ],
            "ORDER":"courses_instructor"
        }
    };
    it("Room query 21_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_3.zip', "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });

            return insightFacade.performQuery(complexQuery9).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                //console.log(result.body);
                expect(result.body).to.deep.equal({ result:
                    [ { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'baniassad, elisa' },
                        { courses_dept: 'cpsc', courses_instructor: 'holmes, reid' },
                        { courses_dept: 'cpsc', courses_instructor: 'holmes, reid' },
                        { courses_dept: 'cpsc', courses_instructor: 'holmes, reid' } ] });
            }).catch(err => {
                console.log("performQUery error: ", err);
                expect.fail();
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            console.log("addDataset error: ", error);
            expect.fail();
        })
    });

    let complexQuery10 ={
        "WHERE": {
            "AND": [
                {
                    "IS": {
                        "courses_dept": "cpsc"
                    }
                },
                {
                    "GT": {
                        "courses_avg": 88
                    }
                },
                {
                    "IS": {
                        "courses_instructor": "c*"
                    }
                }

            ]
        },
        "OPTIONS": {
            "COLUMNS": [
                "courses_instructor",
                "courses_dept",
                "courses_avg"
            ],
            "ORDER": "courses_avg"
        }
    };
    it("Room query 22_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_3.zip', "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });

            return insightFacade.performQuery(complexQuery10).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                expect(result.body).to.deep.equal({ result:
                    [{courses_instructor: 'carenini, giuseppe', courses_dept: 'cpsc', courses_avg: 88.82},
                        {courses_instructor: 'carenini, giuseppe', courses_dept: 'cpsc', courses_avg: 89.1},
                        {courses_instructor: 'carenini, giuseppe', courses_dept: 'cpsc', courses_avg: 89.47},
                        {courses_instructor: 'carenini, giuseppe', courses_dept: 'cpsc', courses_avg: 94.5}
                    ] });
            }).catch(err => {
                console.log("performQUery error: ", err);
                expect.fail();
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            console.log("addDataset error: ", error);
            expect.fail();
        })
    });

    let complexQuery11 ={
        "WHERE": {
            "AND": [
                {
                    "IS": {
                        "courses_dept": "*ps*"
                    }
                },
                {
                    "GT": {
                        "courses_avg": 98
                    }
                },
                {
                    "IS": {
                        "courses_instructor": "*c*"
                    }
                }

            ]
        },
        "OPTIONS": {
            "COLUMNS": [
                "courses_instructor",
                "courses_dept",
                "courses_avg"
            ],
            "ORDER": "courses_avg"
        }
    };
    it("Room query 29_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_3.zip', "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });

            return insightFacade.performQuery(complexQuery11).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                expect(result.body).to.deep.equal({ result:
                    [
                        {courses_instructor: 'cole, kenneth', courses_dept: 'epse', courses_avg: 98.08},
                        {courses_instructor: 'cannon, joanna', courses_dept: 'epse', courses_avg: 98.45},
                        {courses_instructor: 'cole, kenneth', courses_dept: 'epse', courses_avg: 98.7},
                        {courses_instructor: 'cox, daniel', courses_dept: 'cnps', courses_avg: 99.19}
                    ] });
            }).catch(err => {
                console.log("performQUery error: ", err);
                expect.fail();
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            console.log("addDataset error: ", error);
            expect.fail();
        })
    });

    let complexQuery12 ={
        "WHERE": {

        },
        "OPTIONS": {
            "COLUMNS": [
                "rooms_name"
            ],
            "ORDER": "rooms_name"
        }
    };
    it("Room query 24_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });

            return insightFacade.performQuery(complexQuery12).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                //console.log(result.body);
                expect(result.body).to.deep.equal({ result:
                    [
                        {courses_instructor: 'wohlstadter, eric', courses_dept: 'cpsc', courses_avg: 91.79}
                    ] });
            }).catch(err => {
                console.log("performQUery error: ", err);
                expect.fail();
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            console.log("addDataset error: ", error);
            expect.fail();
        })
    });


    let complexQuery101 ={
        "WHERE":{
            "OR":[
                {
                    "AND":[
                        {
                            "GT":{
                                "courses_avg":60
                            }
                        },
                        {
                            "IS":{
                                "courses_dept":"engl"
                            }
                        }
                    ]
                },
                {
                    "EQ":{
                        "courses_avg":95
                    }
                },
                {
                    "NOT":{
                        "NOT":{
                            "GT":{
                                "courses_audit": 20
                            }
                        }
                    }
                }
            ]
        },
        "OPTIONS":{
            "COLUMNS":[
                "courses_dept",
                "courses_instructor",
                "courses_uuid"
            ]
        }
    };
    it("Room query 25_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_full.zip', "base64");
        return insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });

            return insightFacade.performQuery(complexQuery101).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);

                expect(result.body).to.deep.equal({ result:
                    [
                        {courses_instructor: 'wohlstadter, eric', courses_dept: 'cpsc', courses_avg: 91.79}
                    ] });
            }).catch(err => {
                console.log("performQUery error: ", err);
                expect.fail();
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            console.log("addDataset error: ", error);
            expect.fail();
        })
    });

});