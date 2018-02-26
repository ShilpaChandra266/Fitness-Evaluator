var express = require('express');
var app = express();

var router = express.Router();
var mysql = require('../public/javascripts/mysql');
var date = require('date-and-time');
var fitbitDetails = require('./fitbitConfig.json');

var FitbitApiClient = require("fitbit-node");

//create a fitbitConfig.json file with {"id":"","secret":""}
var client = new FitbitApiClient(fitbitDetails.id, fitbitDetails.secret);

var moment = require('moment');
var convert = require('convert-units');
var schedule = require('node-schedule');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cmpe295b.email.notification@gmail.com',
        pass: 'romincmpe295b'
    }
});

// This will send the email every day at 12 o clock am




var getFitbitData = function (access_token) {
    return new Promise(function (fulfill, reject) {
        console.log("access token: " + access_token);
        var fitbitData = {"heart": "", "activities": "", "sleep": "", "calories": "", "weight": ""};
        // use the access token to fetch the user's profile information
        client.get("/activities/heart/date/today/1d.json", access_token).then(function (results) {

            // res.send(results[0]);
            fitbitData.heart = results[0];
            client.get("/activities/date/today.json", access_token).then(function (results) {
                fitbitData.activities = results[0];
                var now = new Date();
                var now = date.format(now, 'YYYY-MM-DD');
                now += "";
                now = "2017-04-24";

                client.get("/sleep/date/today.json", access_token).then(function (results) {
                    fitbitData.sleep = results[0];
                    client.get("/body/log/weight/date/" + now + "/1d.json", access_token).then(function (results) {
                        fitbitData.weight = results[0];
                        fulfill(fitbitData);
                    });
                });
            });
        }).catch(function (error) {
            console.log("The error: " + error);
            reject();
            res.send(error);
        });
    });
};

var getAccessToken = function (userID) {
    return new Promise(function (fulfill, reject) {
        mysql.handle_database(function (connection) {

            connection.query("SELECT * FROM `Users` WHERE `user_Id` = ?", [userID], function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length > 0) {
                        console.log("in 1")
                        console.log("a: "+rows[0].accesstoken)
                        console.log("r: "+rows[0].refreshtoken)
                        client.refreshAccessToken(rows[0].accesstoken, rows[0].refreshtoken,1800).then(function(token){
                            console.log("in 2: "+token.access_token)
                            fulfill(token.access_token);
                        }) .catch(function (error) {
                            console.log("The error: " + error);

                        });

                    }
                    else {
                        reject();
                    }
                }
                else {
                    res.json({"code": 100, "status": "Error in connection database"});
                    console.log("error: " + err);
                }
            });

            connection.on('error', function (err) {
                console.log("error: " + err);
                res.json({"code": 100, "status": "Error in connection database"});
                res.render("404");
            });
        });
    });
};

var emailDailyReport = function () {

    console.log("Hi there you made it")
    var today = moment().format('YYYY-MM-DD');
    getAccessToken(25).then(function (accessToken) {
        console.log("Test after")
        getFitbitData(accessToken).then(function (fitbitData) {
            console.log("here is this: "+JSON.stringify(fitbitData));
            var data = JSON.parse(JSON.stringify(fitbitData))

            var restingHeartRate = data.heart['activities-heart'][0];

            var activities = data.activities;

            if (typeof activities.summary.distance == "undefined" && activities.summary.distance == undefined)
                activities.summary.distance = 0

            if (typeof restingHeartRate.value.restingHeartRate == "undefined" && restingHeartRate.value.restingHeartRate == undefined)
                restingHeartRate.value.restingHeartRate = "No heart rate data was logged"

            var sleep = data.sleep;

            if (sleep.sleep.length > 0) {
                var hours = parseInt(sleep.sleep[0].minutesAsleep / 60) + " hrs" //since both are ints, you get an int
                var minutes = " and " + sleep.sleep[0].minutesAsleep % 60 + " mins";
            }
            else {
                var hours = "No sleep data was logged" //since both are ints, you get an int
                var minutes = "";
            }


            var mailOptions = {
                from: '"Smart Health Tracker" <cmpe295b.email.notification@gmail.com>', // sender address
                to: 'rominoushana@gmail.com,sreeram.muddu@gmail.com,saigokulteja.koppala@sjsu.edu,saikrishnasrihaar.atyam@sjsu.edu', // list of receivers
                subject: 'Daily Report for ' + today, // Subject line
                html: '<body style="background-color:whitesmoke">' +
                '<h2 style="background-color: lightskyblue;width: 70%;height: 40px;margin: 0;border: 1px solid black;">Daily Statistics for: ' + today + '</h2>' +
                '<table cellspacing="15" width="70%" style="border: 1px solid black; background-color:white">' +

                '<tr style = "background-color:#f2f2f2;">' +
                '<th style ="text-align: left; border-bottom: 1px solid #ddd;">Calories Burned</th>' +
                '<td style="border-bottom: 1px solid #ddd;">' + activities.summary.caloriesOut + '</td>' +
                '</tr>' +

                '<tr>' +
                '<th style ="text-align: left; border-bottom: 1px solid #ddd;">Calories Consumed</th>' +
                '<td style="border-bottom: 1px solid #ddd;">' + '1500' + '</td>' +
                '</tr>' +

                '<tr style = "background-color:#f2f2f2;">' +
                '<th style ="text-align: left; border-bottom: 1px solid #ddd;">Steps</th>' +
                '<td style ="border-bottom: 1px solid #ddd;">' + activities.summary.steps + '</td>' +
                '</tr>' +

                '<tr>' +
                '<th style ="text-align: left; border-bottom: 1px solid #ddd;">Amount of Sleep</th>' +
                '<td style="border-bottom: 1px solid #ddd;">' + hours + minutes + '</td>' +
                '</tr>' +


                '<tr style = "background-color:#f2f2f2;">' +
                '<th style ="text-align: left; border-bottom: 1px solid #ddd;">Distance</th>' +
                '<td style="border-bottom: 1px solid #ddd;">' + activities.summary.distance + ' mi</td>' +
                '</tr>' +

                '<tr>' +
                '<th style ="text-align: left; border-bottom: 1px solid #ddd;">Average Resting Heart Rate</th>' +
                '<td style="border-bottom: 1px solid #ddd;">' + restingHeartRate.value.restingHeartRate + '</td>' +
                '</tr>' +

                '</table>' +

                '</br>' +

                '<h2 style="background-color: lightskyblue;width: 70%;height: 40px;margin: 0;border: 1px solid black;">Daily Recommendations</h2>' +
                '<table cellspacing="15" width="70%" style="border: 1px solid black; background-color:white">' +

                '<p>If you continue keeping up your average of 1700 calories out, you will lose about 2lb this week making you 5lbs closer to your goal </p>' +

                '</body>'
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        });
    });
};

var j = schedule.scheduleJob({hour: 19, minute:42}, function () {
    emailDailyReport();
    console.log("Emailed Report");
});


module.exports = router;