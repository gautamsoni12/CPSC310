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
        return insightFacade.addDataset('Courses', 'UEsDBAoAAAAAAKxjTksAAAAAAAAAAAAAAAAJABAAQ291cnNlczEvVVgMAKRl4lmUZeJZ9QEUAFBL\n' +
            'AwQUAAgACAAFVClKAAAAAAAAAAAAAAAAEAAQAENvdXJzZXMxL0FBTkI1MTVVWAwAlGXiWSnXc1j1\n' +
            'ARQAq1YqSi0uzSlRsoqO1VEqSszLVrIyqAUAUEsHCEqAkZoYAAAAFgAAAFBLAwQKAAAAAAC0Y05L\n' +
            'AAAAAAAAAAAAAAAACQAQAF9fTUFDT1NYL1VYDACkZeJZpGXiWfUBFABQSwMECgAAAAAAtGNOSwAA\n' +
            'AAAAAAAAAAAAABIAEABfX01BQ09TWC9Db3Vyc2VzMS9VWAwApGXiWaRl4ln1ARQAUEsDBBQACAAI\n' +
            'AAVUKUoAAAAAAAAAAAAAAAAbABAAX19NQUNPU1gvQ291cnNlczEvLl9BQU5CNTE1VVgMAJRl4lkp\n' +
            '13NY9QEUAGNgFWNnYGJg8E1MVvAPVohQgAKQGAMnEBsB8SIgBvGvMBAFHENCgqBMkI4ZQGyDpoQR\n' +
            'IS6anJ+rl1hQkJOqV1iaWJSYV5KZl8pQqG9gYGFsbWqZnGaSZJxsHZyYlliUaW3gZGhobmlpqeto\n' +
            '5uqoa+JqaqjraOxspmtoYOnq4uRsYmroZMwAAFBLBwj/seRVhwAAANQAAABQSwMEFAAIAAgABVQp\n' +
            'SgAAAAAAAAAAAAAAABEAEABDb3Vyc2VzMS9BQU5CNTMwQVVYDACUZeJZKddzWPUBFACrVipKLS7N\n' +
            'KVGyio7VUSpKzMtWsjKoBQBQSwcISoCRmhgAAAAWAAAAUEsDBBQACAAIAAVUKUoAAAAAAAAAAAAA\n' +
            'AAAcABAAX19NQUNPU1gvQ291cnNlczEvLl9BQU5CNTMwQVVYDACUZeJZKddzWPUBFABjYBVjZ2Bi\n' +
            'YPBNTFbwD1aIUIACkBgDJxAbAfEiIAbxrzAQBRxDQoKgTJCOGUBsg6aEESEumpyfq5dYUJCTqldY\n' +
            'mliUmFeSmZfKUKhvYGBhbG1qmZxmkmScbB2cmJZYlGlt4GRoaG5paanraObqqGviamqo62jsbKZr\n' +
            'aGDp6uLkbGJq6GTMAABQSwcI/7HkVYcAAADUAAAAUEsDBBQACAAIAAtUKUoAAAAAAAAAAAAAAAAQ\n' +
            'ABAAQ291cnNlczEvQU5BVDM5MlVYDACVZeJZNddzWPUBFADt2ltvmzAUAOC/UvkZIV+4OW9Vt2kP\n' +
            'k1apk6ZpmipanISOwAROsq7qf59NQhvAoTYldJN45GYD/nLOsckDyFmxTjiYfX8APGb5NYsXS35/\n' +
            'PY83DMyQZ+32pnHK+L3Y4VvgS8wTcQws8qwozsI05GdJvLopgAWu2C2Ps1QchBCJ7XeMh3EiNsG+\n' +
            'nYJtWCqa59sMzAILfOZLloMZtMCnbAtmLqnOi3/Lm8jW4iC2QByJrgPHrR0t7xTMqkv+sDwrW6p1\n' +
            'JE4VLaD9Xr6Mc/kY1VnzeF4+lQUu82zOiiIT/YFQPE62DFerMIqts1V4J7q3wPk6ivnzpYvq4qe2\n' +
            'sqrprzFfRjnblhvfWCjbxBCR6iXwrby18ugVjyK2ATPfdqkF3qd5liRMPGyAD+9wPxpVT7shErft\n' +
            'HL6P5+OcpeXGR3EemFFx1oV4kYUcM0JxOUxFsRumrdi6DIti1+OHcrDEleebhdiDbLnzIlz9WosT\n' +
            'wPrmVl67vrkToyxfkxh58GgN6ybbsDxMkuHteOPYmaAYQcFBAwqGAwYYr40kUCAheyTYo7CnEtqN\n' +
            'BI4SYJwON4FNcM0NUbhBTTe47gap3bh6bkjLDbE9d2w3ugHG3A4axc4ExQwKaUCRsXCwAENbSLyu\n' +
            'LOQi11EhQS8j8d4owKBDN7jDjWdTr+YGKtw0ExMmWm70EpNPFW6IM7Yb3QBjbkdZ/g5uZ4JiVuo2\n' +
            'M5GsfQcLMG4biSoLwarMdZGyznX/3QBzmJgg7XTjk0M3vpYbWHdzpPLVS0yyx5Ybf3Q3ugHG3I4/\n' +
            'ip0JihkUesoA0y5zPahA4uyQEBy4yimSBhKzMlcIiKyzKEvTcAgvfocXamPjfFT/qZTv5xUFb5sL\n' +
            'sh00Npf+M6OXyChnRoOTmZwYFbhuwwmmA4YV0jLiOAojsDJCfWXdolHcnnLlBdXZoKMTaq9zQg2R\n' +
            'uZvGhPpIOqKG9S6q3Hi2HO5x3ejGF3M7yrplcDsTFLNE1IQidwwWYPwnJKhKQiok++U530OuEgl+\n' +
            'GQkiJ4ww2kt2qLPgDWpwfKoBpzmjPgKH6MEJWpkJvwEc3QhjjicYB88k5XVz6CFLGAT16ly0UxIg\n' +
            'hJU1jP+/hBjY+dmRGrtBQd0NUbvpvWYHbfkVaFQ3ugGmhx1lehrezgTldamInOT/L7hCQhVI9oUu\n' +
            'hcTpu0CHTjlL6nJT+yrgdmYmWeQfFL+oB5wjmQn3zUzI9vuuwvSGY/4HGF08yhpmeDyTlGNSflgg\n' +
            'D9OfckkOP/4FUEsHCMjftDevAwAAeicAAFBLAwQUAAgACAALVClKAAAAAAAAAAAAAAAAGwAQAF9f\n' +
            'TUFDT1NYL0NvdXJzZXMxLy5fQU5BVDM5MlVYDACVZeJZNddzWPUBFABjYBVjZ2BiYPBNTFbwD1aI\n' +
            'UIACkBgDJxAbAfEtIAbyGXkYiAKOISFBEBZYxwEg9kFTwgQVF2BgkErOz9VLLCjISdXLSSwuKS1O\n' +
            'TUlJLElVDgiGqr0AxDYMDKIIdYWliUWJeSWZeakMx1bcigQp8lCTNQPRhfoGBhbG1qaWyWkmScbJ\n' +
            '1sGJaYlFmdYGToaG5paWlrqOZq6Ouiaupoa6jsbOZrqGBpauLk7OJqaGTsYMAFBLBwjkIZTtsAAA\n' +
            'AAwBAABQSwMEFAAIAAgACFQpSgAAAAAAAAAAAAAAABAAEABDb3Vyc2VzMS9BQU5CNjQ5VVgMAJVl\n' +
            '4lkw13NY9QEUAKtWKkotLs0pUbKKjtVRKkrMy1ayMqgFAFBLBwhKgJGaGAAAABYAAABQSwMEFAAI\n' +
            'AAgACFQpSgAAAAAAAAAAAAAAABsAEABfX01BQ09TWC9Db3Vyc2VzMS8uX0FBTkI2NDlVWAwAlWXi\n' +
            'WTDXc1j1ARQAY2AVY2dgYmDwTUxW8A9WiFCAApAYAycQGwHxIiAG8a8wEAUcQ0KCoEyQjhlAbIOm\n' +
            'hBEhLpqcn6uXWFCQk6pXWJpYlJhXkpmXylCob2BgYWxtapmcZpJknGwdnJiWWJRpbeBkaGhuaWmp\n' +
            '62jm6qhr4mpqqOto7Gyma2hg6eri5GxiauhkzAAAUEsHCP+x5FWHAAAA1AAAAFBLAwQUAAgACAAK\n' +
            'VClKAAAAAAAAAAAAAAAAEAAQAENvdXJzZXMxL0FOQUU0MzBVWAwAlWXiWTTXc1j1ARQAq1YqSi0u\n' +
            'zSlRsoqO1VEqSszLVrIyqAUAUEsHCEqAkZoYAAAAFgAAAFBLAwQUAAgACAAKVClKAAAAAAAAAAAA\n' +
            'AAAAGwAQAF9fTUFDT1NYL0NvdXJzZXMxLy5fQU5BRTQzMFVYDACVZeJZNNdzWPUBFABjYBVjZ2Bi\n' +
            'YPBNTFbwD1aIUIACkBgDJxAbAfEtIAbyGXkYiAKOISFBEBZYxwEg9kFTwgQVF2BgkErOz9VLLCjI\n' +
            'SdXLSSwuKS1OTUlJLElVDgiGqr0AxDYMDKIIdYWliUWJeSWZeakMB22uRoIU3drDLAOiC/UNDCyM\n' +
            'rU0tk9NMkoyTrYMT0xKLMq0NnAwNzS0tLXUdzVwddU1cTQ11HY2dzXQNDSxdXZycTUwNnYwZAFBL\n' +
            'BwhXW2vCsAAAAAwBAABQSwMEFAAIAAgACVQpSgAAAAAAAAAAAAAAABAAEABDb3Vyc2VzMS9BREhF\n' +
            'MzI4VVgMAJVl4lkx13NY9QEUAO3XXW+bMBQG4L8S+Roh24TPu6rbtItJq9RJ0zRNlRNOgjtqJmPI\n' +
            'uqr/fQcSFkhIQlCWq14ljs3hgB+9kBeiIS9SQ6LvL8RI0A8gl4l5fljIEkjkWusflVRgnknELfJF\n' +
            'mhRniFS5mYi4SCcQF3NikXuYG5kpnPIcgeN3YIRMcUg2RXIoQWFps8rqSp9NAppE1CKfshWJPK9Z\n' +
            'J39XDWQFTjKLyBg/QhbQznTd5rbBP6CzulTnTLh0u8QkUlfX0CxayMVmeKezBeR5hucjkC5AG2vy\n' +
            'JDQo7PymiKXZHrRsHbaukjVFv0qTxBpWddPfQFTVOGVec/lmVfVUL703cQwlXrLNAou8VzpLU8DL\n' +
            'dPx2b5s9aM603his7rRvxHbeYL/V4COuI1GI327xFubVXjk8qDcoz9cbtMLRnchzPCMW+1BvE66/\n' +
            'KZck8kO7+vFWPP0qcAEpZvXmFrNH3F8cizgB8mpdTktWghZp+h/EsKuIeUNyFpJ/nTVK6MUyxdkT\n' +
            '4rIeIXQtxPEo680UeloIPy6Ed4XME6GsySMoJTFcRnqhbS/TI14YtZ2wA2baA4btgAm7XnivlyAY\n' +
            '5oXveQnskF3Vy9BUOd9Mb6pc3MybkrOU+FcMFXrYhxe4jtvng3V8sD4f5z11BmcKO6Kl8wxyj2lx\n' +
            'bd7B4vVg2XsGTbtaWL8Wb5gW1mhhWy00HJkp0x0uVcgM8jI76YXuB0pw+DWlAuONDBR6FphSqNWz\n' +
            'ymeglwlYE53hN3OJd5djbnw7DE+62Q0Zr8vmwKvLQDbubsgEvl1t/xg2nI1jM/5Z1Bc1LTn+VaJm\n' +
            'ZLjwweHCbd9pK/H5ACWcDkmXgUyqfxLddAm4HfCTTH5YRAv1k0RT5rz+BVBLBwjxZ2PYiwIAAEwP\n' +
            'AABQSwMEFAAIAAgACVQpSgAAAAAAAAAAAAAAABsAEABfX01BQ09TWC9Db3Vyc2VzMS8uX0FESEUz\n' +
            'MjhVWAwAlWXiWTHXc1j1ARQAY2AVY2dgYmDwTUxW8A9WiFCAApAYAycQGwHxIiAG8a8wEAUcQ0KC\n' +
            'oEyQjhlAbIOmhBEhLpqcn6uXWFCQk6pXWJpYlJhXkpmXylCob2BgYWxtapmcZpJknGwdnJiWWJRp\n' +
            'beBkaGhuaWmp62jm6qhr4mpqqOto7Gyma2hg6eri5GxiauhkzAAAUEsHCP+x5FWHAAAA1AAAAFBL\n' +
            'AwQUAAgACAALVClKAAAAAAAAAAAAAAAAEQAQAENvdXJzZXMxL0FOQVQ0NDhKVVgMAJVl4lk113NY\n' +
            '9QEUAKtWKkotLs0pUbKKjtVRKkrMy1ayMqgFAFBLBwhKgJGaGAAAABYAAABQSwMEFAAIAAgAC1Qp\n' +
            'SgAAAAAAAAAAAAAAABwAEABfX01BQ09TWC9Db3Vyc2VzMS8uX0FOQVQ0NDhKVVgMAJVl4lk113NY\n' +
            '9QEUAGNgFWNnYGJg8E1MVvAPVohQgAKQGAMnEBsB8SIgBvGvMBAFHENCgqBMkI4ZQGyDpoQRIS6a\n' +
            'nJ+rl1hQkJOqV1iaWJSYV5KZl8pQqG9gYGFsbWqZnGaSZJxsHZyYlliUaW3gZGhobmlpqeto5uqo\n' +
            'a+JqaqjraOxspmtoYOnq4uRsYmroZMwAAFBLBwj/seRVhwAAANQAAABQSwMEFAAIAAgABlQpSgAA\n' +
            'AAAAAAAAAAAAABEAEABDb3Vyc2VzMS9BQU5CNTQ5QVVYDACUZeJZK9dzWPUBFACrVipKLS7NKVGy\n' +
            'io7VUSpKzMtWsjKoBQBQSwcISoCRmhgAAAAWAAAAUEsDBBQACAAIAAZUKUoAAAAAAAAAAAAAAAAc\n' +
            'ABAAX19NQUNPU1gvQ291cnNlczEvLl9BQU5CNTQ5QVVYDACUZeJZK9dzWPUBFABjYBVjZ2BiYPBN\n' +
            'TFbwD1aIUIACkBgDJxAbAfEiIAbxrzAQBRxDQoKgTJCOGUBsg6aEESEumpyfq5dYUJCTqldYmliU\n' +
            'mFeSmZfKUKhvYGBhbG1qmZxmkmScbB2cmJZYlGlt4GRoaG5paanraObqqGviamqo62jsbKZraGDp\n' +
            '6uLkbGJq6GTMAABQSwcI/7HkVYcAAADUAAAAUEsDBBQACAAIAApUKUoAAAAAAAAAAAAAAAARABAA\n' +
            'Q291cnNlczEvQUZTVDM1MkFVWAwAlWXiWTPXc1j1ARQAq1YqSi0uzSlRsoqO1VEqSszLVrIyqAUA\n' +
            'UEsHCEqAkZoYAAAAFgAAAFBLAwQUAAgACAAKVClKAAAAAAAAAAAAAAAAHAAQAF9fTUFDT1NYL0Nv\n' +
            'dXJzZXMxLy5fQUZTVDM1MkFVWAwAlWXiWTPXc1j1ARQAY2AVY2dgYmDwTUxW8A9WiFCAApAYAycQ\n' +
            'GwHxLSAG8hl5GIgCjiEhQRAWWMcBIPZBU8IEFRdgYJBKzs/VSywoyEnVy0ksLiktTk1JSSxJVQ4I\n' +
            'hqq9AMQ2DAyiCHWFpYlFiXklmXmpDHP9b0SCFMX8/qwOogv1DQwsjK1NLZPTTJKMk62DE9MSizKt\n' +
            'DZwMDc0tLS11Hc1cHXVNXE0NdR2Nnc10DQ0sXV2cnE1MDZ2MGQBQSwcIxaCasrAAAAAMAQAAUEsD\n' +
            'BBQACAAIAAhUKUoAAAAAAAAAAAAAAAAQABAAQ291cnNlczEvQURIRTMyN1VYDACVZeJZMNdzWPUB\n' +
            'FADtnV1v47gVhv/KwNcGwUNSJJW7RbuLXhToAlugKIpi4YmViXY88dR2km4X+98r2bElkSfUIUU5\n' +
            'wWIuHduxHT85H+95efTbYlftHzeHxc2/flsc6mr3c1V/uj/8+vNd/VQtbszy9MOH+qE6/Lq40cvF\n' +
            '3+vDprlncahWt/cfVuv2ycvFT9Xtod4+ND/XctXc/nN1WNWb5ubi5Tfsq6fqofm9h+ft4gaWi78d\n' +
            '7qvd4oYvF3/dPjcvpM6Pq//bvvr28XRnvV7cWG3E4N7jWzzeffzh/6rdtrt1fqHmoccXOv7wcF/v\n' +
            '2vd/ftBdffdy88fd9q7a77e703v97nFd9371p94jT0/cnn/PP+rD/XpXPR9v/LNatb9AcG7PH/jw\n' +
            '3L6N470/Hdbr6mlxUzDefJDvH3bbzaZqPpgQ/bfz8ic/v9Lpe+i+guNH7+4+VA/HG39pHra4KZs/\n' +
            '35+av9m+/WakMMdvZL8/fSPPza0fV/v96QV/OH4vzTO/e/rU/G0Lptvnrr58fWwesHj8eNs+9/Hj\n' +
            'L80X2txere+rxe9LjI3CYUNR2LgdZYN7bFgIsiET2eDvig3FQPfZAElgQ5HYKEhstC/osGEYFGls\n' +
            'gHDgAD5Ox/ap2q02m/zRQ/0hoodiBvqEyIJACEBGRNpXdBDRTCQSwh1CTJ7U0oUPeIFDawQOOMEB\n' +
            'RhRFIh0iio79l8fNutrtlx/Wq+bzp7ECPVaAB1jRzJpBpqGwIkmoGFqm8aOJZjoxmmgHFVIVEpNp\n' +
            'LqiYMCr6D4mKhuiipCChommocKwoSYwqLiptVsuVdzpeRCi0iI4Xk8iLiuIlkRARQUjZJ0QZAiE2\n' +
            'YzBRWDCBRESUQ4idq6XhCBvqhY0SDMqGHLABCWzAkI2vq83qtt42seR21Xx/9cMqQAsEaOmXKaAD\n' +
            'tIBlYAd1ikZwEQ4ueogLTAkoUp1xgRdcTHGsnXLknragGufl4ygvgsQLdLxYjBcY56WI4oWce/Kw\n' +
            'Ylj7vz3CykjX8wortNAihcdKyazNVNNCmS/7SBIwRQdMiQGjBsAIDJgyDIwgJx8RQEREIGIH9cml\n' +
            'mwuFE+BDRsQURtosf2JEnBkxzCSqJtZBhFDLlvI/CeGkwFSTl9pEmKKYSTZJjSfUFhlkCBZw4okA\n' +
            'QjwRQ1ZeKVVsgJV9V8yCV6pI1taBOXIPIZqUcp+isGGhhHespAoocRLb82rzudotP/zSInKfo6oN\n' +
            'saKYGKKCxRUXlelibA8VX4zVrCgTU49b1rbKXa7UEx9cUjWVuOAyNyL2+J/ba3woKkqZMZogjU/B\n' +
            'IFFxcyXZTLMc5cMRiCZSc45GEzEOx0jnIyZ0PuTso0LZhzulCqmaJZYqRIXWiynGMpXY+rgDHpJC\n' +
            'm9L5jAGDRhM1DsyI7CbmLlWCsAjWxuzINtmFZZLw1vXJvOt9VGKt4sJCklXGNVoEloCc38KCarSE\n' +
            '6DLSJ8+u0YZgKVk5igo4qNAUFWJY8avaptJOVPNdTwGhUNFynZCHJKbm98IKqsAlhBUYknIVBS4Y\n' +
            'WqSrwGGzZJcXR9J/JQ2F6haMl4uqkl7alg4vQAotVURoOcv5js3EAwaV4LK3Qbvq05d6+eHz6mu9\n' +
            'mTuwFEza6JkyrV8m5iA/sthjY5ZU4briiiJ4UsiuA+XxggaYXipCFTgg5KKL+eOVEFOQ+6BQQBHk\n' +
            'gAJMDBohMFgGUg4n0hkoF1NCCrThYxhTLGcmcQiU5F2KMR+cc5AOlLZKK0idEMZNlG939f6urjbr\n' +
            '5YdqVz/kcKqUAV4M0zpahXP65kkTIESFU8dyOwcrBBWOUtnSBoY9VAjZB9Xz41xMdFRC8r6koiKM\n' +
            '64mkyHA0pwoxsJSeul8ySJXhuANLTv9BNDFo/iEQ42afMDFzIwIlMzZahgNBiic0RhR3GWn6H53Y\n' +
            'KXveSFIDlJR8MFvkS32ihaHwkSH5ZJH1OVWzLY59Rq+ipdiZiLKKpJW0HEk+iRWtx0omDc5npbCv\n' +
            'x5KGFcExViA3K/lllRArQ1CwxOM2yc7855UmmWbG97VaK7NptZnkN990gBa0XUy5lHqxnMTlnOuO\n' +
            'lUtmVXSX7NSzEkeF2CX7c6B0/e3SXGYW4OJs+S0rqad63iD/kGOKYmrAiigJrNDGyrT004og3syQ\n' +
            'J/Y+ys0/IuNYGZkcYklIdMCgnhWCnjJiaaIXtCFEyGNlw4wYHvXhCCNu6iGqKbSAAog/XybPflzv\n' +
            'AaFIoXia/CIldBJMa1DXOQqWP/lAMKDYIS2U5EM7GBayv3UmBPBP/VhWJBa0CajE2/OpuFzH1vQN\n' +
            'kCmAZGqOaXbrc6qxhZjJbi0nDAcdNQVeU1OgCKspxbjvYASXV4rZklag+IKbYEVqMQsOL/P58yEw\n' +
            'Tm6JuY6akt+gH6RFsjLeoO+MkgfSG8S2Pp5BvylUZGJw8Q5zZNLyEektMEpuYJH8KrDkHiWHUDHO\n' +
            'OcI3PMpxSUMlE4lHOTxS+FxNspZhUlBBhTJDfuOaNswKxEcVkCRYiI4mz/vWhJUyUXxzHU20sDLu\n' +
            'UEHCSkilbWBBFRWC+hYHS4awEoHKcD5IQoWmp9DKFWTpQVNCZZJpSR7suxQ5P2DQb0FBO2U7DspI\n' +
            '/pnifcuShQCYHVX1R+oVXNUHzhMdTSYxB0nX+WYISYjaLRcx55VbYtBm2TEzoR2RZ2ZymFHkdlkO\n' +
            'CRk0QEVESQvl0J1Cshw4B9ptHxKIhQTKi/4mz1FFsDLRzeRykulIOxJVAunHFDp5oPwGtQpQ5RXD\n' +
            '1LhBxRVrcy5mQlepQKJU65UqpLo2pQMqAu1ywwo+UH6fda2ksmLdFU2Y8W3EqD+NFYN4D4rEA2Nu\n' +
            'WCFYmSgtEFLVBo50tKigLVD2Zjn/nDCESjGsU0i2NxopItkimei6dotaQZDg0kV9NK70YEFboOmn\n' +
            'C3kWUb+IyDoDPgw2RvZOh+UMJQbz0CbaIt2sIwiRBFJ2vZlQgWKtTh0QzuWhpbbI3ARYkUwP1BTA\n' +
            'so4bSzgJFaBVsxxZHZkq6KcMgCDF8SYx4Q06VnJtjYRMrIQEfaCy0vTHMCxROAGWefwpPUFfZzrH\n' +
            'QapmxwMLbddOjxX0hPL0aeEsrJDjChgWvyGDtPfN0mzXXefTP0aYafHObI0PhkovBRF2SL4bVEQE\n' +
            'KsMmOWXzwSusEKfKPitlsu1NzmhTkV7RggEjOmDQI2LD2IKf+xk5p0yvaGUAEUlGRB33v3aMlKTd\n' +
            'TLRNo7TUY5UnunFmU1eNus6DTLnHDyjBorZU+jqqW/5jHCJAi2BmmHtSzvxMSz7YhDB1i6SbfEgD\n' +
            'wvGiNq5OKZVBRTdC8plJdAvlHklFpck9elR0c1GhhRXiVRWMV9ECs4mtsrfHK1Od4putQ3VKgwrh\n' +
            'IAeKylvbmUZQGbrzSazQuh9iVPG7H2A61w590jg5RaEtAiaVFpbUkxwjo0GYIQUJKiyuBJdy6ucV\n' +
            'VogSbYlkIJtofbuoHXOc5DCxeQjV4Qg1rYniJUBI6GRyQQ4n0hFTgLQ83z3JMSmgALfe2eRT8XSt\n' +
            'iJJxPe1LRLEF16j/mhBReBQh+ceDIV5K5+DPxWQ+3akfMtP2Vo76o2R1vFJIDlGfdOonZTttEfDS\n' +
            'tqjga3bGUYnbpJ9/PBhCxTrbAUmo0AoVTkPFnyRLxlNXHni2g4xrMaJjC94FTQeGvhk9hIiiI2IH\n' +
            'ekpB0twgYzhp93b6Jtp3tRcdUVPKABzWlte5HNSVNzIpVg7tBpQ6Zfo0eaZl1wmspPsNxni5zjWh\n' +
            'vgEyBRBCq5NWxYY2HJQgFKrdT69iU0UUcmkSuhzU6Yqhb4mK70wpjpu3r4RKemEyhst1Fox+A+Qd\n' +
            'LDfwD4IJrM2BMxylQP0oBGPbTIJs6DRyeP8sDATZ4WlkgV1bLs1dHXsVjstpZMtEIiuuxpapJUY6\n' +
            'nFAcKQXBjoLKazoKFXJHTL4QVGgJrZDutX0om3WmX9M0iIo+Wu+yGPEzrir2x4IYL73QgtawcpwX\n' +
            'G8VLgBAVCCaSGkwEZ6oc7YhHVrpNIkRdZsaqu1KYGp/u/Hu52K0ePrerNMTv/wdQSwcItSqVVcEL\n' +
            'AACTfwAAUEsDBBQACAAIAAhUKUoAAAAAAAAAAAAAAAAbABAAX19NQUNPU1gvQ291cnNlczEvLl9B\n' +
            'REhFMzI3VVgMAJVl4lkw13NY9QEUAGNgFWNnYGJg8E1MVvAPVohQgAKQGAMnEBsB8SIgBvGvMBAF\n' +
            'HENCgqBMkI4ZQGyDpoQRIS6anJ+rl1hQkJOqV1iaWJSYV5KZl8pQqG9gYGFsbWqZnGaSZJxsHZyY\n' +
            'lliUaW3gZGhobmlpqeto5uqoa+JqaqjraOxspmtoYOnq4uRsYmroZMwAAFBLBwj/seRVhwAAANQA\n' +
            'AABQSwMEFAAIAAgABFQpSgAAAAAAAAAAAAAAABAAEABDb3Vyc2VzMS9BQU5CNTAwVVgMAJRl4lko\n' +
            '13NY9QEUAKtWKkotLs0pUbKKjtVRKkrMy1ayMqgFAFBLBwhKgJGaGAAAABYAAABQSwMEFAAIAAgA\n' +
            'BFQpSgAAAAAAAAAAAAAAABsAEABfX01BQ09TWC9Db3Vyc2VzMS8uX0FBTkI1MDBVWAwAlGXiWSjX\n' +
            'c1j1ARQAY2AVY2dgYmDwTUxW8A9WiFCAApAYAycQGwHxLSAG8hl5GIgCjiEhQRAWWMcBIPZBU8IE\n' +
            'FRdgYJBKzs/VSywoyEnVy0ksLiktTk1JSSxJVQ4Ihqq9AMQ2DAyiCHWFpYlFiXklmXmpDAKLLkWC\n' +
            'FG1WeMEGogv1DQwsjK1NLZPTTJKMk62DE9MSizKtDZwMDc0tLS11Hc1cHXVNXE0NdR2Nnc10DQ0s\n' +
            'XV2cnE1MDZ2MGQBQSwcIymhIvLAAAAAMAQAAUEsDBBQACAAIAAtUKUoAAAAAAAAAAAAAAAARABAA\n' +
            'Q291cnNlczEvQU5BVDQ0OExVWAwAlWXiWTXXc1j1ARQAq1YqSi0uzSlRsoqO1VEqSszLVrIyqAUA\n' +
            'UEsHCEqAkZoYAAAAFgAAAFBLAwQUAAgACAALVClKAAAAAAAAAAAAAAAAHAAQAF9fTUFDT1NYL0Nv\n' +
            'dXJzZXMxLy5fQU5BVDQ0OExVWAwAlWXiWTXXc1j1ARQAY2AVY2dgYmDwTUxW8A9WiFCAApAYAycQ\n' +
            'GwHxLSAG8hl5GIgCjiEhQRAWWMcBIPZBU8IEFRdgYJBKzs/VSywoyEnVy0ksLiktTk1JSSxJVQ4I\n' +
            'hqq9AMQ2DAyiCHWFpYlFiXklmXmpDBYBNyJBiqYd3KwDogv1DQwsjK1NLZPTTJKMk62DE9MSizKt\n' +
            'DZwMDc0tLS11Hc1cHXVNXE0NdR2Nnc10DQ0sXV2cnE1MDZ2MGQBQSwcIWSRU+7AAAAAMAQAAUEsD\n' +
            'BBQACAAIAAlUKUoAAAAAAAAAAAAAAAAQABAAQ291cnNlczEvQURIRTMyOVVYDACVZeJZMddzWPUB\n' +
            'FADtnU1v48gRhv+KobPR6e9uOqfFJkEOAbLABgiCIFhwLHqsGVmaSPI4s4v97yFpySS7y81iqSn7\n' +
            'MLfRSJb18bjqrbeqi78tdtX+cX1Y3Pz7t8VhVe1+qVYf7w/ffrlbfa0WN+r6+T83q011+La4kdeL\n' +
            'f6wO6/qexbL6evX0eX//5Q/76mFxvfi5uj2stpv6Hi5lfftP1aFcreubi+Nz7Kuv1aZ+5sPTdnHD\n' +
            'rxd/P9xXu/Zff9s+LW6cPT1u9b/m928fn+9cLRc33jozuLd9ke3d7X/+Wu223a3TL6of2r7i9j8P\n' +
            '96td8w5OD7pb3R1v/rTb3lX7/Xb3/Fp/eFyuek/9sffI5x/cnp7nn6vD/XJXPbU3/lWVzRNIzv3p\n' +
            'DR+empfR3vvzYVl/Xosby4r6bf55s9uu11X9xlz/1Rw/89Mvev4iem+reefdzUO1aW/8tX7Y4qao\n' +
            'P58f649s33w1ShbtF7LfP38hT/Wtn8r9vv19f2m/lfoHf/j6sf5kDfP1K/qxfPjyWN+/ePxw2/zo\n' +
            '44dP9ddZ3y6X99Xi92sMGw7DhlXlKBsiYoMn0bAQGmKAhpgVDZFAQ2HRkJwJ12dDKgQcJiMcojjR\n' +
            'IU50cKYMjQ5Lo+OWEDnSdLjxwPF2dKADR02HFAM6BIIOPaRDwHRYFB2SR3QI5gSNDiEDPITF8LH9\n' +
            'Wu3K9Tp7BPHjEURCjNhcjMgcEUR4Zk2fEYNhpMjIiLYnRmSPEWIEcSEiIleCkS94yCMe1gB8iGc+\n' +
            'hJMGBCS7+tg/PK6X1W5/fbUs60/gfC0ieAIXx5QaRBSMGJFDWl7JNxoXUUykRizjmkZLEdAyQ74R\n' +
            'J1ggpdqDpSDCIi4Pi8DCUsvEgThRHAGLwElXZP7xgHZVBTH/hPJE+Jz5pwswKhVg5AszlhOZUZOY\n' +
            'mZsSy4weJCBMSBG4mIKjxCiAEkeDJNQoCpmAPhA0rIf4OAoUUQgviXzwSXx8WO3vHzfL8lu5rsNK\n' +
            'td2Uu/q956DGJqhRjA+krdIIanChxaGgURE0hWqTI4UaHUYWnSsTxarWJDyThhpFpEZPoiZ/JkrR\n' +
            'UjA+ELlKArSIgBZcmexxiagAZIskypYwD2kzbx00Roy+CDFERiSWEce07DPyotguxYiVUUThjMs8\n' +
            'RluBQaRQ/x3FQ8V4OACPo7SVzhiE1ZYhDWUJKP2yWahU2VyXqANTVkL5Rwa04ESLStCy7yKKiCLK\n' +
            'GdZKmH9wtOwJouXFX+jTojtaQOtNjdNi0rSIIS1fynV5u9rWtNyW9Ve42pQ5UlCSGB7oXInJQTgz\n' +
            'jkqMk0wSi6FIsfCcOQgIMhA2psMGNFt0bmyIkGg0JLIN+B0kGkpCKoDEZoRER0nIESshHxCCEikY\n' +
            'J85FcEjIqT1mIGW5AAshREyZSdKmzP1BPNEhKqKHimKDBKTM9HDySgLCdX66Aujk7TtPlrQvrs9L\n' +
            'PEF1jTF1M6BnJYAL73ABK6DzBYuYsW7mSWwGlZAeYoNpGCoUNri6GbDkLLOZDNzmq5urY+ihINOj\n' +
            'hloFvRe3JUWNZtaP1s8hNVnr53gIoWBEsyUsjZBey3KCg5tULb3EBA6oZBe7+VtEKVZqoWvHM1NY\n' +
            'GhUoWCQuM/FYwzCqjBFRbYRSulZVhBhjfTrGUEvpaS3Ft4kxlkk3OcbgMhNO0AAxxjJDrY9CbDQq\n' +
            'zKBNupgdUATLjh2wsPbj7Lz8AbwCj8w+8pTWvTxwXoSFGkZhjSRx0heXjYQ20VyLYoooYsJSGtVV\n' +
            'pM3EuYSG0VYHCL1rq66fj3iRjCs+4AURV3KOLAgLxBWdq1BC1kmUTlEqGzW0CIgWhHp5Y2M3SYtr\n' +
            'PdSJA5U5y+puZI53oUUTx6HEvDZdLHjHkAGdGIRNNw2Z+SEZOLmqQDBiMzKi4oiiWTOQ+K58Oh2X\n' +
            'QxAdx3LISifBElqO0zFtpDJLQEFbur794+3Bkq+tiEs/KnJ0PSenn3C8JZtLF4cSSKqojhWwdDYD\n' +
            'VsAR7RFPV53RJ0L7uskWwMBokR5BixjSImFaUv4/NF95UrbWsUzj/NnMuWlGS0MLtXAeiSzvoavo\n' +
            'h3oFk4sCvaJgYJB+blQ1O0eumonEjFtzJlYqaWDAalmOh5dps5VZWkYSDYthupjcM/Ko6IJ05kTU\n' +
            'MzKsIA4tyDAZ4dx/tMUSN6GhlGQ7ZuATIXwADXgkRBRpanSWMyEezYlmYsCJANNQaLGIgBR3TlgR\n' +
            'woTHQmpUbDYTF4UKZh4qNuIcNA91rIGsbb2jGJMhJbAR97YmixDJBpEc6haMyRLolldUbmqGuzfc\n' +
            'EpdE1DF/GivYsDKdF1C7ZOflOyHkijmbYRvrWgmN+J+qIG8U4hDiJWMJugIyKYe/Tj9ytGQOUQlK\n' +
            '5ldkCu5ASNdAfJEpBfNUxzYsmZEGC+VEiCsSoaTG5TKnzOabbImwGQaYYvLRRI4JMIJzYilUWCaI\n' +
            '6jacUhCoCW7aaIuFqucOG82J2ExzbbNiI7HYeCb0qOMSYhO0nV+ZuESOtkR5qZDtqDCFGhNQg4Rm\n' +
            'vIAGoIGqoR40YHco+6xCfpmbhmXYS0RlJlwBjbTn4hkFxTTR+Y+aQ6h9CpjJFmDmUqVpARtDCFpG\n' +
            '/JbAoCtXn8pfV9dX24f6tWWw5lKsFMwMWcHkI9xiBeQJxVjwGsaJQ3OhMyeR51rvKCpmJB1R53Pf\n' +
            'UMWgqbHMqcnnWnH954J6rpUzTzyFJsN9HEXWI/OxQzdSL2mww4joP/tJYYZYIRl0hcSDpS2iwKgW\n' +
            'GUQXC3KCVbvCxaufHPkEWlhTI1PReE0dhxcNWf/H8OKMldTwMk3tUmtq8WpYSbkvDTGDmlpC1v9I\n' +
            'TU2wX5KroDQzRD83zEZIB4Z0XF6/HlEaWmYa+599hHuEFqEmdxV9TlpinSvJEy4XHPhP7YRqaAG9\n' +
            'f8SEy8jAP79EHzpFjGdSTnZ3HQoYnGxp/g6jKRfqOg4Rypa8m35i2QKmJN1hA7YAsp8TISYhiYWk\n' +
            'YIMBf88RjAxHks+ExEXt5zqq6EvOKtDW3NqEreu8t5fpAsRR5Y/1HZ+vrw7324dyf/Vpu6TGmX5m\n' +
            '4i5ZHvmgM41gCNdFQu47jafpDDPExBQeX5xR9CbMuoYgRGMAHHeZpnmfVuv9dnN99VDuvmUYdkmS\n' +
            '0iw/HRq7AoEK7jwRbthFeCDaULtIxPqI0g1I9aNrVoIzJHPttUSykooqaFY043by0D+uOMKhAixz\n' +
            'se0MDsl0iVpHWfdDTY0tgZuHX7WdbU1hKp5oLCOirj8GqcdgJC7uWCsu9ZhYvWjmqRKX0wLKlCEG\n' +
            'kdp9ejyZ6ArtwBIaoW7foFM0KIhkuq2oRkctaRU0dT9hU0ET1/aHk5bICnp8hCEuhQTkt4gOFmoF\n' +
            'PaJU5BkVdCq+cCwwwgWXeQAdunDmMjXJLaaePNPR1Atve1g5pl6y6RVg9j+Vf2piZjo0fw4xqRCj\n' +
            '0cQYNm7phnsWeAIYPrEZ3V374RRinGqTZA6TDgnMuEkXW7oQL710RL34wxuM/uOji22nBCZuVxC4\n' +
            'xiJydCFqFzVDdVT5EvWjUSfRsBrXRxoGYsZ0zIAOjB1nxqWZyTP4byZElOHxMyGgoQUTYDK0J4O+\n' +
            'opg6+M/jwX/yCbRwHAoVVGhT/0IAhByzkDccroKyV83znFcc0S3DXjTKZ0mdhhaoA657IA291EWC\n' +
            '+UwXEEEpXdom1OTFy2piqOvb3+CciMTSolkxvF4VJg2dv16hBwuwjCPX5Yj4vDbLWIShLm6/iM+i\n' +
            '0PFEtVMBvRWoGDMuedUQXCHUMaKg7T6WqGtpKwppOSjVJ/LeF6CyfZ/rfSR2F4dpQ/0s54pSgqV3\n' +
            'rijuPBdMZeoIzX32bIwYamdxGjHfGZm9FTQtoJyqntS+sEJIDbYN3+eM/0DQpq9HpMVkPYvbF4aD\n' +
            'JbZVmmuFEFUKCZbp8QQJTGDVzQXMd0SmIMIDRFCzTrRLhYBzTuKERwFv3Tgfj3PWtKQmn9JLK/ui\n' +
            'VrcblybWPTlPPwsXu295jFqU8YapkHEroGRHCyhOhn1DcN1GSItIBhN09lGJ0KKxpEgdDmoTziMS\n' +
            'drRAsUV1G6AKop0SjSJkrZHjrT4QMaojBtQrepyYcGmYSMaXBCM6EU0cmhERXPXbcAQjGsUILpp0\n' +
            'R8t0dymZYtzL/8/1YlduPjfNAPv7/wFQSwcIbGUwwxsMAABHgAAAUEsDBBQACAAIAAlUKUoAAAAA\n' +
            'AAAAAAAAAAAbABAAX19NQUNPU1gvQ291cnNlczEvLl9BREhFMzI5VVgMAJVl4lkx13NY9QEUAGNg\n' +
            'FWNnYGJg8E1MVvAPVohQgAKQGAMnEBsB8SIgBvGvMBAFHENCgqBMkI4ZQGyDpoQRIS6anJ+rl1hQ\n' +
            'kJOqV1iaWJSYV5KZl8pQqG9gYGFsbWqZnGaSZJxsHZyYlliUaW3gZGhobmlpqeto5uqoa+Jqaqjr\n' +
            'aOxspmtoYOnq4uRsYmroZMwAAFBLBwj/seRVhwAAANQAAABQSwMEFAAIAAgACVQpSgAAAAAAAAAA\n' +
            'AAAAABAAEABDb3Vyc2VzMS9BREhFMzMwVVgMAJVl4lky13NY9QEUAO2dW2/jxhXHv4rBZ2Ew94v7\n' +
            'FKQt8lCgAVIgKIoikC16rawjtbrY3QT57iVpyyJnxsMzR0NLu9lHWrIu5s//cz/zW7Wpt/uHXXX9\n' +
            'r9+q3bLe/FQvP9zvPv10t3ysq2sxe/7harmqd5+qazqr/rHcPTSPVLfrX67mi+ZXr+rF/raaVT/U\n' +
            't7vletU8pMW8uf5zvZsvH5rL6uVFtvVjvWpeeve0rq7ZrPr77r7edK/5t/VTdW344XnL/7UfYL1/\n' +
            'fnC5qK6tNm7waPcpu4e7H/5ab9bHq8MbNU89/nB3v9y8fIXu+m5593L5/WZ9V2+3683zZ/1mv1j2\n' +
            'XvpD75nPv7g+vM6Py939YlM/dRf/rOftC3BK7eEL757aj9E9+sNusagfq2tJbPM1/7LarB8e6uaL\n' +
            'uf6nefmjH97o+U5U16r/zXtfqF51F981T2v+QnZWfdv8ybbtvRGCdjdku32+IU/N1ffz7bZ7v792\n' +
            'd6X5xW8ePzS/19zib+e//GffPFjtb7obub/5ubmXzfV8cV9Xv89iZEiPDAYk43aUDBqQoUyKDEuR\n' +
            'ZPCLIsMQ3QeDqQgZzCPDQMhwFERG+4YeGoxIHBwGBcf6sd7MHx4Q0jECCPsiANFEiz4hXAIIYbwg\n' +
            'Iu07eohwHCCM+oSIYpYl1A8dw4M948EM11E++DgfLIuPm+X2fr9azD/NH2ZXi3q9mm+aL1+AGkYT\n' +
            '1FjC5IAaC7A4DAQNzOK0b+hBYwuZHFPM5oSS8kpoRFJaZjhSU/LckWxmRAlmeAMNG0ATM0Y+NDQB\n' +
            'jThAwyhQaviBGvHqqBCmkWrjkyNgfizeIEXp6SmOeBfFmZwTStjAm1XiRHHJ5kTRgBNFDNIqaV9g\n' +
            '5IThjlIJRByzCikwalqBARslnQCHMWIHVknwCDi+L+O5MrwPTq5VEjywSopIhuPGj5LbfwoQNzeY\n' +
            'YChlmBpuNFJaRJobNiE3LIMbMRAcwQCCY4fcsCg3UMERNIygiTVIw+SBw6HgYDwaExOcHjgGKThn\n' +
            '9ILB4GjCsrERQ2ziTjDYnwm8YMcId4WiJ2mL+jMcJjo9Y2WRouOyRAdJCQfLCyVtJqGXnQOF2B4o\n' +
            '4iRQXKgvGu3QMF9gGMzxdeK/hcNsbpSKZnDZOCR5aZiiAjNARySzd63D1lMYWkphnEtws02F2Zqo\n' +
            'Qn4wLDnjxBZhlrSNUENfqdEUSc3EgXaKGgmnxouzIeUAWZKaMOlricKG2X7al8O4wYfZI4qDTuy9\n' +
            'S+JXwylRA0oUhBJYaQBGSRvWe5QYIpE+r/MggbkukBg74raIt/kQmjKs23IpsZJMOzN8GGNDkjOg\n' +
            'WmMSm16oxCKhkkYmf/0YWxULsQUMG37EJurIyHFs7PmwoVBsHKEDF1hAUr8wsdEwagKxMbZzrkqU\n' +
            'DKasGPCYMTpSw6OOjBinRqapOdWRYWixYT2xEYQPI+xY5DSSmHkDGwULsF87G9hBbCi2fK08ahjU\n' +
            'Ri0QUZPQEWzoEZuoD4OImtj7YQMWG8Y6ezCSB8Y5wMA8MA2wMWgbFXADi7a1qEe5kaHcpNUmWp8c\n' +
            'YsNi2Ezs2uDVpo+NJZxnGykPm3gaONu1OWBjHDbaDpploK7NHYIaHXNtemoTLUwCksBnzNGAsXFE\n' +
            '5IsNA1GTKza9OIoh4yjhe8S6cLQNkxxzZEdGJQegOXzEVokiZW0JdmY4McNOKwqpF3A3ROWN+iRM\n' +
            'YJiVQWGbE4ssUFpfYsoVtkOHxmu3G0iM1BItMWdM6PUdGuoSEqMIH0RP/NSGiFyJ4UH05BiRSH+G\n' +
            'e9iUi54i1CS6v1tqouLyhVAjCR3oDQPJDYgaA1ObMFPTuDNIfyaoTvKy7b/5ioNtpcljZ3pKnMgO\n' +
            'sWElJqD7ErT/OorOzGBLk7hEcKr3QXPDscMlI9HSe6lLsnygiRDZbi8oDwzumQnlRROGHDzxwyVX\n' +
            'LBEM7NE7YvNa5P2MKtpgbBglUox2jnOPG11QbyIlbYHvmfHDJagLjEkF61hOjx+5web0zig3LKNa\n' +
            'ybPNFKyAAHNmomUng0wFBzMH0Dm38VSwCq0UTcsNIKcXxeaMLcFgbCxxbKJqJdC7CbFRhGJbIXwf\n' +
            'GGqlxjPBeY2dLTafe04vhY3qhkIy+65Klit5OFF7eXng0CHWsXCbHZmJhtund0Zcimej9HkTweH0\n' +
            'gSYGW3Xy0zSqbDcwi/TVxBRHHOmJBtxqnB420iFRJuIWcJskBtk8ZmOdV74LLECkQGMnZmOTKhTp\n' +
            'zvidnTCzBGkHjsTciVKT1kxi5w3ysjLTSQxL54HdIHYyEIWhQ3DesEsC1tlpIthgJQaHDX7cYAyd\n' +
            'aN9ecXS+QnLaFNyUnZ2pSMkqGTVAgErkxJESuGlGpbsfqMyOsL1yQSH35bVpRhKJnFEJsIFugkB1\n' +
            'diYaxltuosOTgAj7UjZBJLnhhNvRKTh/uqlk10wkoae69RRFmq3KbSACctPTm6gvc9kJPTA3jtjR\n' +
            'xMwINW8YKTQ1khhkJ0RADTQNPJ7PyzZSUS8GYKTO2BAMFxvTNauMGCkfm6L5vNBIcWKQ1QMfG6hr\n' +
            'M57O07nUREuVYpyaiaWmFDUi37XxqHmj7wpYPAioMZa4QsWDdgRguoxeYtap4cab4P78llwluaFE\n' +
            'DWvcGsANzCUGNgSHI3K26+pB9V0FcgOzUuCMngWJDj/CEy1YugE8IgqPyaInwQl4YVGSE0ncsD+P\n' +
            'xlK/wgfFI0WdQkq32SdYbeWQhSa0P4PqokmYJqM0x3rBlzLgn0rWGK+LBjSqDeu+Ag44hbka3Y1B\n' +
            'lEjogS0TprXTJNrzWmwAfnCBbN55EsESsxcC1tqJrU86ip45CJr2RFnDlC85UW/4Uib8weKivVYr\n' +
            '0IQ/LFiCUdLWQwP3hRfaagVNzIybpDAxk9oeYqz1dopP5vXud7t687S8/Ti72t7P96v5n37e38y3\n' +
            's6uP8/phXkBkqEnaJjuoZ0PogQ0dUNxScYMkhyLJGbdKYZidtEoNOdGumfLOzHnJUZ7wRLeO44QH\n' +
            'hk64ddyYbgNBkXV6RY2TyxafaBMNYOI/L1UzNSPaKxtE9477jMD6gGGMhGvHW0YKdUCAywaoxeMp\n' +
            'QJyMn2lx2Z7voDOPJ40S1cNQG4ANBWEDDbQjnm+pjWjQMBuz4dU70MKnBn3exaXESylqJBEuW2xK\n' +
            'DjmFA5TWobvH8UNO4x5NGCullo633GCnDibOAIMrBylumPSWpIEywC4BDsvNAKug3iSIxoIT5PWg\n' +
            'XRGYFTQ65Qo34GDPOriUMae0mTr3KpHYCkZs5UD4k/6TbwYeEx3sSQfFfGDwxpmkvFDPm2GgSInp\n' +
            'BCi5AsOOU9q9XUUCuz7EFxjYtAFuM7BN7LiyisYDpS/EoxHeQj0WG6PE+cGpkvaxyTPiB7OumPGO\n' +
            '2Jww2z+Czmcz2/8HgsTveygnLZHOvESwZK11E032v9euzuRGiNYquewYG9abJ2EN5DQ8EY7wQss6\n' +
            'y0pLLjqOYuPsPHS+QnISJDD/FnmgQWzM7aUrxjEe74q5bLdl4PGmzw3Ug7jodQ/p6VnfVL9DkhpF\n' +
            'Cp0cWDYoygfnfQ4P/IrICdPXU4ZD0eFresDDxdfKAGLmM+55GMzUppZwesccg/phvILjG+kW4Mhb\n' +
            'mG5B9lDhFhHlHZLCDsQksiwtMdjUrj4fMRlrW4fb8TAb6REZuiMykd5eQSTSfwkCaA3DRjFEci41\n' +
            'R9tic6GH2IJD6rTQDAdQOKQgMO3ZOo7iT/Ly1abwEbYiW3KiiV1AcwPLKychMUkv+x04MW7QoOkg\n' +
            'Toyf10Ws+j1yYkN5UWQck3/Pqs189bEd/Pj9/1BLBwh4skJ3FgsAAMaDAABQSwMEFAAIAAgACVQp\n' +
            'SgAAAAAAAAAAAAAAABsAEABfX01BQ09TWC9Db3Vyc2VzMS8uX0FESEUzMzBVWAwAlWXiWTLXc1j1\n' +
            'ARQAY2AVY2dgYmDwTUxW8A9WiFCAApAYAycQGwHxIiAG8a8wEAUcQ0KCoEyQjhlAbIOmhBEhLpqc\n' +
            'n6uXWFCQk6pXWJpYlJhXkpmXylCob2BgYWxtapmcZpJknGwdnJiWWJRpbeBkaGhuaWmp62jm6qhr\n' +
            '4mpqqOto7Gyma2hg6eri5GxiauhkzAAAUEsHCP+x5FWHAAAA1AAAAFBLAwQUAAgACAAPVClKAAAA\n' +
            'AAAAAAAAAAAAEAAQAENvdXJzZXMxL0FESEU0MTJVWAwAlWXiWT7Xc1j1ARQA7Zxdb+vGEYb/ygGv\n' +
            'BWK/d+m7IG2QiwIJkAJFURSBjk0fK1GlRJLtngb576VoW+Tujpazo6V6GvjO+rC++GDmnZl39rdq\n' +
            '1+4f14fq5h+/VYdVu/uxXX16OHz+8X711FY3fPFy52a1aQ+fqxu9qP66Oqy7R6rl3eP6Q3v3eFst\n' +
            'qh/a28Nqu+nuNXLZ3f5Te1iu1t3N6vX/9+1Tu+le9fC8rW7Yovru8NDu+r/+sn3uXpa9PW/17+N7\n' +
            'bx93/Xuv7qobZ5zwHu0/4PDR/tPuXl7Te6PuqcOdh4fV7vjp327fr+6PN7tX+H63vW/3++3u5bN+\n' +
            '9Xi3OgzP+/T2zNM/bt9e52+rw8Pdrn3ub/y9XR5fQDDm3r7w4fn4MfpHfzjc3bVP3dvpmrlF9efN\n' +
            'brtet903497nef3F3+57uQzD1+y/++grtZv+xrfd06qbRi2qr7sfbX+8MIqL/pLs9y+X5Lm79f1y\n' +
            'v395w2/6C9P98dXTp+7H5XX34369/Ncvj93j1ePH/mo+fvypu6D9NX5oq98XEBkqIENOk3FLIMNA\n' +
            'ZLATGRIig11MBrsuGa42jQcGR4AhfTA4DAbHgcEjMFStNI0MHZDhpsjYPrW75XpdPm6oP0bc4HWj\n' +
            'x3gIDB4KhQcubogYD1E3NDpEQIeYJ6M4fj5ucCsMiEbxwHG/XP+8+HC7Xt13BNwRQREjUDhLgKJr\n' +
            'KbLDiPY5OZNfNIqTJsLE1FLSOLEBJ7ZEfuERJ8KejyBHTjSREz4PJ5zMCfeECDdeQBEIUAQKFIfL\n' +
            'NydS+BspsmbEfNMEpDSl8k0+LeYqtBD5UGg++uA+4CElAg9bEA/hIjxUzSwNj7CEKZJwVIQGpETE\n' +
            'KxkNdw1Ehi9FOESGyyLjl+V6ebva7rtYsuyu3mqzJLLCx6yYlDgxtfWSjmgAWEQAi/FhOSNOJA4W\n' +
            'G8JiO34NDRYTwMKnYflIgEVrgBZ2oqVhxDii56MFrVBStLj6WJCMIgtUAfM0LAKGheFg0aFEsY5a\n' +
            'AYcKZbICxuYdlxlcGk4MLlxm8UKMJRIdS2Rt1RgPDcUSGeDBA2EiLwkmWkTBRNeKKGHDFslk5mnk\n' +
            'r5NwiLhFkih1hNUG7J6pawYTnhNMxnUxl8lgcgz9o8xDaKedyTypYLIHVOwpmNhauyvBgo0m+cCA\n' +
            'TbXiwLzjcUnbpEgj3sbCJIGGNEyA5bCcRmOiwOEzCRMPFpXusUk1KWNDZRL0Ts4oE5MpY0+0mFoQ\n' +
            'pUkoY1UJGStjWiRACx9oActhMU2L+sJpaYLQAhbIISyND8uZAhnXr5dRQ7aTsZZYIMt8WCiTHKHS\n' +
            'sFgIFkSzPgwt3IdFXACLJMMiBliEqJ3flsWEFly3DTn2OxU98pUW42pH7N9n6xQj7yZp0bjJjhho\n' +
            'ccTQMpGILqElFVp4RiJS3pD4FEQvb+Ijhz0SSESc2nwLh4F8Urigu7MxNGCIUQM0YBPOTUNj0yHG\n' +
            'oMvkVEBJIyK8MtkZ30dgAUbCOlkE2vYitXJ8mh9SujrZELVtmIDMPCNB0ErwmoCUUbBaQTTdWDqk\n' +
            'sBlGguPkw5pUOBF99yJzJsh8Us5UQZZqLTBka0FYBU1aC2hSxUJjHjaQAkoVBCkzDQWxiSdJiq6t\n' +
            '70FRCFBwKgU3POZR3nFNb5gq4UHhk6KWbkKZiiugVClOy9x8NLUXR06dgAw8Loojx9we4GFrVwiP\n' +
            'It2UuD420JjnlQwjrKTWx6EeoXdm6SI21XozgUCRmFiCq49xbXwpIlhYLQr52Yo4UYCuLBRG5AAL\n' +
            'mHTMNCx5M57rw8JZbbz6WGIqnsBucEbM4uwGEhoKamLFE9bHCDE7XR/HE2TQicIGWqj18YyhRfi0\n' +
            'cHxX3/emaJ5NC2eo4IJsvp2EijjhQqyOQ1h4Ma9sgyNGDcTADhWMTsljhkiIQBPCfKXCGYYQgXMZ\n' +
            'IO1tjMWIUA2z2QEFM0WOrW3GJQKK4QphYPoSq2POkzpFN9kjQocKJak2yjAiFCzSKbrUQsYkJ3Qb\n' +
            '5AQrQe92Llbe6bigx4ZY16G4IJVJkOG0pnpRZhSxgXWJnxWxOkfEourjojsasXPJ9HaqKy1pUObH\n' +
            'EqqPxUALaERBxJFwflxwJIiWKElaTM18Az40QA4b+DgNi+vfD94UMYwEBVGhhG4DBC2UAhmqj0eh\n' +
            'Bdzo8Sse0AQpskLL03Lz/Hmz/9juPj20iw+7bffXAR9dzmeiFC+C1Uplp6JgQfCMokV28aOFjS66\n' +
            'UBc2wuiCMFlPl8ixaVZDuYgPwIBeJkSJbLKAmaehkqLF1jbfZF1yDUwYYIIsibCw/ODSTsISG9/U\n' +
            'RCoCW7WIVDQhXC6xMqWECzq0HP0GMnt/A0cLrp0y+A1G+xuGaLk+jTdPsQXRf7snDH1S+6VHXqgj\n' +
            'wrwSKDcbpeILWr2oftCfuR6mUMQg+7XRSLlh/UYjKRlFhqZihbPAbYnpgRqwaxv04OBNjnBPLJC8\n' +
            'El06ax8ROUbEoKOKrBv/qAvDAEhMAEloUTmzyoFswqlT+axH/mtiRRQumSJMkhSPik10Vo7OfLCz\n' +
            'gunRfgGaJdVrkYFmQZXPRbv6wHxZkyuiWQ5HAebLCUvtkRZwLwyhcL+EkWGKFhtkIIGZLxsULMid\n' +
            'U2i+rIkKl4e9uckBMzYB5RMD9ucud+yX6dwKfOdWegemKEjTRtGkJCAqKoGOBxwU6uwjDAikI1MS\n' +
            'S8nWOUs9CiNP0haZAI1XTplNdVZCKy0mkuDSDtKbD2rZQkZahK2JYo90UBAZgfJ/ZKQVWFBk7zUb\n' +
            'gYIpeuSsoLiXbfoSq+u82LZpPi3XqZSJfGg8H9IfFkKW/Dn5ACRJQ5YkYUe/SMaJ1YgVCTQaBZ/f\n' +
            'VhyNefSrSMASeq1RsCCrHeS2aaxPVM2ItTFhf2M67cTbPVDvhA+wIOSJgGCZsTQWJWARqj/NZkSL\n' +
            'A2iJTsXwYblsNVlEw8KGfMJO2EjhVz42ZUQMQqcUIIbIh8DywV3Qa9NQ7yTioyQgykV2N1uLa510\n' +
            'QPO7gQOf19zjNINFLGLgkzdOnsepksRFBYscDKAlzD0CBUuqLzs6FkNH8x5XO6KQzYaFbnqbAoa6\n' +
            'v54HzDselyiT6e1jTDCJa5yg0+qx0XBBNjKFQpYn2Shyiqh3WlfqtNmOFOsmTUy03knKlAIdsMOH\n' +
            'kpi65ZOPCr0knsKl1LnVaVzeAfnfn+aGmxCf0GgkAg1Qs+Y16ItVOQJ77oUwNRfZsOCO60q17Eew\n' +
            '2EjEslpf6+g/bDDJBgYsi4sD847HOTz+uah2y83PXdy05vf/AlBLBwjNZRePiwkAAG5lAABQSwME\n' +
            'FAAIAAgAD1QpSgAAAAAAAAAAAAAAABsAEABfX01BQ09TWC9Db3Vyc2VzMS8uX0FESEU0MTJVWAwA\n' +
            'lWXiWT7Xc1j1ARQAY2AVY2dgYmDwTUxW8A9WiFCAApAYAycQGwHxIiAG8a8wEAUcQ0KCoEyQjhlA\n' +
            'bIOmhBEhLpqcn6uXWFCQk6pXWJpYlJhXkpmXylCob2BgYWxtapmcZpJknGwdnJiWWJRpbeBkaGhu\n' +
            'aWmp62jm6qhr4mpqqOto7Gyma2hg6eri5GxiauhkzAAAUEsHCP+x5FWHAAAA1AAAAFBLAwQUAAgA\n' +
            'CAAFVClKAAAAAAAAAAAAAAAAEQAQAENvdXJzZXMxL0FBTkI1MzBCVVgMAJRl4lkq13NY9QEUAKtW\n' +
            'KkotLs0pUbKKjtVRKkrMy1ayMqgFAFBLBwhKgJGaGAAAABYAAABQSwMEFAAIAAgABVQpSgAAAAAA\n' +
            'AAAAAAAAABwAEABfX01BQ09TWC9Db3Vyc2VzMS8uX0FBTkI1MzBCVVgMAJRl4lkq13NY9QEUAGNg\n' +
            'FWNnYGJg8E1MVvAPVohQgAKQGAMnEBsB8SIgBvGvMBAFHENCgqBMkI4ZQGyDpoQRIS6anJ+rl1hQ\n' +
            'kJOqV1iaWJSYV5KZl8pQqG9gYGFsbWqZnGaSZJxsHZyYlliUaW3gZGhobmlpqeto5uqoa+Jqaqjr\n' +
            'aOxspmtoYOnq4uRsYmroZMwAAFBLBwj/seRVhwAAANQAAABQSwMEFAAIAAgADVQpSgAAAAAAAAAA\n' +
            'AAAAABAAEABDb3Vyc2VzMS9BTkFUNTA0VVgMAJVl4lk613NY9QEUAKtWKkotLs0pUbKKjtVRKkrM\n' +
            'y1ayMqgFAFBLBwhKgJGaGAAAABYAAABQSwMEFAAIAAgADVQpSgAAAAAAAAAAAAAAABsAEABfX01B\n' +
            'Q09TWC9Db3Vyc2VzMS8uX0FOQVQ1MDRVWAwAlWXiWTrXc1j1ARQAY2AVY2dgYmDwTUxW8A9WiFCA\n' +
            'ApAYAycQGwHxIiAG8a8wEAUcQ0KCoEyQjhlAbIOmhBEhLpqcn6uXWFCQk6pXWJpYlJhXkpmXylCo\n' +
            'b2BgYWxtapmcZpJknGwdnJiWWJRpbeBkaGhuaWmp62jm6qhr4mpqqOto7Gyma2hg6eri5Gxiauhk\n' +
            'zAAAUEsHCP+x5FWHAAAA1AAAAFBLAwQUAAgACAAKVClKAAAAAAAAAAAAAAAAEAAQAENvdXJzZXMx\n' +
            'L0FHRUM1NDlVWAwAlWXiWTTXc1j1ARQAq1YqSi0uzSlRsoqO1VEqSszLVrIyqAUAUEsHCEqAkZoY\n' +
            'AAAAFgAAAFBLAwQUAAgACAAKVClKAAAAAAAAAAAAAAAAGwAQAF9fTUFDT1NYL0NvdXJzZXMxLy5f\n' +
            'QUdFQzU0OVVYDACVZeJZNNdzWPUBFABjYBVjZ2BiYPBNTFbwD1aIUIACkBgDJxAbAfEtIAbyGXkY\n' +
            'iAKOISFBEBZYxwEg9kFTwgQVF2BgkErOz9VLLCjISdXLSSwuKS1OTUlJLElVDgiGqr0AxDYMDKII\n' +
            'dYWliUWJeSWZeakMBS43IkGK3p52kwXRhfoGBhbG1qaWyWkmScbJ1sGJaYlFmdYGToaG5paWlrqO\n' +
            'Zq6Ouiaupoa6jsbOZrqGBpauLk7OJqaGTsYMAFBLBwhPaWncsAAAAAwBAABQSwMEFAAIAAgABlQp\n' +
            'SgAAAAAAAAAAAAAAABEAEABDb3Vyc2VzMS9BQU5CNTMwRFVYDACUZeJZK9dzWPUBFACrVipKLS7N\n' +
            'KVGyio7VUSpKzMtWsjKoBQBQSwcISoCRmhgAAAAWAAAAUEsDBBQACAAIAAZUKUoAAAAAAAAAAAAA\n' +
            'AAAcABAAX19NQUNPU1gvQ291cnNlczEvLl9BQU5CNTMwRFVYDACUZeJZK9dzWPUBFABjYBVjZ2Bi\n' +
            'YPBNTFbwD1aIUIACkBgDJxAbAfEiIAbxrzAQBRxDQoKgTJCOGUBsg6aEESEumpyfq5dYUJCTqldY\n' +
            'mliUmFeSmZfKUKhvYGBhbG1qmZxmkmScbB2cmJZYlGlt4GRoaG5paanraObqqGviamqo62jsbKZr\n' +
            'aGDp6uLkbGJq6GTMAABQSwcI/7HkVYcAAADUAAAAUEsDBBQACAAIAAlUKUoAAAAAAAAAAAAAAAAR\n' +
            'ABAAQ291cnNlczEvQUZTVDI1MEFVWAwAlWXiWTLXc1j1ARQAq1YqSi0uzSlRsoqO1VEqSszLVrIy\n' +
            'qAUAUEsHCEqAkZoYAAAAFgAAAFBLAwQUAAgACAAJVClKAAAAAAAAAAAAAAAAHAAQAF9fTUFDT1NY\n' +
            'L0NvdXJzZXMxLy5fQUZTVDI1MEFVWAwAlWXiWTLXc1j1ARQAY2AVY2dgYmDwTUxW8A9WiFCAApAY\n' +
            'AycQGwHxIiAG8a8wEAUcQ0KCoEyQjhlAbIOmhBEhLpqcn6uXWFCQk6pXWJpYlJhXkpmXylCob2Bg\n' +
            'YWxtapmcZpJknGwdnJiWWJRpbeBkaGhuaWmp62jm6qhr4mpqqOto7Gyma2hg6eri5GxiauhkzAAA\n' +
            'UEsHCP+x5FWHAAAA1AAAAFBLAwQUAAgACAAFVClKAAAAAAAAAAAAAAAAEQAQAENvdXJzZXMxL0FB\n' +
            'TkI1MzBDVVgMAJRl4lkq13NY9QEUAKtWKkotLs0pUbKKjtVRKkrMy1ayMqgFAFBLBwhKgJGaGAAA\n' +
            'ABYAAABQSwMEFAAIAAgABVQpSgAAAAAAAAAAAAAAABwAEABfX01BQ09TWC9Db3Vyc2VzMS8uX0FB\n' +
            'TkI1MzBDVVgMAJRl4lkq13NY9QEUAGNgFWNnYGJg8E1MVvAPVohQgAKQGAMnEBsB8SIgBvGvMBAF\n' +
            'HENCgqBMkI4ZQGyDpoQRIS6anJ+rl1hQkJOqV1iaWJSYV5KZl8pQqG9gYGFsbWqZnGaSZJxsHZyY\n' +
            'lliUaW3gZGhobmlpqeto5uqoa+JqaqjraOxspmtoYOnq4uRsYmroZMwAAFBLBwj/seRVhwAAANQA\n' +
            'AABQSwMEFAAIAAgABlQpSgAAAAAAAAAAAAAAABEAEABDb3Vyc2VzMS9BQU5CNTQ5QlVYDACUZeJZ\n' +
            'LNdzWPUBFACrVipKLS7NKVGyio7VUSpKzMtWsjKoBQBQSwcISoCRmhgAAAAWAAAAUEsDBBQACAAI\n' +
            'AAZUKUoAAAAAAAAAAAAAAAAcABAAX19NQUNPU1gvQ291cnNlczEvLl9BQU5CNTQ5QlVYDACUZeJZ\n' +
            'LNdzWPUBFABjYBVjZ2BiYPBNTFbwD1aIUIACkBgDJxAbAfEiIAbxrzAQBRxDQoKgTJCOGUBsg6aE\n' +
            'ESEumpyfq5dYUJCTqldYmliUmFeSmZfKUKhvYGBhbG1qmZxmkmScbB2cmJZYlGlt4GRoaG5paanr\n' +
            'aObqqGviamqo62jsbKZraGDp6uLkbGJq6GTMAABQSwcI/7HkVYcAAADUAAAAUEsDBBQACAAIAAtU\n' +
            'KUoAAAAAAAAAAAAAAAARABAAQ291cnNlczEvQU5BVDQ0OE5VWAwAlWXiWTbXc1j1ARQAq1YqSi0u\n' +
            'zSlRsoqO1VEqSszLVrIyqAUAUEsHCEqAkZoYAAAAFgAAAFBLAwQUAAgACAALVClKAAAAAAAAAAAA\n' +
            'AAAAHAAQAF9fTUFDT1NYL0NvdXJzZXMxLy5fQU5BVDQ0OE5VWAwAlWXiWTbXc1j1ARQAY2AVY2dg\n' +
            'YmDwTUxW8A9WiFCAApAYAycQGwHxLSAG8hl5GIgCjiEhQRAWWMcBIPZBU8IEFRdgYJBKzs/VSywo\n' +
            'yEnVy0ksLiktTk1JSSxJVQ4Ihqq9AMQ2DAyiCHWFpYlFiXklmXmpDGdW3IoEKTL//IYfRBfqGxhY\n' +
            'GFubWianmSQZJ1sHJ6YlFmVaGzgZGppbWlrqOpq5OuqauJoa6joaO5vpGhpYuro4OZuYGjoZMwAA\n' +
            'UEsHCEzjQfWxAAAADAEAAFBLAwQUAAgACAAGVClKAAAAAAAAAAAAAAAAEAAQAENvdXJzZXMxL0FB\n' +
            'TkI1NTFVWAwAlGXiWSzXc1j1ARQA7VLLTsMwEPyVas9RlbSkFN+qAuKARKUiIYRQ5TabxuDayHYS\n' +
            'StV/Z+0kanoHceHm8exjdmcPYNCW0gF7OYATaFYotoXbr3JRIbBx1HwqodDtgY0ieBROEgNc7eSg\n' +
            'RpkPjDWbAiJY4sYJrYiL4zHha3RcSILQVrFYoaLartbA4ggeXIEmvO51DWx60cWJT69Alw0pMhKS\n' +
            'jKfJGR10Bj58fqHRJ9R1otDTpyuE8UN0OBd5CxdG52itNo3YWZmJXultL7JJ1F2dJ+GKzGAdwDNy\n' +
            'X2AUJ2k3sau9jMAuXZZhRSscppMIbpTRUiJNNumradfeNWq8AHY2eW8gVAHcURiwK4qa086sdydN\n' +
            'k+CItY0jNaEFtzb0uw22UOKs2tLaL4dT8nnOdx8l8VCuNz61XL+Rn95ortZwjH7wPHSFhkv5Cycy\n' +
            '+j+RvzuR1wgMV++UdvwGUEsHCFYOkbZQAQAAVwQAAFBLAwQUAAgACAAGVClKAAAAAAAAAAAAAAAA\n' +
            'GwAQAF9fTUFDT1NYL0NvdXJzZXMxLy5fQUFOQjU1MVVYDACUZeJZLNdzWPUBFABjYBVjZ2BiYPBN\n' +
            'TFbwD1aIUIACkBgDJxAbAfEiIAbxrzAQBRxDQoKgTJCOGUBsg6aEESEumpyfq5dYUJCTqldYmliU\n' +
            'mFeSmZfKUKhvYGBhbG1qmZxmkmScbB2cmJZYlGlt4GRoaG5paanraObqqGviamqo62jsbKZraGDp\n' +
            '6uLkbGJq6GTMAABQSwcI/7HkVYcAAADUAAAAUEsDBBQACAAIAARUKUoAAAAAAAAAAAAAAAAQABAA\n' +
            'Q291cnNlczEvQUFOQjUwNFVYDACUZeJZKNdzWPUBFADtUk1LAzEQ/Ssy51C2263WvRU/8CBYqCAi\n' +
            'UtLu7G40TSTJ7lpL/7uTbEPbe8GLxzfzZvJe3mzBoG2kg/xtC06gWaCoardZlKJFyIesLyqh0G0g\n' +
            'nzB4Fk5SB4w1q/pija4uZLUBBnNcOaEVtZIkJXyLjgtJEPZLLLaoaLXrNOQJgydXowlvPOqOdl9H\n' +
            'nvj2AnRjAk0UkI+Go6vTdpAZ+qH4g0YfUHyJqIeiq4XxHiIuRbmHM6NLtFabXuy0KQStju9VR8x+\n' +
            'UMc9L4LcG+yCiVfkfkGaDMfRseu8jECdu6LAFvJ0cDlmcKeMlhLJWXoiZ//tsdZnceTLWz9yhCqA\n' +
            'B6KRXgrnhj7N+nTGSRYisbaPpCM049YGW/chFxqcthUVskGW0ShffzXUh2a58qPN8oMCJcy5WsKO\n' +
            'ne88dIuGS3n+E5kk/yfyhyfyzsBw9Ulju19QSwcIoIujslABAABXBAAAUEsDBBQACAAIAARUKUoA\n' +
            'AAAAAAAAAAAAAAAbABAAX19NQUNPU1gvQ291cnNlczEvLl9BQU5CNTA0VVgMAJRl4lko13NY9QEU\n' +
            'AGNgFWNnYGJg8E1MVvAPVohQgAKQGAMnEBsB8S0gBvIZeRiIAo4hIUEQFljHASD2QVPCBBUXYGCQ\n' +
            'Ss7P1UssKMhJ1ctJLC4pLU5NSUksSVUOCIaqvQDENgwMogh1haWJRYl5JZl5qQzyiy5FghSFWOyU\n' +
            'BNGF+gYGFsbWppbJaSZJxsnWwYlpiUWZ1gZOhobmlpaWuo5mro66Jq6mhrqOxs5muoYGlq4uTs4m\n' +
            'poZOxgwAUEsHCEqGid6wAAAADAEAAFBLAwQUAAgACAAKVClKAAAAAAAAAAAAAAAAEQAQAENvdXJz\n' +
            'ZXMxL0FHRUM1MzBCVVgMAJVl4lkz13NY9QEUAKtWKkotLs0pUbKKjtVRKkrMy1ayMqgFAFBLBwhK\n' +
            'gJGaGAAAABYAAABQSwMEFAAIAAgAClQpSgAAAAAAAAAAAAAAABwAEABfX01BQ09TWC9Db3Vyc2Vz\n' +
            'MS8uX0FHRUM1MzBCVVgMAJVl4lkz13NY9QEUAGNgFWNnYGJg8E1MVvAPVohQgAKQGAMnEBsB8S0g\n' +
            'BvIZeRiIAo4hIUEQFljHASD2QVPCBBUXYGCQSs7P1UssKMhJ1ctJLC4pLU5NSUksSVUOCIaqvQDE\n' +
            'NgwMogh1haWJRYl5JZl5qQzOATciQYp4c2fKgOhCfQMDC2NrU8vkNJMk42Tr4MS0xKJMawMnQ0Nz\n' +
            'S0tLXUczV0ddE1dTQ11HY2czXUMDS1cXJ2cTU0MnYwYAUEsHCF9Jz5awAAAADAEAAFBLAQIVAwoA\n' +
            'AAAAAKxjTksAAAAAAAAAAAAAAAAJAAwAAAAAAAAAAEDtQQAAAABDb3Vyc2VzMS9VWAgApGXiWZRl\n' +
            '4llQSwECFQMUAAgACAAFVClKSoCRmhgAAAAWAAAAEAAMAAAAAAAAAABApIE3AAAAQ291cnNlczEv\n' +
            'QUFOQjUxNVVYCACUZeJZKddzWFBLAQIVAwoAAAAAALRjTksAAAAAAAAAAAAAAAAJAAwAAAAAAAAA\n' +
            'AED9QZ0AAABfX01BQ09TWC9VWAgApGXiWaRl4llQSwECFQMKAAAAAAC0Y05LAAAAAAAAAAAAAAAA\n' +
            'EgAMAAAAAAAAAABA/UHUAAAAX19NQUNPU1gvQ291cnNlczEvVVgIAKRl4lmkZeJZUEsBAhUDFAAI\n' +
            'AAgABVQpSv+x5FWHAAAA1AAAABsADAAAAAAAAAAAQKSBFAEAAF9fTUFDT1NYL0NvdXJzZXMxLy5f\n' +
            'QUFOQjUxNVVYCACUZeJZKddzWFBLAQIVAxQACAAIAAVUKUpKgJGaGAAAABYAAAARAAwAAAAAAAAA\n' +
            'AECkgfQBAABDb3Vyc2VzMS9BQU5CNTMwQVVYCACUZeJZKddzWFBLAQIVAxQACAAIAAVUKUr/seRV\n' +
            'hwAAANQAAAAcAAwAAAAAAAAAAECkgVsCAABfX01BQ09TWC9Db3Vyc2VzMS8uX0FBTkI1MzBBVVgI\n' +
            'AJRl4lkp13NYUEsBAhUDFAAIAAgAC1QpSsjftDevAwAAeicAABAADAAAAAAAAAAAQKSBPAMAAENv\n' +
            'dXJzZXMxL0FOQVQzOTJVWAgAlWXiWTXXc1hQSwECFQMUAAgACAALVClK5CGU7bAAAAAMAQAAGwAM\n' +
            'AAAAAAAAAABApIE5BwAAX19NQUNPU1gvQ291cnNlczEvLl9BTkFUMzkyVVgIAJVl4lk113NYUEsB\n' +
            'AhUDFAAIAAgACFQpSkqAkZoYAAAAFgAAABAADAAAAAAAAAAAQKSBQggAAENvdXJzZXMxL0FBTkI2\n' +
            'NDlVWAgAlWXiWTDXc1hQSwECFQMUAAgACAAIVClK/7HkVYcAAADUAAAAGwAMAAAAAAAAAABApIGo\n' +
            'CAAAX19NQUNPU1gvQ291cnNlczEvLl9BQU5CNjQ5VVgIAJVl4lkw13NYUEsBAhUDFAAIAAgAClQp\n' +
            'SkqAkZoYAAAAFgAAABAADAAAAAAAAAAAQKSBiAkAAENvdXJzZXMxL0FOQUU0MzBVWAgAlWXiWTTX\n' +
            'c1hQSwECFQMUAAgACAAKVClKV1trwrAAAAAMAQAAGwAMAAAAAAAAAABApIHuCQAAX19NQUNPU1gv\n' +
            'Q291cnNlczEvLl9BTkFFNDMwVVgIAJVl4lk013NYUEsBAhUDFAAIAAgACVQpSvFnY9iLAgAATA8A\n' +
            'ABAADAAAAAAAAAAAQKSB9woAAENvdXJzZXMxL0FESEUzMjhVWAgAlWXiWTHXc1hQSwECFQMUAAgA\n' +
            'CAAJVClK/7HkVYcAAADUAAAAGwAMAAAAAAAAAABApIHQDQAAX19NQUNPU1gvQ291cnNlczEvLl9B\n' +
            'REhFMzI4VVgIAJVl4lkx13NYUEsBAhUDFAAIAAgAC1QpSkqAkZoYAAAAFgAAABEADAAAAAAAAAAA\n' +
            'QKSBsA4AAENvdXJzZXMxL0FOQVQ0NDhKVVgIAJVl4lk113NYUEsBAhUDFAAIAAgAC1QpSv+x5FWH\n' +
            'AAAA1AAAABwADAAAAAAAAAAAQKSBFw8AAF9fTUFDT1NYL0NvdXJzZXMxLy5fQU5BVDQ0OEpVWAgA\n' +
            'lWXiWTXXc1hQSwECFQMUAAgACAAGVClKSoCRmhgAAAAWAAAAEQAMAAAAAAAAAABApIH4DwAAQ291\n' +
            'cnNlczEvQUFOQjU0OUFVWAgAlGXiWSvXc1hQSwECFQMUAAgACAAGVClK/7HkVYcAAADUAAAAHAAM\n' +
            'AAAAAAAAAABApIFfEAAAX19NQUNPU1gvQ291cnNlczEvLl9BQU5CNTQ5QVVYCACUZeJZK9dzWFBL\n' +
            'AQIVAxQACAAIAApUKUpKgJGaGAAAABYAAAARAAwAAAAAAAAAAECkgUARAABDb3Vyc2VzMS9BRlNU\n' +
            'MzUyQVVYCACVZeJZM9dzWFBLAQIVAxQACAAIAApUKUrFoJqysAAAAAwBAAAcAAwAAAAAAAAAAECk\n' +
            'gacRAABfX01BQ09TWC9Db3Vyc2VzMS8uX0FGU1QzNTJBVVgIAJVl4lkz13NYUEsBAhUDFAAIAAgA\n' +
            'CFQpSrUqlVXBCwAAk38AABAADAAAAAAAAAAAQKSBsRIAAENvdXJzZXMxL0FESEUzMjdVWAgAlWXi\n' +
            'WTDXc1hQSwECFQMUAAgACAAIVClK/7HkVYcAAADUAAAAGwAMAAAAAAAAAABApIHAHgAAX19NQUNP\n' +
            'U1gvQ291cnNlczEvLl9BREhFMzI3VVgIAJVl4lkw13NYUEsBAhUDFAAIAAgABFQpSkqAkZoYAAAA\n' +
            'FgAAABAADAAAAAAAAAAAQKSBoB8AAENvdXJzZXMxL0FBTkI1MDBVWAgAlGXiWSjXc1hQSwECFQMU\n' +
            'AAgACAAEVClKymhIvLAAAAAMAQAAGwAMAAAAAAAAAABApIEGIAAAX19NQUNPU1gvQ291cnNlczEv\n' +
            'Ll9BQU5CNTAwVVgIAJRl4lko13NYUEsBAhUDFAAIAAgAC1QpSkqAkZoYAAAAFgAAABEADAAAAAAA\n' +
            'AAAAQKSBDyEAAENvdXJzZXMxL0FOQVQ0NDhMVVgIAJVl4lk113NYUEsBAhUDFAAIAAgAC1QpSlkk\n' +
            'VPuwAAAADAEAABwADAAAAAAAAAAAQKSBdiEAAF9fTUFDT1NYL0NvdXJzZXMxLy5fQU5BVDQ0OExV\n' +
            'WAgAlWXiWTXXc1hQSwECFQMUAAgACAAJVClKbGUwwxsMAABHgAAAEAAMAAAAAAAAAABApIGAIgAA\n' +
            'Q291cnNlczEvQURIRTMyOVVYCACVZeJZMddzWFBLAQIVAxQACAAIAAlUKUr/seRVhwAAANQAAAAb\n' +
            'AAwAAAAAAAAAAECkgekuAABfX01BQ09TWC9Db3Vyc2VzMS8uX0FESEUzMjlVWAgAlWXiWTHXc1hQ\n' +
            'SwECFQMUAAgACAAJVClKeLJCdxYLAADGgwAAEAAMAAAAAAAAAABApIHJLwAAQ291cnNlczEvQURI\n' +
            'RTMzMFVYCACVZeJZMtdzWFBLAQIVAxQACAAIAAlUKUr/seRVhwAAANQAAAAbAAwAAAAAAAAAAECk\n' +
            'gS07AABfX01BQ09TWC9Db3Vyc2VzMS8uX0FESEUzMzBVWAgAlWXiWTLXc1hQSwECFQMUAAgACAAP\n' +
            'VClKzWUXj4sJAABuZQAAEAAMAAAAAAAAAABApIENPAAAQ291cnNlczEvQURIRTQxMlVYCACVZeJZ\n' +
            'PtdzWFBLAQIVAxQACAAIAA9UKUr/seRVhwAAANQAAAAbAAwAAAAAAAAAAECkgeZFAABfX01BQ09T\n' +
            'WC9Db3Vyc2VzMS8uX0FESEU0MTJVWAgAlWXiWT7Xc1hQSwECFQMUAAgACAAFVClKSoCRmhgAAAAW\n' +
            'AAAAEQAMAAAAAAAAAABApIHGRgAAQ291cnNlczEvQUFOQjUzMEJVWAgAlGXiWSrXc1hQSwECFQMU\n' +
            'AAgACAAFVClK/7HkVYcAAADUAAAAHAAMAAAAAAAAAABApIEtRwAAX19NQUNPU1gvQ291cnNlczEv\n' +
            'Ll9BQU5CNTMwQlVYCACUZeJZKtdzWFBLAQIVAxQACAAIAA1UKUpKgJGaGAAAABYAAAAQAAwAAAAA\n' +
            'AAAAAECkgQ5IAABDb3Vyc2VzMS9BTkFUNTA0VVgIAJVl4lk613NYUEsBAhUDFAAIAAgADVQpSv+x\n' +
            '5FWHAAAA1AAAABsADAAAAAAAAAAAQKSBdEgAAF9fTUFDT1NYL0NvdXJzZXMxLy5fQU5BVDUwNFVY\n' +
            'CACVZeJZOtdzWFBLAQIVAxQACAAIAApUKUpKgJGaGAAAABYAAAAQAAwAAAAAAAAAAECkgVRJAABD\n' +
            'b3Vyc2VzMS9BR0VDNTQ5VVgIAJVl4lk013NYUEsBAhUDFAAIAAgAClQpSk9padywAAAADAEAABsA\n' +
            'DAAAAAAAAAAAQKSBukkAAF9fTUFDT1NYL0NvdXJzZXMxLy5fQUdFQzU0OVVYCACVZeJZNNdzWFBL\n' +
            'AQIVAxQACAAIAAZUKUpKgJGaGAAAABYAAAARAAwAAAAAAAAAAECkgcNKAABDb3Vyc2VzMS9BQU5C\n' +
            'NTMwRFVYCACUZeJZK9dzWFBLAQIVAxQACAAIAAZUKUr/seRVhwAAANQAAAAcAAwAAAAAAAAAAECk\n' +
            'gSpLAABfX01BQ09TWC9Db3Vyc2VzMS8uX0FBTkI1MzBEVVgIAJRl4lkr13NYUEsBAhUDFAAIAAgA\n' +
            'CVQpSkqAkZoYAAAAFgAAABEADAAAAAAAAAAAQKSBC0wAAENvdXJzZXMxL0FGU1QyNTBBVVgIAJVl\n' +
            '4lky13NYUEsBAhUDFAAIAAgACVQpSv+x5FWHAAAA1AAAABwADAAAAAAAAAAAQKSBckwAAF9fTUFD\n' +
            'T1NYL0NvdXJzZXMxLy5fQUZTVDI1MEFVWAgAlWXiWTLXc1hQSwECFQMUAAgACAAFVClKSoCRmhgA\n' +
            'AAAWAAAAEQAMAAAAAAAAAABApIFTTQAAQ291cnNlczEvQUFOQjUzMENVWAgAlGXiWSrXc1hQSwEC\n' +
            'FQMUAAgACAAFVClK/7HkVYcAAADUAAAAHAAMAAAAAAAAAABApIG6TQAAX19NQUNPU1gvQ291cnNl\n' +
            'czEvLl9BQU5CNTMwQ1VYCACUZeJZKtdzWFBLAQIVAxQACAAIAAZUKUpKgJGaGAAAABYAAAARAAwA\n' +
            'AAAAAAAAAECkgZtOAABDb3Vyc2VzMS9BQU5CNTQ5QlVYCACUZeJZLNdzWFBLAQIVAxQACAAIAAZU\n' +
            'KUr/seRVhwAAANQAAAAcAAwAAAAAAAAAAECkgQJPAABfX01BQ09TWC9Db3Vyc2VzMS8uX0FBTkI1\n' +
            'NDlCVVgIAJRl4lks13NYUEsBAhUDFAAIAAgAC1QpSkqAkZoYAAAAFgAAABEADAAAAAAAAAAAQKSB\n' +
            '408AAENvdXJzZXMxL0FOQVQ0NDhOVVgIAJVl4lk213NYUEsBAhUDFAAIAAgAC1QpSkzjQfWxAAAA\n' +
            'DAEAABwADAAAAAAAAAAAQKSBSlAAAF9fTUFDT1NYL0NvdXJzZXMxLy5fQU5BVDQ0OE5VWAgAlWXi\n' +
            'WTbXc1hQSwECFQMUAAgACAAGVClKVg6RtlABAABXBAAAEAAMAAAAAAAAAABApIFVUQAAQ291cnNl\n' +
            'czEvQUFOQjU1MVVYCACUZeJZLNdzWFBLAQIVAxQACAAIAAZUKUr/seRVhwAAANQAAAAbAAwAAAAA\n' +
            'AAAAAECkgfNSAABfX01BQ09TWC9Db3Vyc2VzMS8uX0FBTkI1NTFVWAgAlGXiWSzXc1hQSwECFQMU\n' +
            'AAgACAAEVClKoIujslABAABXBAAAEAAMAAAAAAAAAABApIHTUwAAQ291cnNlczEvQUFOQjUwNFVY\n' +
            'CACUZeJZKNdzWFBLAQIVAxQACAAIAARUKUpKhonesAAAAAwBAAAbAAwAAAAAAAAAAECkgXFVAABf\n' +
            'X01BQ09TWC9Db3Vyc2VzMS8uX0FBTkI1MDRVWAgAlGXiWSjXc1hQSwECFQMUAAgACAAKVClKSoCR\n' +
            'mhgAAAAWAAAAEQAMAAAAAAAAAABApIF6VgAAQ291cnNlczEvQUdFQzUzMEJVWAgAlWXiWTPXc1hQ\n' +
            'SwECFQMUAAgACAAKVClKX0nPlrAAAAAMAQAAHAAMAAAAAAAAAABApIHhVgAAX19NQUNPU1gvQ291\n' +
            'cnNlczEvLl9BR0VDNTMwQlVYCACVZeJZM9dzWFBLBQYAAAAANwA3ABARAADrVwAAAAA=').then(function (value: InsightResponse) {
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
