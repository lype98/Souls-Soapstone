require('dotenv').config();
const mysql = require('mysql');
const offline = false;
let db;

if(offline) {    
    db = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'ds3messages'
    });
    
    db.connect((err) => {
        if (err) throw err;
        console.log('connected offline');        
    });    
} else {    
    const password = process.env.DB_PASS;    
    db = mysql.createPool({
        connectionLimit : 10,
        host: 'eu-cdbr-west-03.cleardb.net',
        user: 'b95a0817e5cfc9',
        password: password,    
        port: 3306,
        database: 'heroku_b1ff4b30118dcfb'
    });

    db.getConnection(function(err, connection){        
        if(err){
            return cb(err);
        }        
        console.log('connected online');                
    });       
};

module.exports.db = db;

