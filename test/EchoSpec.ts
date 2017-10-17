/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import {Course} from "../src/controller/Courses";

import chai = require('chai');
import chaiHttp = require('chai-http');
import Response = ChaiHttp.Response;
import restify = require('restify');
import * as fs from "fs";

describe("EchoSpec", function () {


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    let insightFacade: InsightFacade = null;
    beforeEach(function() {
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
        let content : string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/Courses1.zip', "base64");
        return insightFacade.addDataset('Courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
            console.log(value);
        }).catch(function(error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });
/*
    it("Should be able to handle a file 1", function () {
        let content : string = fs.readFileSync('/Users/gautamsoni/Desktop/CPSC 310/D1/cpsc310_team126/Courses1.zip', "base64");
        return insightFacade.addDataset('Courses', content).then(function (value: InsightResponse) {
            Log.test('Value:' + value);
            expect(value).to.deep.equal({
                "code": 204,
                "body": {res: 'the operation was successful and the id was new'}
            });
            console.log(value);
        }).catch(function(error) {
            Log.test('Error:' + error);
            expect.fail();
        })
    });
    */




    //TEST CASES FOR: addDataSet
    //TEST CASES FOR: addDataSet  (USE DATASET GIVEN ON D1 WEBPAGE TO DO TESTS)
    //addDataSet with invalid zip file, should return error 400
    //addDataSet with zip file containing no files, should return error 400
    //addDataSet with zip file containing invalid course, should return error 400
    //addDataSet with zip file containing invalid JSON, should return error 400
    //addDataSet with zip file containing one course, result should be that course stored in DS & persisted to disk
    //addDataSet with zip file containing multiple courses, result should be the courses stored in DS & persisted to disk
    //addDataSet with zip file containing course already added, result should be data for existing course overwritten & persisted to disk

});
