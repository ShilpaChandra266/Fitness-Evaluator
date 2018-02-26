var express = require('express');
var router = express.Router();
var date = require('date-and-time');
var mysql = require('../public/javascripts/mysql');

var fitbitDetails = require('./fitbitConfig.json');

var FitbitApiClient = require("fitbit-node");

//create a fitbitConfig.json file with {"id":"","secret":""}
var client = new FitbitApiClient(fitbitDetails.id, fitbitDetails.secret);

// redirect the user to the Fitbit authorization page
router.get("/fitbit", function (req, res) {
    console.log("Test here")
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://localhost:3000/fitbit/test'));
});

// handle the callback from the Fitbit authorization flow
router.get("/fitbit/test", function (req, res) {
    var fitbitData = {"heart":"","activities":"","sleep":""};
    console.log(req);
    req.session.code=req.query.code;
    console.log("reaching here");
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, 'http://localhost:3000/fitbit/test').then(function (result) {
        req.session.accessToken=result.access_token;
        console.log("Here is the access token: "+ result.access_token)
        console.log("Here is the refresh token: "+ result.refresh_token)
        req.session.refreshToken=result.refresh_token;

        mysql.handle_database(function (connection) {

            connection.query("UPDATE Users SET accesstoken = ?, refreshtoken = ? WHERE user_Id = ?", [req.session.accessToken, req.session.refreshToken, req.session.userID], function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
                    res.redirect("/");
                }
                else {
                    res.json({"code": 100, "status": "Error in connection database"});
                    console.log("error: " + err);
                }
            });

            connection.on('error', function (err) {
                console.log("error: " + err);
                res.json({"code": 100, "status": "Error in connection database"});
                res.render("404",{error:err});
            });
        });


    }).catch(function (error) {
        console.log("The error: " + error);
        res.send(error);
    });
});
module.exports = router;
