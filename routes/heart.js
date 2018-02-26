var express = require('express');
var router = express.Router();
var mysql = require('../public/javascripts/mysql');
var moment = require('moment');
var fitbitDetails = require('./fitbitConfig.json');

var FitbitApiClient = require("fitbit-node");

//create a fitbitConfig.json file with {"id":"","secret":""}
var client = new FitbitApiClient(fitbitDetails.id, fitbitDetails.secret);


var yesterday =  moment().subtract(14,"days").format('YYYY-MM-DD');

router.get('/heart',function(req,res,next) {



    if (req.session.userID == null || typeof req.session.userID == "undefined") {
         console.log("hi")
         res.render('login');
     }
     else {
        console.log('Reached heart api to get details');




        const heartUrl = "/activities/heart/date/"+yesterday+"/1d.json";

       // console.log("*********************************"+heartUrl+"****************************************");
        //"/activities/heart/date/2017-04-08/1d.json"

        client.get(heartUrl, req.session.accessToken).then(function (results) {
          //console.log(JSON.stringify(results[0]));

            var key = "activities-heart-intraday";
            console.log(JSON.stringify(results[0][key].dataset));

            //var object = JSON.stringify(results[1]);


        });

        res.render('heart');

    }
});


router.get('/heartData',function(req,res,next){


    if (req.session.userID == null || typeof req.session.userID == "undefined") {
        console.log("hi")
        res.render('login');
    }
    else {
        console.log('Reached heart api to get details');


        const heartUrl = "/activities/heart/date/" + yesterday + "/1d.json";

        //console.log("*********************************" + heartUrl + "****************************************");
        //"/activities/heart/date/2017-04-08/1d.json"

        client.get(heartUrl, req.session.accessToken).then(function (results) {
            //console.log(JSON.stringify(results[0]['activities-heart'][1]['restingHeartRate']));

            var key = "activities-heart-intraday";

            //console.log(results[0]['activities-heart'][0].value.heartRateZones);
            //console.log(JSON.stringify(results[0][key].dataset));

            //var object = JSON.stringify(results[1]);

            var data={

                zones:results[0]['activities-heart'][0].value.heartRateZones,
                dataset:results[0][key].dataset,
                date:yesterday
            }

        res.send(data);


        });
    }

    });

module.exports=router;

