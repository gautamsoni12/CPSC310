/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";

describe("EchoSpec", function () {


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

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
    //TEST CASES FOR: addDataSet  (USE DATASET GIVEN ON D1 WEBPAGE TO DO TESTS)
    //addDataSet with invalid zip file, should return error 400
    //addDataSet with zip file containing no files, should return error 400
    //addDataSet with zip file containing invalid course, should return error 400
    //addDataSet with zip file containing invalid JSON, should return error 400
    //addDataSet with zip file containing one course, result should be that course stored in DS & persisted to disk
    //addDataSet with zip file containing multiple courses, result should be the courses stored in DS & persisted to disk
    //addDataSet with zip file containing course already added, result should be data for existing course overwritten & persisted to disk


    //TESTS FOR PARSING QUERIES
    let query = {
        "WHERE":{
            "GT":{
                "courses_avg":97
            }
        },
        "OPTIONS":{
            "COLUMNS":[
                "courses_dept",
                "courses_avg"
            ],
            "ORDER":"courses_avg"
        }
    }

    it("parse basic query, should return no error", function () {
        let ifInstance: InsightFacade = new InsightFacade();
        let promise = ifInstance.performQuery(query);
        promise.then(function (result) {
            sanityCheck(result);
            expect(result.code).to.equal(200);
            expect(result.body).to.deep.equal({message: 'Query is valid'})
        })
    })

});
