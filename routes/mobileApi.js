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
var convert = require('convert-units');

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



router.get('/loginMobile', function(req, res, next) {
    mysql.handle_database(function(connection) {
        var email = req.param("email");
        var password = req.param("password");

        connection.query("SELECT * FROM `Users` WHERE `email` = ? AND `password` = ?", [email, password], function(err, rows) {
            connection.release();
            if (!err) {
                if (rows.length > 0) {
                    console.log("Found username and password");
                            req.session.accessToken = rows[0].accesstoken;
                            req.session.userID = rows[0].user_Id;
                            req.session.refreshToken = rows[0].refreshtoken;
                            res.send({
                                "statusCode": 200,
                                "accessToken": rows[0].accesstoken,
                                "userID":rows[0].user_Id
                            });
                } else {
                    res.send({
                        "statusCode": 404
                    });
                }
            } else {
                res.send({
                    "statusCode": 100,
                    "status": "Error in connection database"
                });
                console.log("error: " + err);
            }
        });

        connection.on('error', function(err) {
            console.log("error: " + err);
            res.send({
                "statusCode": 100,
                "status": "Error in connection database"
            });
        });
    });
});


router.get('/getDailyActivityMobile',function(req,res,next){
	console.log("in daily activity");
 var token =  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzU1pXWkciLCJhdWQiOiIyMjg0TFAiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcmFjdCBybG9jIHJ3ZWkgcmhyIHJwcm8gcm51dCByc2xlIiwiZXhwIjoxNDkzOTEyNjQ0LCJpYXQiOjE0OTM4ODM4NDR9.AhpWcLn5fNvxIh56NqjbNUXG63OwG0rM-kAx3nooSOs";
	client.get("/activities/date/today.json",req.param("accessToken")).then(function(results){
		console.log(results[0]);
		res.send({"activities":results[0]});
	});
});



router.get('/getStepsByWeekMobile', function (req, res, next) {
        var endDate = moment().format('YYYY-MM-DD');
        var startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
        var token =  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzU1pXWkciLCJhdWQiOiIyMjg0TFAiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcmFjdCBybG9jIHJ3ZWkgcmhyIHJwcm8gcm51dCByc2xlIiwiZXhwIjoxNDkzOTEyNjQ0LCJpYXQiOjE0OTM4ODM4NDR9.AhpWcLn5fNvxIh56NqjbNUXG63OwG0rM-kAx3nooSOs";
        console.log("in weekly steps");
        client.get("/activities/steps/date/"+startDate+"/"+endDate+".json",req.param("accessToken") ).then(function(results){
            console.log(results[0]);
            res.send(results[0]);
        });
});

router.get('/getCaloriesByWeekMobile', function (req, res, next) {
        var endDate = moment().format('YYYY-MM-DD');
        var startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
        var token =  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzU1pXWkciLCJhdWQiOiIyMjg0TFAiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcmFjdCBybG9jIHJ3ZWkgcmhyIHJwcm8gcm51dCByc2xlIiwiZXhwIjoxNDkzOTEyNjQ0LCJpYXQiOjE0OTM4ODM4NDR9.AhpWcLn5fNvxIh56NqjbNUXG63OwG0rM-kAx3nooSOs";
        console.log("in weekly steps");
        client.get("/activities/calories/date/"+startDate+"/"+endDate+".json",req.param("accessToken")).then(function(results){
            console.log(results[0]);
            res.send(results[0]);
        });
});

router.get('/getWeightByWeekMobile', function (req, res, next) {
        var now = new Date();
        now = date.format(now, 'YYYY-MM-DD');
        now += "";
        var token =  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzU1pXWkciLCJhdWQiOiIyMjg0TFAiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcmFjdCBybG9jIHJ3ZWkgcmhyIHJwcm8gcm51dCByc2xlIiwiZXhwIjoxNDkzOTEyNjQ0LCJpYXQiOjE0OTM4ODM4NDR9.AhpWcLn5fNvxIh56NqjbNUXG63OwG0rM-kAx3nooSOs";
        client.get("/body/log/weight/date/" + now + "/7d.json", req.param("accessToken")).then(function (results) {
            res.send(results[0]);
        });
});

router.get('/getEmergencyContactsMobile', function(req, res, next) {
        mysql.handle_database(function (connection) {

            connection.query("SELECT * FROM EmergencyContacts WHERE user_Id= ?", req.param("userID") , function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
                    res.send(rows);
                }
                else {
                    res.send({"code": 100, "status": "Error in connection database"});
                    console.log("error: " + err);
                }
            });

            connection.on('error', function (err) {
                console.log("error: " + err);
                res.send({"code": 100, "status": "Error in connection database"});
            });

        });
});

router.get('/addContactMobile',function(req,res,next){
    
        mysql.handle_database(function (connection) {
            var phoneNumber = req.param("phoneNumber");
            var name = req.param("name");
            var relation = req.param("relation");
        

            connection.query("INSERT INTO `EmergencyContacts` (`emergency_Id`, `phonenumber`, `name`, `relation`, `user_Id`) VALUES (NULL,'" + phoneNumber + "', '" + name + "', '" + relation + "',"+req.param("userID")+")", function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
                    res.send({"statusCode":200})
                }
                else {
                    res.send({"code": 100, "status": "Error in connection database"});
                    console.log("error: " + err);
                }
            });

            connection.on('error', function (err) {
                res.send({"code": 100, "status": "Error in connection database"});
            });
        });
});

router.get('/updateContactMobile',function(req,res,next){
        mysql.handle_database(function (connection) {

            var phoneNumber = req.param("phoneNumber");
            var name = req.param("name");
            var relation = req.param("relation");
            var emergency_Id = req.param("emergencyId");
            


            connection.query("UPDATE EmergencyContacts SET phonenumber = ?, name = ?, relation = ? WHERE emergency_Id = ?", [phoneNumber, name, relation, emergency_Id], function (err, rows) {
                connection.release();
                if (!err) {
                    res.send({"statusCode":200});
                }
                else {
                    res.send({"code": 100, "status": "Error in connection database"});
                    console.log("error: " + err);
                }
            });

            connection.on('error', function (err) {
                console.log("error: " + err);
                res.send({"code": 100, "status": "Error in connection database"});
            });
        });
});

router.get('/deleteContactMobile',function(req,res,next){
        mysql.handle_database(function (connection) {
            var emergency_Id = req.param("emergencyId");
            connection.query("DELETE FROM `EmergencyContacts` WHERE `emergency_Id`=" + emergency_Id, function (err, rows) {
                connection.release();
                if (!err) {
                    res.send({"statusCode":200});
                }
                else {
                    res.send({"code": 100, "status": "Error in connection database"});
                    console.log("error: " + err);
                }
            });

            connection.on('error', function (err) {
                res.send({"code": 100, "status": "Error in connection database"});
            });
        });
});


router.get('/getProfileMobile', function(req, res, next) {
    console.log(req.param("userID"));
        mysql.handle_database(function (connection) {

            connection.query("SELECT * FROM Users WHERE `user_Id`=?", [req.param("userID")], function (err, rows) {
                connection.release();
                if (!err) {
                    res.send(rows[0]);
                }
                else {
                    res.send({"code": 100, "status": "Error in connection database"});
                    console.log("error: " + err);
                }
            });

            connection.on('error', function (err) {
                console.log("error: " + err);
                res.send({"code": 100, "status": "Error in connection database"});
            });

        });
});


router.get('/updateProfileMobile',function(req,res,next){
        mysql.handle_database(function (connection) {

            var firstName = req.param("firstName");
            var lastName = req.param("lastName");
            var password = req.param("password");
            var phoneNumber = req.param("phoneNumber");
            var height = req.param("height");
            var gender = req.param("gender");


            connection.query("UPDATE Users SET firstname = ?, lastname = ?, password = ? , phonenumber = ?, height = ?, gender = ? WHERE user_Id = ?", [firstName,lastName,password, phoneNumber, height, gender, req.param("userID")], function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
                    res.send({"statusCode":200});
                }
                else {
                    res.send({"code": 100, "status": "Error in connection database"});
                    console.log("error: " + err);
                }
            });

            connection.on('error', function (err) {
                console.log("error: " + err);
                res.send({"code": 100, "status": "Error in connection database"});
            });
        });
});

//Logging weight
router.get('/logWeightMobile', function (req, res, next) {
        var date = req.param("date");
        var weight = req.param("weight");
        weight = parseFloat(weight * 0.453592);
        var token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzU1pXWkciLCJhdWQiOiIyMjg0TFAiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcmFjdCBybG9jIHJ3ZWkgcmhyIHJwcm8gcm51dCByc2xlIiwiZXhwIjoxNDkzOTEyNjQ0LCJpYXQiOjE0OTM4ODM4NDR9.AhpWcLn5fNvxIh56NqjbNUXG63OwG0rM-kAx3nooSOs";
        client.post("/body/log/weight.json", req.param("accessToken"),{"weight":weight,"date":date}).then(function (results) {
            res.send(res.send({"statusCode":200}));
        });
});


router.get('/updateGoalsMobile', function (req, res, next) {
        var distance = req.param("distance");
        var floors = req.param("floors");
        var caloriesOut = req.param("caloriesOut");
        var steps = req.param("steps");
        var goals = {};
        goals.caloriesOut = caloriesOut;
        goals.steps = steps;
        goals.floors = floors;
        goals.distance = distance;
        client.post("/activities/goals/daily.json", req.param("accessToken"),{"goals":goals}).then(function (results) {
            console.log(results[0]);
            res.send({"statusCode":200});
        });
});




router.get('/heartDisease',function(req,res,next){
    res.render('heartDisease',{"name": "Bob Josh"});
});

router.get('/diabetes',function(req,res,next){
    res.render('diabetes',{"name": "Bob Josh"});
});

router.get('/logFoodMobile', function (req, res, next) {
    const dates = getDates();

        var food_name = req.param("foodName");
        var amount = req.param("serving")
        var calories = (req.param("calories")) * amount;


        mysql.handle_database(function (connection) {

            connection.query("INSERT INTO `Food` (`food_name`, `time_consumed`, `amount`, `calories`, `fat`,`fiber`, `carbs`, `sodium`, `protein`, `date`, `user_id`) VALUES ('" + food_name + "', ' ', '" + amount + "', '" + calories + "', '', '', '', '', '', '" +dates.today+"', '"+ req.param("userID") + "')", function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
                    res.send({"statusCode":200});
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
});

router.get('/getCaloriesConsumedMobile', function(req, res, next) {
    console.log(req.param("userID"));
        mysql.handle_database(function (connection) {
             const dates = getDates();
             console.log("today date is" + dates.today);
             console.log(req.param("userID"));

            connection.query("SELECT sum(calories) as totalCaloriesConsumed FROM Food WHERE `user_Id`=? AND `date`=? ", [req.param("userID"), dates.today], function (err, rows) {
                connection.release();
                if (!err) {
                    console.log(rows[0]);
                    res.send(rows[0]);
                }
                else {
                    res.send({"code": 100, "status": "Error in connection database"});
                    console.log("error: " + err);
                }
            });

            connection.on('error', function (err) {
                console.log("error: " + err);
                res.send({"code": 100, "status": "Error in connection database"});
            });

        });
});



module.exports = router;

