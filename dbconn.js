const mysql = require('mysql');

const config = {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'homepage',
}

const pool = mysql.createPool(config);

function getCon(callback){
    pool.getConnection(function(err,connection){
        callback(err,connection);
    });
}

module.exports = getCon;