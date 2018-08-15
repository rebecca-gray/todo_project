const sqlite3 = require('sqlite3').verbose();
const error = require('restify-errors');
const Todo = require("./todo");
const url = require('url');

class Crud {
    constructor () {
        this.db = new sqlite3.Database('todoApp', (err) => {
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            console.log('Connected to SQlite database.');
        });
        this.db.serialize(() => {
            this.db.run("CREATE TABLE if not exists todos (id INTEGER PRIMARY KEY, isComplete TEXT, title TEXT, body TEXT, deadline TEXT)");
            const stmt = this.db.prepare("INSERT INTO todos VALUES (?, ?, ?, ?, ?)");
            stmt.run(null, 'false', 'Create A Task', 'Something fun to do!', '2018-08-18');
            stmt.finalize();

            this.db.each("SELECT * FROM todos", function(err, row) {
                console.log(row.id + ": " + row.body);
            });
        });
    }

    fetchAll(req, res, next) {
        const query = Todo.getAllQuery()
        this.db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    }

    fetchToday(req, res, next) {
        const query = Todo.getTodayQuery();
        this.db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    }

    fetchTomorrow(req, res, next) {
        const query = Todo.getTomorrowQuery()
        this.db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    }

    fetchFuture(req, res, next) {
        const query = Todo.getFutureQuery()
        this.db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    }

    fetchOverdue(req, res, next) {
        const query = Todo.getOverdueQuery()
         this.db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    }

    fetchComplete(req, res, next) {
        const query = Todo.getCompleteQuery();
        this.db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    }

    fetchIncomplete(req, res, next) {
        const query = Todo.getIncompleteQuery()
        this.db.all(query, [], function(err, rows){
            if (err) {
                return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
            }
            res.json(rows);
            return next()
        });
    }

    fetchDetail(req, res, next) {
        const id = url.parse(req.url, true).query.id
        if (!id) {
            return next(new error.BadRequestError({ message: "The Item you're looking for was not found, sorry.", status: 404}))
        }
        const query = Todo.getDetailQuery(id)
        this.db.get(query, [id], function(err, rows){
            if (err) {
                return next(new error.NotFoundException())
            }
            res.json(rows);
        });
    }

    putTodo(req, res, next) {
        let data = Todo.getFieldList(req.body)
        const query = Todo.getUpdateQuery()
        Promise.resolve(this.db.run(query, data, (err, rows) => {
            if (err) {
                return next(new error.BadRequestError({ message: "The Todo you sent was not saved, sorry.", status: 404}))
            }
            return rows;
        })).then((rows) => {
            const query = Todo.getAllQuery()
            this.db.all(query, [], function(err, rows){
                if (err) {
                    return next(new error.NotFoundException())
                }
                res.json(rows);
                return next()
            });
        });
    }

    postTodo(req, res, next) {
        const stmt = this.db.prepare("INSERT INTO todos VALUES (?, ?, ?, ?, ?)");
        stmt.run(null, `${req.body.isComplete}`, `${req.body.title}`, `${req.body.body}`, `${req.body.deadline}`)
        Promise.resolve(stmt.finalize()
        ).then((changes) => {
            const query = Todo.getAllQuery()
            this.db.all(query, [], function(err, rows){
                if (err) {
                    return next(new error.BadRequestError({ message: "The Todo you sent was not created, sorry.", status: 404}))
                }
                res.json(rows);
                return next()
            });
        });
    }

    delete(req, res, next) {
        const id = url.parse(req.url, true).query.id
        if (!id) {
            return next(new error.NotFoundException())
        }
        const query = Todo.getDeleteQuery()
        Promise.resolve(this.db.run(query, [id], (err, rows) => {
            if (err) {
                return next(new error.BadRequestError({ message: "The Todo you sent was not deleted, sorry.", status: 404}))
            }
            return rows;
        })).then((rows) => {
            const query = Todo.getAllQuery()
            this.db.all(query, [], function(err, rows){
                if (err) {
                    return next(new error.BadRequestError({ message: "The Database is out of order, sorry.", status: 500}))
                }
                res.json(rows);
                return next()
            });
        });
    }
}

module.exports = Crud
