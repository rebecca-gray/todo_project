const sqlite3 = require('sqlite3').verbose();
const error = require('restify-errors');
const Todo = require("./todo");
const url = require('url');

const db = new sqlite3.Database('todoApp', (err) => {
    if (err) {
        return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
    }
    console.log('Connected to SQlite database.');
});
module.exports = {
    fetchAll : (req, res, next) => {
        const query = Todo.getAllQuery()
        db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    },

    fetchToday : (req, res, next) => {
        const query = Todo.getTodayQuery();
        db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    },

    fetchTomorrow: (req, res, next) => {
        const query = Todo.getTomorrowQuery()
        db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    },

    fetchFuture: (req, res, next) => {
        const query = Todo.getFutureQuery()
        db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    },

    fetchOverdue: (req, res, next) => {
        const query = Todo.getOverdueQuery()
         db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    },

    fetchComplete: (req, res, next) => {
        const query = Todo.getCompleteQuery();
        db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    },

    fetchIncomplete: (req, res, next) => {
        const query = Todo.getIncompleteQuery()
        db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    },

    fetchDetail: (req, res, next) => {
        const id = url.parse(req.url, true).query.id
        if (!id) {
            return next(new error.BadRequestError({ message: "The Item you're looking for was not found, sorry.", status: 404}))
        }
        const query = Todo.getDetailQuery(id)
        db.get(query, [id], function(err, rows){
            if (err) {
                return next(new error.NotFoundException())
            }
            res.json(rows);
        });
    },

    putTodo: (req, res, next) => {
        let data = Todo.getFieldList(req.body)
        const query = Todo.getUpdateQuery()
        Promise.resolve(db.run(query, data, (err, rows) => {
            if (err) {
                return next(new error.BadRequestError({ message: "The Todo you sent was not saved, sorry.", status: 404}))
            }
            return rows;
        })).then((rows) => {
            const query = Todo.getAllQuery()
            db.all(query, [], function(err, rows){
                if (err) {
                    return next(new error.NotFoundException())
                }
                res.json(rows);
                return next()
            });
        });
    },

    postTodo: (req, res, next) => {
        const stmt = db.prepare("INSERT INTO todos VALUES (?, ?, ?, ?, ?)");
        stmt.run(null, `${req.body.isComplete}`, `${req.body.title}`, `${req.body.body}`, `${req.body.deadline}`)
        Promise.resolve(stmt.finalize()
        ).then((changes) => {
            const query = Todo.getAllQuery()
            db.all(query, [], function(err, rows){
                if (err) {
                    return next(new error.BadRequestError({ message: "The Todo you sent was not created, sorry.", status: 404}))
                }
                res.json(rows);
                return next()
            });
        });
    },

    delete: (req, res, next) => {
        const id = url.parse(req.url, true).query.id
        if (!id) {
            return next(new error.NotFoundException())
        }
        const query = Todo.getDeleteQuery()
        Promise.resolve(db.run(query, [id], (err, rows) => {
            if (err) {
                return next(new error.BadRequestError({ message: "The Todo you sent was not deleted, sorry.", status: 404}))
            }
            return rows;
        })).then((rows) => {
            const query = Todo.getAllQuery()
            db.all(query, [], function(err, rows){
                if (err) {
                    return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
                }
                res.json(rows);
                return next()
            });
        });
    }

}