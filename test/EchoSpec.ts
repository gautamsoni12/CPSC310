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
import * as assert from "assert";
import {fail} from "assert";


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


    it("Should be able to handle a file", function () {

        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/Courses1.zip', "base64");
        insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);
            insightFacade.removeDataset('courses').then(function (value: InsightResponse) {
                console.log(value);
                Log.test('Value:' + value);
                expect(value).to.deep.equal({
                    "code": 204,
                    "body": {res: 'the operation was successful'}
                });

            }).catch(function (error) {
                Log.test('Error:' + error);
                expect.fail();
            })

            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
            //console.log(value);

        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });


    it("Should be able to handle a file 1", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_full.zip', "base64");
        insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            //console.log(value);
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 201,
                "body": {res: 'the operation was successful and the id already existed'}
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });

    it("Should be able to handle a file 2", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses2.zip', "base64");
        insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            //console.log(value);
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 201,
                "body": {res: 'the operation was successful and the id was new'}
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });

    it("Should be able to handle a file 3", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/Courses1.zip', "base64");
        insightFacade.removeDataset('courses').then(function (value: InsightResponse) {
            // console.log(value);

            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful'}
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });


    it("Should be able to handle a file 4", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/Courses1.zip', "base64");
        insightFacade.removeDataset('courses').then(function (value: InsightResponse) {
            //console.log(value);
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 404,
                "body": {res: 'the operation was unsuccessful because the delete was for a resource that was not previously added.'}
            });

        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });


    //TEST CASES FOR: addDataSet
    //TEST CASES FOR: addDataSet  (USE DATASET GIVEN ON D1 WEBPAGE TO DO TESTS)
    //addDataSet with invalid zip file, should return error 400
    //addDataSet with zip file containing no files, should return error 400
    //addDataSet with zip file containing invalid course, should return error 400
    //addDataSet with zip file containing invalid JSON, should return error 400
    //addDataSet with zip file containing one course, result should be that course stored in DS & persisted to disk
    //addDataSet with zip file containing multiple courses, result should be the courses stored in DS & persisted to disk
    //addDataSet with zip file containing course already added, result should be data for existing course overwritten & persisted to disk

    //TESTS FPR addDataset

    //TESTS FOR PARSING QUERIES
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

    it("parse basic query, should return no error", function () {
        let ifInstance: InsightFacade = new InsightFacade();
        ifInstance.performQuery(query).then(function (result) {
            sanityCheck(result);
            expect(result.code).to.equal(200);
            expect(result.body).to.deep.equal({message: 'Query is valid'});
        })
    });

    it("Query should get sections", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/courses_full.zip', "base64");
        insightFacade.addDataset('courses', content).then(function (value: InsightResponse) {
            // console.log(value);
            Log.test('Value:' + value);
            insightFacade.performQuery(query).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                expect(result.body).to.deep.equal({result: []});

            });
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful'}
            });


        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        });

    });


    let complexQuery = {
        "WHERE": {
            "OR": [
                {
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
                {
                    "EQ": {
                        "courses_avg": 95
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

    it("parse complex query, should return no error", function () {
        let ifInstance: InsightFacade = new InsightFacade();
        let promise: Promise<InsightResponse> = ifInstance.performQuery(query);
        promise.then(function (result) {
            sanityCheck(result);
            expect(result.code).to.equal(200);
            expect(result.body).to.deep.equal({message: 'Query is valid'});
        }).catch()
    });

    let invalidQuery = {
        "WHERE": {
            "OR": [
                {
                    "AND": [
                        {
                            "GT": {
                                "courses_lul": 90
                            }
                        },
                        {
                            "IS": {
                                "courses_dept": "adhe"
                            }
                        }
                    ]
                },
                {
                    "POO": {
                        "courses_avg": 95
                    }
                }
            ]
        },
        "OPTIONS": {
            "COLUMNS": [
                "courses_dsd",
                "courses_id",
                "courses_avg"
            ],
            "ORDER": "courses_avg"
        }
    };


    it("parse invalid query, should return error with code 400", function () {
        let ifInstance: InsightFacade = new InsightFacade();
        ifInstance.performQuery(complexQuery).then(function (result) {
            expect.fail("should not go here");
        }).catch(function (result) {
            //sanityCheck(result);
            expect(result.code).to.deep.equal(400);
            expect(result.body).to.have.property('error');
            expect(result.body).to.deep.equal({message: 'Query failed. query is invalid'});
        });
    });

    it("Should be able to handle a html file ", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
        }).catch(function (error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });

    let roomQuery = {
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

    it("Should be able to handle a html query", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(roomQuery).then(function (result) {
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

    let roomQuery2 = {
        "WHERE": {
            "IS": {
                "rooms_address": "*Agrono*"
            }
        },
        "OPTIONS": {
            "COLUMNS": [
                "rooms_address", "rooms_name"
            ]
        }
    };

    it("Should be able to handle a html query2", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(roomQuery2).then(function (result) {
                sanityCheck(result);

                expect(result.code).to.equal(200);
                expect(result.body).to.deep.equal({
                    result:
                        [{
                            rooms_address: '6245 Agronomy Road V6T 1Z4',
                            rooms_name: 'DMP_101'
                        },
                            {
                                rooms_address: '6245 Agronomy Road V6T 1Z4',
                                rooms_name: 'DMP_110'
                            },
                            {
                                rooms_address: '6245 Agronomy Road V6T 1Z4',
                                rooms_name: 'DMP_201'
                            },
                            {
                                rooms_address: '6245 Agronomy Road V6T 1Z4',
                                rooms_name: 'DMP_301'
                            },
                            {
                                rooms_address: '6245 Agronomy Road V6T 1Z4',
                                rooms_name: 'DMP_310'
                            },
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_1001'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_3002'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_3004'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_3016'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_3018'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_3052'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_3058'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_3062'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_3068'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_3072'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_3074'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_4002'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_4004'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_4016'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_4018'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_4052'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_4058'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_4062'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_4068'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_4072'},
                            {rooms_address: '6363 Agronomy Road', rooms_name: 'ORCH_4074'}]
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

    let roomQuery3 = {
        "WHERE": {
            "IS": {
                "rooms_name": "DMP_*"
            }
        },

    };

    it("Should be able to handle a html query- INVALID", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(roomQuery3).then(function (result) {
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

    let roomQuery4 = {

        "OPTIONS": {
            "COLUMNS": [
                "courses_dept",
                "courses_avg"
            ],
            "ORDER": "courses_avg"
        }

    };

    it("Should be able to handle a html query- INVALID 2", function () {
        let content: string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/rooms.zip', "base64");
        return insightFacade.addDataset('rooms', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);

            insightFacade.performQuery(roomQuery4).then(function (result) {
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
});

