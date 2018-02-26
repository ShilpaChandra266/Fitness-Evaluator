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

function getDates()
{
    var today = moment().format('YYYY-MM-DD');
    var weekBack =  moment().subtract(7,"days").format('YYYY-MM-DD');

    console.log("******Today*****");
    console.log(today);

    console.log("*****Week Back****");
    console.log(weekBack);


    return {
        today:today,
        weekBack:weekBack
    }
}


/* GET calories page. */
router.get('/calories', function (req, res, next) {
    const dates = getDates();

    if (req.session.userID == null || typeof req.session.userID == "undefined") {
        console.log("hi")
        res.render('login');
    }
    else {
        var now = new Date();
        now = date.format(now, 'YYYY-MM-DD');
        var totalCaloriesIn = {};
        now += "";
        client.get("/activities/calories/date/" + now + "/7d.json", req.session.accessToken).then(function (results) {
            var calories = results[0]["activities-calories"];

        client.get("/body/log/weight/date/" + now + "/7d.json", req.session.accessToken).then(function (results) {
            mysql.handle_database(function(connection) {

                var email = req.body.username;
                var password = req.body.password;

                console.log("email: "+email);
                console.log("password: "+password);
                console.log("fu : "+date.today);


                connection.query("SELECT * FROM `Food` WHERE `date` > DATE_SUB(NOW(), INTERVAL 1 WEEK) AND `user_id` = ?", [req.session.userID],function(err,rows){
                    connection.release();
                    if(!err) {
                        console.log("length: "+rows.length);
                        if(rows.length>0)
                        {
                            var totalCaloriesOut=0;

                            //calculate the total calories out for today
                            var caloriesIn=0;
                            for(var a = 0; a<rows.length;a++){
                                if(rows[a].calories=="")
                                    rows[a].calories = 0;
                                console.log("row cal1: "+rows[a].calories);
                                var cal = parseInt(rows[a].calories)
                                console.log("row cals: "+cal);

                                caloriesIn+=cal
                            }

                            totalCaloriesIn["today"]= caloriesIn;

                            // totalCaloriesIn = JSON.stringify(totalCaloriesIn);

                            console.log("calories In: "+ caloriesIn);
                            console.log("calories In: "+ totalCaloriesIn);
                            console.log("calories In array: "+ totalCaloriesIn["today"]);

                            var weight = results[0].weight;

                            var tempWeightChange = 0
                            var weightChange = 0;

                            console.log("body weight: "+JSON.stringify(results[0]))


                            for(var i = 0; i<calories.length; i++){
                                totalCaloriesOut+=parseInt(calories[i].value);
                            }

                            var weightArray = [];
                            var weightDateArray = [];

                            if(weight.length>0) {

                                //Convert the kg to lbs
                                for (var i = 0; i < weight.length; i++) {
                                    var temp = parseFloat(weight[i].weight);
                                    weight[i].weight = convert(temp).from('kg').to('lb')
                                    weight[i].weight = parseInt(weight[i].weight) + 1;
                                    weightArray.push(weight[i].weight);
                                    weightDateArray.push(weight[i].date);
                                }

                                weightChange = weight[weight.length - 1].weight - weight[0].weight;
                                console.log("Total calories out: " + weight[0].weight);
                                console.log("Total calories out: " + weight[0].date);
                            }

                            res.render('calories', {calories: calories, weight: weight, weightArray: weightArray, weightDateArray: weightDateArray, weightChange:weightChange, startDate: dates.weekBack, endDate: dates.today, totalCaloriesOut:totalCaloriesOut,totalCaloriesIn:totalCaloriesIn,name:req.session.name});
                        }
                        else
                        {
                            var totalCaloriesOut=0;

                            var weight = results[0].weight;

                            var tempWeightChange = 0
                            var weightChange = 0;

                            console.log("body weight: "+JSON.stringify(results[0]))


                            for(var i = 0; i<calories.length; i++){
                                totalCaloriesOut+=parseInt(calories[i].value);
                            }

                            var weightArray = [];
                            var weightDateArray = [];

                            if(weight.length>0) {

                                //Convert the kg to lbs
                                for (var i = 0; i < weight.length; i++) {
                                    var temp = parseFloat(weight[i].weight);
                                    weight[i].weight = convert(temp).from('kg').to('lb')
                                    weight[i].weight = parseInt(weight[i].weight) + 1;
                                    weightArray.push(weight[i].weight);
                                    weightDateArray.push(weight[i].date);
                                }

                                weightChange = weight[weight.length - 1].weight - weight[0].weight;
                                console.log("Total calories out: " + weight[0].weight);
                                console.log("Total calories out: " + weight[0].date);
                            }
                            res.render('calories', {calories: calories, weight: weight, weightArray: weightArray, weightDateArray: weightDateArray, weightChange:weightChange, startDate: dates.weekBack, endDate: dates.today, totalCaloriesOut:totalCaloriesOut, totalCaloriesIn:totalCaloriesOut, name:req.session.name});
                        }
                    }
                    else{
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        console.log("error: "+err);
                    }
                });

                connection.on('error', function(err) {
                    console.log("error: "+err);
                    res.json({"code" : 100, "status" : "Error in connection database"});
                    res.render("404");
                });
            });

        });
        });
    }
    });

module.exports = router;