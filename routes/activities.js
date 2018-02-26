var express = require('express');
var router = express.Router();
var mysql = require('../public/javascripts/mysql');
var date = require('date-and-time');
var fitbitDetails = require('./fitbitConfig.json');

var FitbitApiClient = require("fitbit-node");

//create a fitbitConfig.json file with {"id":"","secret":""}
var client = new FitbitApiClient(fitbitDetails.id, fitbitDetails.secret);
var moment = require('moment');


router.get("/activities", function(req, res){

    res.render("activities", {name:req.session.name});
});

router.get('/getStepsByWeek', function (req, res, next) {


    if (req.session.userID == null || typeof req.session.userID == "undefined") {
        res.render('login');
    }
    else {
        var endDate = moment().format('YYYY-MM-DD');
        var startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');

        client.get("/activities/steps/date/"+startDate+"/"+endDate+".json", req.session.accessToken).then(function(results){
            res.send(results[0]);
        });
    }
});

router.get('/getFloorsByWeek', function (req, res, next) {


    if (req.session.userID == null || typeof req.session.userID == "undefined") {
        res.render('login');
    }
    else {
        var endDate = moment().format('YYYY-MM-DD');
        var startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');

        client.get("/activities/floors/date/"+startDate+"/"+endDate+".json", req.session.accessToken).then(function(results){
            res.send(results[0]);
        });
    }
});

router.get('/getDistanceByWeek', function (req, res, next) {

    if (req.session.userID == null || typeof req.session.userID == "undefined") {
        res.render('login');
    }
    else {
        var endDate = moment().format('YYYY-MM-DD');
        var startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');

        client.get("/activities/distance/date/"+startDate+"/"+endDate+".json", req.session.accessToken).then(function(results){
            res.send(results[0]);
        });
    }
});

module.exports = router;