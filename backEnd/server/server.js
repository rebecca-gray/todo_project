'use strict';
const sqlite3  = require('sqlite3').verbose();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const moment = require('moment');
const url = require('url');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.listen(port, function () {
    console.log(`todoApp listening on port ${port}!`);
});

const db = new sqlite3.Database('todoApp', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to SQlite database.');
});

/**
 * @file
 * Routes:
 * GET: today, complete, incomplete, future, overdue, tomorrow, all,
 * POST:
 * PUT: id
 * DELETE: id
 *
 * sample data set:
 * stmt.run(null, 'true', 'Concert', 'La Traviata with Seamus', '2018-08-18')
 * stmt.run(null, 'false', 'Birthday Party', 'Aidan turns 9', '2018-08-23')
 * stmt.run(null, 'false', 'Extreme', 'Swim The English Channel', '2018-08-01')
 *
 * schema: {
 *     "id": {
 *         type: INTEGER PRIMARY KEY
 *      },
 *      "isComplete": {
 *         type: TEXT,
 *         "enum": [
 *            "false",
 *            "true"
 *         ]
 *         "default": "false"
 *      },
 *      "title": {
 *          "type": "string"
 *       },
 *       "body": {
 *           "type": "string"
 *       },
 *       "deadline": {
 *           "type": "string"
 *           "format": "isoDateString"
 *        }
 * }
 */
db.serialize(function() {
  db.run("CREATE TABLE if not exists todos (id INTEGER PRIMARY KEY, isComplete TEXT, title TEXT, body TEXT, deadline TEXT)");
  var stmt = db.prepare("INSERT INTO todos VALUES (?, ?, ?, ?, ?)");

//   stmt.finalize();

  db.each("SELECT * FROM todos", function(err, row) {
      console.log(row.id + ": " + row.body);
  });
});

 /**
  * return all todo records in the db
  * @returns {array of objects}
  */
app.get('/all', (req, res) => {
    const query = `SELECT id, isComplete, title, deadline FROM todos ORDER BY deadline`
    db.all(query, [], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})

/**
 * filter records to this day
 * TODO: need to handle time zones vs local time
 * @returns {array of objects}
 */
app.get('/today', (req, res) => {
    console.log("today")
    let today = moment().format("YYYY-MM-DD").toString()
    const tomorrow = moment().add(1, "days").format("YYYY-MM-DD").toString()
    const query = `SELECT id, isComplete, title, deadline FROM todos WHERE deadline >= "${today}" AND deadline <= "${tomorrow}"`
    db.all(query, [], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})

/**
 * filter records to tomorrow
 * TODO: need to handle time zones vs local time
 * @returns {array of objects}
 */
app.get('/tomorrow', (req, res) => {
    console.log("tomorrow")
    const tomorrow = moment().add(1, "days").format("YYYY-MM-DD").toString()
    const dayAfterTomorrow = moment().add(2, "days").format("YYYY-MM-DD").toString()
    const query = `SELECT id, isComplete, title, deadline FROM todos WHERE deadline >= "${tomorrow}" AND deadline <= "${dayAfterTomorrow}" ORDER BY deadline`
    db.all(query, [], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})

/**
 * filter records >= today
 * @returns {array of objects}
 */
app.get('/future', (req, res) => {
    console.log("today")
    let today = moment().format("YYYY-MM-DD").toString()
    const query = `SELECT id, isComplete, title, deadline FROM todos WHERE deadline >= "${today}" ORDER BY deadline`
    db.all(query, [], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})

/**
 * filter records >= today && incomplete
 * @returns {array of objects}
 */
app.get('/overdue', (req, res) => {
    console.log("overdue")
    let today = moment().format("YYYY-MM-DD").toString()
    const query = `SELECT id, isComplete, title, deadline FROM todos WHERE deadline >= "${today}" AND isComplete LIKE '%false%' ORDER BY deadline`
    db.all(query, [], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})

/**
 * filter records that are marked complete
 * @returns {array of objects}
 */
app.get('/complete', (req, res) => {
    console.log("complete")
    const query = `SELECT id, isComplete, title, deadline FROM todos WHERE isComplete LIKE '%true%' ORDER BY deadline`
    db.all(query, [], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})

/**
 * filter records that are not complete
 * @returns {array of objects}
 */
app.get('/incomplete', (req, res) => {
    console.log("complete")
    const query = `SELECT id, isComplete, title, deadline FROM todos WHERE isComplete LIKE '%false%' ORDER BY deadline`
    db.all(query, [], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})

/**
 * update records by id
 */
app.get('/detail', (req, res) => {
    const id = url.parse(req.url, true).query.id
    if (!id) {
        console.log("no id sent", url.parse(req.url, true))
    }
    const query = `SELECT * FROM todos WHERE id = ?`
    db.get(query, [id], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})


/**
 * update records by id
 */
app.patch('/detail/:id', (req, res) => {
    // db.run("UPDATE table_name where condition");
})

/**
 * create record, no required fields at this point.
 * @returns {id}
 */
app.post('/', (req, res) => {
    if (req.method == "OPTIONS") {
        res.status(200);
        res.send();
      }
    console.log("2 req", req.method, req.body)
   // const data = req;
    //data.id = null;
    // db.run(`INSERT INTO todos VALUES (?, ?, ?, ?, ?)`, [data], (err) => {
    //     if (err) {
    //     return console.log(err.message);
    //     }
    //     console.log(`A row has been inserted with rowid ${this.lastID}`);
    // });
})

