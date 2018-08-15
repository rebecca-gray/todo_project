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

