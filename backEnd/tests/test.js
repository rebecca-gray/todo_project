const sinon = require("sinon");
const chai = require("chai");
const { expect } = chai;
// const server = require("../src/server");
const request = require("request")
const moment = require("moment")
// const sinonChai = require("sinon-chai");

// chai.use(sinonChai);

const base = 'http://localhost:5000';
const today = moment().format('YYYY-MM-DD');
const tomorrow = moment().add(1, "d").format('YYYY-MM-DD');
const yesterday = moment().subtract(1, "d").format('YYYY-MM-DD');

const SHORT_DATA_SET = [
    {id: 1, isComplete: "false", title: "Extreme", deadline: `${yesterday}`},
    {id: 2, isComplete: "true", title: "Concert", deadline: `${tomorrow}`},
    {id: 3, isComplete: "false", title: "Birthday Party", deadline: `${today}`}
]

const FULL_DATA_SET = [
    {id: 1, isComplete: "false", title: "Extreme", deadline: "2018-08-01", body: "foo"},
    {id: 2, isComplete: "true", title: "Concert", deadline: "2018-08-18", body: "bar"},
    {id: 3, isComplete: "false", title: "Birthday Party", deadline: "2018-08-23", body: "baz"}
]

describe("server", () => {
    beforeEach(() => {
        beforeEach(() => {
            const responseObject = {
              statusCode: 200,
              headers: {
                'content-type': 'application/json'
              }
            };
            this.get = sinon.stub(request, 'get');
            this.post = sinon.stub(request, 'post');
            this.delete = sinon.stub(request, 'delete');
            this.put = sinon.stub(request, 'put');
          });

          afterEach(() => {
            request.get.restore();
            request.post.restore();
            request.delete.restore();
            request.put.restore();
          });
    })
    describe("GET /all", () => {
        it("should return a complete short data set", (done) => {
            const responseBody = {
                status: 'success',
                data: SHORT_DATA_SET,
              };
            this.get.yields(null, responseObject, JSON.stringify(responseBody));
            request.get(`${base}/all`, (err, res, body) => {
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.contain('application/json');
                body = JSON.parse(body);
                expect(body.satus).to.equal('success');
                expect(body.data.length).to.equal(3);
                expect(body.data[0]).to.include.keys(
                    'id', 'isComplete', 'deadline', 'title'
                );
                expect(body.daa[0].title).to.equal('Extreme')
            })
        });
    })
    describe("GET /detail?id=1", () => {
        it("should respond with a single, complete record", (done) => {
            const responseBody = {
                status: 'success',
                data: [FULL_DATA_SET[0]],
              };
            this.get.yields(null, responseObject, JSON.stringify(responseBody));
            request.get(`${base}/detail?id=1`, (err, res, body) => {
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.contain('application/json');
                body = JSON.parse(body);
                expect(body.data.length).to.equal(1);
                expect(body.status).to.equal('success')
                expect(body.data[0]).to.include.keys(
                    'id', 'name', 'isCompelte', 'deadline', 'body'
                );
                expect(body.data[0].title).to.equal('Extreme')
            })
        });
    });
    describe("GET /today", () => {
        it("should respond with a subset of short records with deadline of today", (done) => {
            const responseBody = {
                status: 'success',
                data: [SHORT_DATA_SET[2]],
              };
            this.get.yields(null, responseObject, JSON.stringify(responseBody));
            request.get(`${base}/today`, (err, res, body) => {
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.contain('application/json');
                body = JSON.parse(body);
                expect(body.data.length).to.equal(1);
                expect(body.status).to.equal('success')
                expect(body.data[0]).to.include.keys(
                    'id', 'name', 'isCompelte', 'deadline', 'body'
                );
                expect(body.data[0].title).to.equal('Birthday Party')
                expect(body.data[0].deadline).to.equal(today);
            })
        });
    });
    describe("GET /tomorrow", () => {
        it("should respond with a subset of short records with deadline of tomorrow", (done) => {
            const responseBody = {
                status: 'success',
                data: [SHORT_DATA_SET[1]],
              };
            this.get.yields(null, responseObject, JSON.stringify(responseBody));
            request.get(`${base}/today`, (err, res, body) => {
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.contain('application/json');
                body = JSON.parse(body);
                expect(body.data.length).to.equal(1);
                expect(body.status).to.equal('success')
                expect(body.data[0]).to.include.keys(
                    'id', 'name', 'isCompelte', 'deadline', 'body'
                );
                expect(body.data[0].title).to.equal('Concert')
                expect(body.data[0].deadline).to.equal(tomorrow);
            })
        });
    });
    describe("GET /complete", () => {
        it("should respond with a subset of short records with isComplete true", (done) => {
            const responseBody = {
                status: 'success',
                data: [SHORT_DATA_SET[1]],
              };
            this.get.yields(null, responseObject, JSON.stringify(responseBody));
            request.get(`${base}/today`, (err, res, body) => {
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.contain('application/json');
                body = JSON.parse(body);
                expect(body.data.length).to.equal(1);
                expect(body.status).to.equal('success')
                expect(body.data[0]).to.include.keys(
                    'id', 'name', 'isCompelte', 'deadline', 'body'
                );
                expect(body.data[0].title).to.equal('Concert')
                expect(body.data[0].isComplete).to.equal('true');
            })
        });
    });
    describe("GET /incomplete", () => {
        it("should respond with a subset of short records with isComplete false", (done) => {
            const responseBody = {
                status: 'success',
                data: [SHORT_DATA_SET[0], SHORT_DATA_SET[2]]
              };
            this.get.yields(null, responseObject, JSON.stringify(responseBody));
            request.get(`${base}/today`, (err, res, body) => {
                expect(res.statusCode).to.equal(200);
                expect(res.headers['content-type']).to.contain('application/json');
                body = JSON.parse(body);
                expect(body.data.length).to.equal(2);
                expect(body.status).to.equal('success')
                expect(body.data[0]).to.include.keys(
                    'id', 'name', 'isCompelte', 'deadline', 'body'
                );
                expect(body.data[0].title).to.equal('Extreme')
                expect(body.data[0].isComplete).to.equal('false');
            })
        });
    })
});