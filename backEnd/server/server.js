'use strict';
const sqlite3 = require('sqlite3').verbose();
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware')
const port = process.env.PORT || 5000;
const url = require('url');
const Todo = require("./todo");
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


Todo.createTable(db);

 /**
  * return all records in the db, short format
  * @returns {rows}
  */
app.get('/all', (req, res) => {
    const query = Todo.getAllQuery()
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
 * @returns {rows}
 */
app.get('/today', (req, res) => {
    console.log("today")
    const query = Todo.getTodayQuery();
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
 * @returns {rows}
 */
app.get('/tomorrow', (req, res) => {
    console.log("tomorrow")
    const query = Todo.getTomorrowQuery()
    db.all(query, [], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})

/**
 * filter records >= today
 * @returns {rows}
 */
app.get('/future', (req, res) => {
    console.log("today")
    const query = getFutureQuery()
    db.all(query, [], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})

/**
 * filter records >= today && incomplete
 * @returns {rows}
 */
app.get('/overdue', (req, res) => {
    console.log("overdue")
    const query = Todo.getOverdueQuery()
     db.all(query, [], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})

/**
 * filter records that are marked complete
 * @returns {rows}
 */
app.get('/complete', (req, res) => {
    console.log("complete")
    const query = Todo.getCompleteQuery();
    db.all(query, [], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})

/**
 * filter records that are not complete
 * @returns {rows}
 */
app.get('/incomplete', (req, res) => {
    console.log("complete")
    const query = Todo.getIncompleteQuery()
    db.all(query, [], function(err, rows){
        if (err) {
            console.log("ERR", err)
        }
        res.json(rows);
    });
})

/**
 * update records by id
 * @returns {row}
 */
app.get('/detail', (req, res) => {
    const id = url.parse(req.url, true).query.id
    console.log("GET detail",id)
    if (!id) {
        console.log("no id sent", url.parse(req.url, true))
    }
    const query = Todo.getDetailQuery(id)
    db.get(query, [id], function(err, rows){
        if (err) {
            return console.log("ERR", err)
        }
        res.json(rows);
    });
})


/**
 * update records by id
 * @returns {rows}
 */
app.put('/todo', (req, res) => {
    let data = Todo.getFieldList(req.body)
    const query = Todo.getUpdateQuery()
    console.log("PUT", req.body)

    Promise.resolve(db.run(query, data, (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        return rows;
    })).then((rows) => {
        const query = Todo.getAllQuery()
        db.all(query, [], function(err, rows){
            if (err) {
                return console.log("ERR", err)
            }
            res.json(rows);
        });
    });
})

/**
 * create record, no required fields at this point.
 * @returns {rows}
 */
app.post('/todo', (req, res) => {
    console.log("POST todo")
    const stmt = db.prepare("INSERT INTO todos VALUES (?, ?, ?, ?, ?)");
    stmt.run(null, `${req.body.isComplete}`, `${req.body.title}`, `${req.body.body}`, `${req.body.deadline}`)
    Promise.resolve(stmt.finalize()
    ).then((changes) => {
        console.log("getAll", changes)
        const query = Todo.getAllQuery()
        db.all(query, [], function(err, rows){
            if (err) {
                return console.log("ERR", err)
            }
            res.json(rows);
        });
    });
})

app.del('/todo', (req, res) => {
    console.log("delete")
    const id = url.parse(req.url, true).query.id
    console.log("delete",id)
    if (!id) {
        return console.log("no id sent", url.parse(req.url, true))
    }
    const query = Todo.getDeleteQuery()
    Promise.resolve(db.run(query, [id], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        return rows;
    })).then((rows) => {
        const query = Todo.getAllQuery()
        db.all(query, [], function(err, rows){
            if (err) {
                return console.log("ERR", err)
            }
            res.json(rows);
        });
    });
})

