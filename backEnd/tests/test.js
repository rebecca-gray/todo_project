const crud = require("../server/crud")
const chai = require("chai")
const { expect } = chai;
const moment = require("moment")

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

describe("Server", () => {
    describe("fetchAll", () => {
        it("should return a complete short data set", (done) => {
            const responseBody = {
                status: 'success',
                data: SHORT_DATA_SET,
              };
            get(null, responseObject, JSON.stringify(responseBody));
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
})