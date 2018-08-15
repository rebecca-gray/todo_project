const moment = require('moment');
class Todo {
    /**
     * create table if not exists
     * @param {database}
     */
    static createTable (db) {
        return db.serialize(() => {
            db.run("CREATE TABLE if not exists todos (id INTEGER PRIMARY KEY, isComplete TEXT, title TEXT, body TEXT, deadline TEXT)");
            // const stmt = db.prepare("INSERT INTO todos VALUES (?, ?, ?, ?, ?)");
            //  stmt.run(null, 'true', 'Concert', 'La Traviata with Seamus', '2018-08-18')
            //  stmt.run(null, 'false', 'Birthday Party', 'Aidan turns 9', '2018-08-23')
            //  stmt.run(null, 'false', 'Extreme', 'Swim The English Channel', '2018-08-01')
            //  stmt.finalize();

            db.each("SELECT * FROM todos", function(err, row) {
                console.log(row.id + ": " + row.body);
            });
        });
    }

     /**
     * return all records in the db, short format
     * @returns {String}
     */
    static getAllQuery () {
        return `SELECT id, isComplete, title, deadline FROM todos ORDER BY deadline`
    }
     /**
     * filter records to this day
     * TODO: need to handle time zones vs local time
     * @returns {String}
     */
    static getTodayQuery () {
        let today = moment().format("YYYY-MM-DD").toString()
        const tomorrow = moment().add(1, "days").format("YYYY-MM-DD").toString()
        return `SELECT id, isComplete, title, deadline FROM todos WHERE deadline >= "${today}" AND deadline <= "${tomorrow}"`
    }

    /**
     * filter records to tomorrow
     * TODO: need to handle time zones vs local time
     * @returns {String}
     */
    static getTomorrowQuery () {
        const tomorrow = moment().add(1, "days").format("YYYY-MM-DD").toString()
        const dayAfterTomorrow = moment().add(2, "days").format("YYYY-MM-DD").toString()
        return `SELECT id, isComplete, title, deadline FROM todos WHERE deadline >= "${tomorrow}" AND deadline <= "${dayAfterTomorrow}" ORDER BY deadline`
    }

     /**
     * filter for records in the future
     * TODO: need to handle time zones vs local time
     * @returns {String}
     */
    static getFutureQuery () {
        let today = moment().format("YYYY-MM-DD").toString()
        return `SELECT id, isComplete, title, deadline FROM todos WHERE deadline >= "${today}" ORDER BY deadline`
    }

     /**
     * filter for records  that are overdue
     * TODO: need to handle time zones vs local time
     * @returns {String}
     */
    static getOverdueQuery () {
        let today = moment().format("YYYY-MM-DD").toString()
        return `SELECT id, isComplete, title, deadline FROM todos WHERE deadline <= "${today}" AND isComplete LIKE '%false%' ORDER BY deadline`
    }
    /**
     * filter for records  that are complete
     * TODO: need to handle time zones vs local time
     * @returns {String}
     */
    static getCompleteQuery () {
        return `SELECT id, isComplete, title, deadline FROM todos WHERE isComplete LIKE '%true%' ORDER BY deadline`
    }
      /**
     * filter for records  that are incomplete
     * TODO: need to handle time zones vs local time
     * @returns {String}
     */
    static getIncompleteQuery () {
        return `SELECT id, isComplete, title, deadline FROM todos WHERE isComplete LIKE '%false%' ORDER BY deadline`
    }
      /**
     * find a single full record from an id
     * TODO: need to handle time zones vs local time
     * @returns {String}
     */
    static getDetailQuery (id) {
        return `SELECT * FROM todos WHERE id = ?`
    }

    static getFieldList (req) {
        return [req.isComplete, req.title, req.body, req.deadline, req.id];
    }

    static getUpdateQuery () {
        return "UPDATE todos SET isComplete=?, title=?, body=?, deadline=? WHERE id= ?"
    }

    static getDeleteQuery () {
        return `DELETE FROM todos WHERE id=?`
    }
};

module.exports = Todo;

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