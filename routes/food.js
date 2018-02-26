var express = require('express');
var router = express.Router();
var mysql = require('../public/javascripts/mysql');
var bodyMassIndex = require('body-mass-index');
var date = require('date-and-time');
var fitbitDetails = require('./fitbitConfig.json');

var FitbitApiClient = require("fitbit-node");

//create a fitbitConfig.json file with {"id":"","secret":""}
var client = new FitbitApiClient(fitbitDetails.id, fitbitDetails.secret);
var moment = require('moment');
var convert = require('convert-units')

function getDates() {
    var today = moment().format('YYYY-MM-DD');
    var weekBack = moment().subtract(7, "days").format('YYYY-MM-DD');

    console.log("******Today*****");
    console.log(today);

    console.log("*****Week Back****");
    console.log(weekBack);


    return {
        today: today,
        weekBack: weekBack
    }
}


/* GET calories page. */
router.get('/food', function (req, res, next) {
    const dates = getDates();

    if (req.session.userID == null || typeof req.session.userID == "undefined") {
        console.log("hi")
        res.render('login');
    }
    else {
        res.render('food', {name: req.session.name});
    }
});

router.post('/addFood', function (req, res, next) {
    const dates = getDates();

    console.log("here is req.data " + JSON.stringify(req.body.data));
    if (req.session.userID == null || typeof req.session.userID == "undefined") {
        console.log("hi")
        res.render('login');
    }
    else {

        //Parsing the data that is being from the ajax post

        var key = req.body.data;
        key = key.split("&");

        var food_name = key[0].split("=")[1];
        var time_consumed = key[1].split("=")[1];
        var amount = key[2].split("=")[1];
        var calories = key[3].split("=")[1];
        var fat = key[4].split("=")[1];
        var fiber = key[5].split("=")[1];
        var carbs = key[6].split("=")[1];
        var sodium = key[7].split("=")[1];
        var protein = key[8].split("=")[1];


        mysql.handle_database(function (connection) {

            console.log("Sql statement: " + "INSERT INTO 'Food' ('food_name', 'time_consumed', 'amount', 'calories', 'fat','fiber', 'carbs', 'sodium', 'protein', 'd 'user_id') VALUES ('" + food_name + "', '" + time_consumed + "', '" + amount + "', '" + calories + "', '" + fat + "', '" + fiber + "', '" + carbs + "', '" + sodium + "', '" + protein + "', '" + req.session.userID + "')")

            connection.query("INSERT INTO `Food` (`food_name`, `time_consumed`, `amount`, `calories`, `fat`,`fiber`, `carbs`, `sodium`, `protein`, `date`, `user_id`) VALUES ('" + food_name + "', '" + time_consumed + "', '" + amount + "', '" + calories + "', '" + fat + "', '" + fiber + "', '" + carbs + "', '" + sodium + "', '" + protein + "', '" +dates.today+"', '"+ req.session.userID + "')", function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
                    res.redirect("/food");
                }
                else {
                    res.json({"code": 100, "status": "Error in connection database"});
                    console.log("error: " + err);
                }
            });

            connection.on('error', function (err) {
                console.log("error: " + err);
                res.json({"code": 100, "status": "Error in connection database"});
                res.render("404", {error: err});
            });
        });
    }
});

router.get('/getFood', function (req, res, next) {

    if (req.session.userID == null) {
        res.render('login')
    }
    else {
        mysql.handle_database(function (connection) {

            connection.query("SELECT * FROM Food WHERE user_Id= ?", [req.session.userID], function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("food rows are: " + JSON.stringify(rows));
                    res.send(JSON.stringify(rows));
                }
                else {
                    res.json({"code": 100, "status": "Error in connection database"});
                    console.log("error: " + err);
                }
            });

            connection.on('error', function (err) {
                console.log("error: " + err);
                res.json({"code": 100, "status": "Error in connection database"});
                res.render("404", {error: err});
            });

        });
    }
});

router.post('/logWeight', function (req, res, next) {
    if (req.session.userID == null) {
        res.render('login')
    }
    else {
        mysql.handle_database(function (connection) {

            var weight = req.body.weight;
            console.log("Inside route is phoneNumber: " + weight);

            // converting pounds to kg
            weight = convert(weight).from('lb').to('kg')

            console.log("date: " + JSON.stringify(getDates()));

            var dates = getDates();

            connection.query("UPDATE Users SET weight = ? WHERE user_Id = ?", [weight, req.session.userID], function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
                    client.post("/body/log/weight.json", req.session.accessToken, {
                        weight: weight,
                        date: dates.today
                    }).then(function (results) {
                        res.redirect("/food");

                    }).catch(function (error) {
                        console.log("The error: " + error);
                        res.send(error);
                    });
                }
                else {
                    res.json({"code": 100, "status": "Error in connection database"});
                    console.log("error: " + err);
                }
            });

            connection.on('error', function (err) {
                console.log("error: " + err);
                res.json({"code": 100, "status": "Error in connection database"});
                res.render("404", {error: err});
            });
        });
    }
});

module.exports = router;