'use strict';
const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware')
const port = process.env.PORT || 5000;
const crud = require("./crud")
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

 /**
  * return all records in the db, short format
  * @returns {rows}
  */
app.get('/all', crud.fetchAll)

/**
 * filter records to this day
 * TODO: need to handle time zones vs local time
 * @returns {rows}
 */
app.get('/today', crud.fetchToday)

/**
 * filter records to tomorrow
 * TODO: need to handle time zones vs local time
 * @returns {rows}
 */
app.get('/tomorrow', crud.fetchTomorrow)

/**
 * filter records >= today
 * @returns {rows}
 */
app.get('/future', crud.fetchFuture)

/**
 * filter records >= today && incomplete
 * @returns {rows}
 */
app.get('/overdue', crud.fetchOverdue)

/**
 * filter records that are marked complete
 * @returns {rows}
 */
app.get('/complete', crud.fetchComplete)

/**
 * filter records that are not complete
 * @returns {rows}
 */
app.get('/incomplete', crud.fetchIncomplete)

/**
 * fetch record by id
 * @returns {row}
 */
app.get('/detail', crud.fetchDetail)


/**
 * update record by id
 * @returns {rows}
 */
app.put('/todo', crud.putTodo)

/**
 * create record, no required fields at this point.
 * @returns {rows}
 */
app.post('/todo', crud.postTodo)

/**
 * TODO: since sqlite3 perfers the method del for delete but that does not pass cors
 * I've used put method to handle deletes.
 *
 * @returns {rows}
 */
app.put('/delete', crud.delete)

