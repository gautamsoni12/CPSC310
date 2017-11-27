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

describe("EchoSpec3", function () {


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

    it("Test Server", function() {

        // Init
        chai.use(chaiHttp);
        let server = new Server(4321);
        let URL = "http://127.0.0.1:4321";

        // Test
        expect(server).to.not.equal(undefined);
        try{
            Server.echo((<restify.Request>{}), null, null);
            expect.fail()
        } catch(err) {
            expect(err.message).to.equal("Cannot read property 'json' of null");
        }

        return server.start().then(function(success: boolean) {
            return chai.request(URL)
                .get("/")
        }).catch(function(err) {
            expect.fail()
        }).then(function(res: Response) {
            expect(res.status).to.be.equal(200);
            return chai.request(URL)
                .get("/echo/Hello")
        }).catch(function(err) {
            expect.fail()
        }).then(function(res: Response) {
            expect(res.status).to.be.equal(200);
            return server.start()
        }).then(function(success: boolean) {
            expect.fail();
        }).catch(function(err) {
            expect(err.code).to.equal('EADDRINUSE');
            return server.stop();
        }).catch(function(err) {
            expect.fail();
        });
    });


    it("PUT description", function () {
        chai.use(chaiHttp);
        let server = new Server(4321);
        let URL = "http://127.0.0.1:4321";

        return server.start().then(function (success: boolean) {
            return chai.request(URL)
                .put('/dataset/rooms')
                .attach("body", fs.readFileSync("rooms.zip"), "rooms.zip")
                .then(function (res: Response) {
                    Log.trace('then:');
                    // some assertions
                })
                .catch(function (err) {
                    Log.trace('catch:');
                    // some assertions
                    expect.fail();
                });
        });
    });

    it("DEL description", function () {
        chai.use(chaiHttp);
        let server = new Server(4321);
        let URL = "http://127.0.0.1:4321";

        return server.start().then(function (success: boolean) {
            return chai.request(URL)
                .del('/dataset/rooms')
                .attach("body", fs.readFileSync("rooms.zip"), "rooms.zip")
                .then(function (res: Response) {
                    Log.trace('then:');
                    // some assertions
                })
                .catch(function (err) {
                    Log.trace('catch:');
                    // some assertions
                    expect.fail();
                });
        });
    });

    let queryJSONObject ={
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


    it("POST description", function () {
        chai.use(chaiHttp);
        let server = new Server(4321);
        let URL = "http://127.0.0.1:4321";

        console.log(1);

        return server.start().then(function (success: boolean) {
            return chai.request(URL)
                .post('/query')
                .send(queryJSONObject)
                .then(function (res: Response) {
                    Log.trace('then:');
                    // some assertions
                })
                .catch(function (err) {
                    Log.trace('catch:');
                    console.log(err);
                    // some assertions
                    expect.fail();
                });
        });
    });


});