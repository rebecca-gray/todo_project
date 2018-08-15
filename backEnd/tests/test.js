const Crud = require("../server/crud")
const chai = require("chai")
const { expect } = chai;
const moment = require("moment")
const sqlite3 = require('sqlite3').verbose();

const crud = new Crud();
const today = moment().format('YYYY-MM-DD');
const tomorrow = moment().add(1, "d").format('YYYY-MM-DD');
const yesterday = moment().subtract(1, "d").format('YYYY-MM-DD');

const db = new sqlite3.Database('todoAppTest', (err) => {
    if (err) {
        return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
    }
    console.log('Connected to SQlite database.');
});

crud.db = db;

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

