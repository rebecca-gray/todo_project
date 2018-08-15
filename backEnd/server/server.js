'use strict';
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware')
const port = process.env.PORT || 5000;
const Crud = require("./crud")
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

const crud = new Crud()

 /**
  * return all records in the db, short format
  * @returns {rows}
  */
 app.get('/all', (req,res,next) => crud.fetchAll(req, res, next))
/**
 * filter records to this day
 * TODO: need to handle time zones vs local time
 * @returns {rows}
 */
app.get('/today', (req,res,next) => crud.fetchToday(req, res, next))

/**
 * filter records to tomorrow
 * TODO: need to handle time zones vs local time
 * @returns {rows}
 */
app.get('/tomorrow', (req,res,next) => crud.fetchTomorrow(req, res, next))

/**
 * filter records >= today
 * @returns {rows}
 */
app.get('/future', (req,res,next) => crud.fetchFuture(req, res, next))

/**
 * filter records >= today && incomplete
 * @returns {rows}
 */
app.get('/overdue', (req,res,next) => crud.fetchOverdue(req, res, next))

/**
 * filter records that are marked complete
 * @returns {rows}
 */
app.get('/complete', (req,res,next) => crud.fetchComplete(req, res, next))

/**
 * filter records that are not complete
 * @returns {rows}
 */
app.get('/incomplete', (req,res,next) => crud.fetchIncomplete(req, res, next))

/**
 * fetch record by id
 * @returns {row}
 */
app.get('/detail', (req,res,next) => crud.fetchDetail(req, res, next))


/**
 * update record by id
 * @returns {rows}
 */
app.put('/todo', (req,res,next) => crud.putTodo(req, res, next))

/**
 * create record, no required fields at this point.
 * @returns {rows}
 */
app.post('/todo', (req,res,next) => crud.postTodo(req, res, next))

/**
 * TODO: since sqlite3 perfers the method del for delete but that does not pass cors
 * I've used put method to handle deletes.
 *
 * @returns {rows}
 */
app.put('/delete', (req,res,next) => crud.delete(req, res, next))

