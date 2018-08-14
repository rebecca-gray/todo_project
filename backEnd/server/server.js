'use strict';
const sqlite3 = require('sqlite3').verbose();
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware')
const port = process.env.PORT || 5000;
const moment = require('moment');
const url = require('url');
const app = restify.createServer({
    name: "todoApp",
    version: "1.0.0"
});

app.use(restify.plugins.acceptParser(app.acceptable));
app.use(restify.plugins.queryParser());
app.use(restify.plugins.bodyParser());

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['http://localhost:8080', /^http?:\/\/localhost:8080(:[\d]+)?$/,
    'http://localhost:5000', /^http?:\/\/localhost:5000(:[\d]+)?$/,  /^http?:\/\/localhost:5000$/],
  })

app.listen(port, () => {
    console.log(`todoApp listening on port ${port}!`);
});

app.pre(cors.preflight)
app.use(cors.actual)

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
//   var stmt = db.prepare("INSERT INTO todos VALUES (?, ?, ?, ?, ?)");
//    stmt.run(null, 'true', 'Concert', 'La Traviata with Seamus', '2018-08-18')
//    stmt.run(null, 'false', 'Birthday Party', 'Aidan turns 9', '2018-08-23')
//    stmt.run(null, 'false', 'Extreme', 'Swim The English Channel', '2018-08-01')
//    stmt.finalize();

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
    const query = `SELECT id, isComplete, title, deadline FROM todos WHERE deadline <= "${today}" AND isComplete LIKE '%false%' ORDER BY deadline`
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
    console.log("GET detail",id)
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
app.put('/todo', (req, res) => {
    console.log("put body", req.body)
    let data = [req.body.isComplete, req.body.title, req.body.body, req.body.deadline];
    let id = req.body.id;
    db.run("UPDATE todos SET isComplete=?, title=?, body=?, deadline=? WHERE id=?",data, (err,rows) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) updated: ${this.changes}`);
        const query = `SELECT id, isComplete, title, deadline FROM todos ORDER BY deadline`
        db.all(query, [], function(err, rows){
            if (err) {
                console.log("ERR", err)
            }
            res.json(rows);
        });
    });

})

/**
 * create record, no required fields at this point.
 * @returns {id}
 */
app.post('/todo', (req, res) => {
    console.log("POST todo")
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

