/**
 * Created by rominoushana on 2/26/17.
 */
var express = require('express');
var router = express.Router();
var mysql     =    require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'fitness',
    debug    :  false
});

exports.handle_database = function(callback){

    pool.getConnection(function(err,connection){
        if (err) {
            console.log("the error is: "+err)
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);
        return callback(connection);
        // connection.query("select * from user",function(err,rows){
        //     connection.release();
        //     if(!err) {
        //         res.json(rows);
        //     }
        // });
        //
        // connection.on('error', function(err) {
        //     res.json({"code" : 100, "status" : "Error in connection database"});
        //     return;
        // });
    });
};