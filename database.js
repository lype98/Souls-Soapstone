const mysql = require('mysql');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'ds3messages'
});

db.connect((err) => {
    if (err) throw err;
    console.log('connected');
});

module.exports.db = db;