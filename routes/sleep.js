var express = require('express');
var router = express.Router();
var mysql = require('../public/javascripts/mysql');
var moment = require('moment');

var datesKeys=[];
var dailySleep={};
var dailySleepTime=[];
var dailyRestless={};
var dailyRestlessTime=[];

function getDates()
{
    datesKeys=[];
    dailySleep={};
    dailyRestless={};
    var today = moment().format('YYYY-MM-DD');
    var weekBack =  moment().subtract(6,"days").format('YYYY-MM-DD');
    const firstDate = weekBack;
    datesKeys.push(firstDate);
    dailySleep[firstDate]=0;
    dailyRestless[firstDate]=0;

    const secondDate = moment().subtract(5,"days").format('YYYY-MM-DD');
    datesKeys.push(secondDate);
    dailySleep[secondDate]=0;
    dailyRestless[secondDate]=0;

    const thirdDate = moment().subtract(4,"days").format('YYYY-MM-DD');
    datesKeys.push(thirdDate);
    dailySleep[thirdDate]=0;
    dailyRestless[thirdDate]=0;



    const fourthDate = moment().subtract(3,"days").format('YYYY-MM-DD');
    datesKeys.push(fourthDate);
    dailySleep[fourthDate]=0;
    dailyRestless[fourthDate]=0;

    const fifthDate = moment().subtract(2,"days").format('YYYY-MM-DD');
    datesKeys.push(fifthDate);
    dailySleep[fifthDate]=0;
    dailyRestless[fifthDate]=0;

    const sixthDate = moment().subtract(1,"days").format('YYYY-MM-DD');
    datesKeys.push(sixthDate);
    dailySleep[sixthDate]=0;
    dailyRestless[sixthDate]=0;


    const seventhDate = today;
    datesKeys.push(seventhDate);
    dailySleep[seventhDate]=0;
    dailyRestless[seventhDate]=0;





    console.log("******Today*****");
    console.log(today);

    console.log("*****Week Back****");
    console.log(weekBack);


    return {
        today:today,
        weekBack:weekBack
    }
}

var fitbitDetails = require('./fitbitConfig.json');

var FitbitApiClient = require("fitbit-node");

//create a fitbitConfig.json file with {"id":"","secret":""}
var client = new FitbitApiClient(fitbitDetails.id, fitbitDetails.secret);

router.get('/sleep',function(req,res,next){

    if (req.session.userID == null || typeof req.session.userID == "undefined") {
        console.log("hi")
        res.render('login');
    }
    else {
        const dates = getDates();

        const sleepUrl = "/sleep/date/" + dates.weekBack + "/" + dates.today + ".json";


        client.get(sleepUrl, req.session.accessToken).then(function (results) {

            var minutesAsleep = 0;
            var minutesAwake = 0;
            var timeInBed = 0;
            var efficiency = 0;
            var awakeningsCount = 0;
            var restlessCount = 0;
            var restlessDuration = 0;
            var hoursInBed = 0;
            var hoursAsleep = 0;
            var hoursAwake = 0;
            for (i = 0; i < results[0].sleep.length; i++) {
                //console.log(results[0].sleep[i]);
                dailySleep[results[0].sleep[i].dateOfSleep] = dailySleep[results[0].sleep[i].dateOfSleep] + results[0].sleep[i].minutesAsleep;
                dailyRestless[results[0].sleep[i].dateOfSleep] = dailyRestless[results[0].sleep[i].dateOfSleep] + results[0].sleep[i].restlessDuration;

                minutesAsleep = minutesAsleep + results[0].sleep[i].minutesAsleep;
                minutesAwake = minutesAwake + results[0].sleep[i].minutesAwake;
                timeInBed = timeInBed + results[0].sleep[i].timeInBed;
                efficiency = efficiency + results[0].sleep[i].efficiency;
                awakeningsCount = awakeningsCount + results[0].sleep[i].awakeningsCount;
                restlessCount = restlessCount + results[0].sleep[i].restlessCount;
                restlessDuration = restlessDuration + results[0].sleep[i].restlessDuration;

            }

            efficiency = ((minutesAsleep / timeInBed) * 100).toFixed(2);
            hoursInBed = (timeInBed / 60).toFixed(2);
            hoursAsleep = ( minutesAsleep / 60).toFixed(2);
            hoursAwake = ( minutesAwake / 60 ).toFixed(2);

            dailySleepTime = [];
            dailyRestlessTime = [];

            for (const key in dailySleep) {
                dailySleepTime.push(Number((dailySleep[key] / 60).toFixed(2)));
            }

            for (const key in dailyRestless) {
                dailyRestlessTime.push(Number((dailyRestless[key])));
            }


            var object = {

                minutesAsleep: minutesAsleep,
                minutesAwake: minutesAwake,
                timeInBed: timeInBed,
                efficiency: efficiency,
                awakeningsCount: awakeningsCount,
                restlessCount: restlessCount,
                restlessDuration: restlessDuration,
                hoursInBed: hoursInBed,
                startDate: dates.weekBack,
                endDate: dates.today,
                hoursAsleep: hoursAsleep,
                hoursAwake: hoursAwake,
                datesKeys: datesKeys,
                dailySleepTime: dailySleepTime,
                dailyRestlessTime: dailyRestlessTime,
                name:req.session.name

            }

            console.log(object);
            res.render('sleep', object);


        }, function (error) {

            console.log('Error retrieveing sleep weekly records');
            console.log(error);
        });
    }
});

module.exports = router;
