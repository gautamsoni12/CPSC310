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

            insightFacade.performQuery(invalid_query).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(400);
                expect(result.body).to.deep.equal({error: 'the query failed' + error});

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

            insightFacade.performQuery(query4_room).then(function (result) {
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

    let query5_room = {
        "WHERE": {
            "AND": [{
                "GT": {
                    'rooms_seats': 100
                }
            }, {
                "IS": {"rooms_shortname": "BUCH"}
            }]
        },
        "OPTIONS": {
            "COLUMNS": [
                "rooms_lat", "rooms_lon", "rooms_name"
            ]
        }
    };

    it("Room query 5_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(query5_room).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                expect(result.body).to.deep.equal({body: {error: 'the query failed' + error}});

            }).catch(function (error) {

                console.log(error.message);
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

    let query6_room = {
        "WHERE": {
            "IS": {
                "rooms_type": "Small Group"
            }
        },
        "OPTIONS": {
            "COLUMNS": [
                "rooms_lat", "rooms_lon", "rooms_name", "rooms_type"
            ]
        }
    };

    it("Room query 6_room", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(query6_room).then(function (result) {
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

});