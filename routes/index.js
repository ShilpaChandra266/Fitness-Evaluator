var express = require('express');
var router = express.Router();
var mysql = require('../public/javascripts/mysql');
var bodyMassIndex = require('body-mass-index');
var date = require('date-and-time');
var fitbitDetails = require('./fitbitConfig.json');

var FitbitApiClient = require("fitbit-node");

//create a fitbitConfig.json file with {"id":"","secret":""}
var client = new FitbitApiClient(fitbitDetails.id, fitbitDetails.secret);


var getFitbitData = function (req) {
    return new Promise(function (fulfill, reject) {
        console.log("Hello");
        var fitbitData = {"heart": "", "activities": "", "sleep": ""};
        console.log("req.session: "+req.session.code);
            // use the access token to fetch the user's profile information
            client.get("/activities/heart/date/today/1d.json", req.session.accessToken).then(function (results) {
                // res.send(results[0]);
                console.log("The heartis: " + JSON.stringify(results[0]) + '\n');
                fitbitData.heart = results[0];
                client.get("/activities/date/today.json", req.session.accessToken).then(function (results) {
                    console.log("The activities: " + results[0] + '\n');
                    fitbitData.activities = results[0];
                    var now = new Date();
                    var now = date.format(now, 'YYYY-MM-DD');
                    now += "";
                    now = "2017-04-24";

                    client.get("/sleep/date/" + now + ".json", req.session.accessToken).then(function (results) {
                        // console.log("The sleep: "+results[0]+'\n');
                        fitbitData.sleep = results[0];
                        req.session.fitbitData = fitbitData;
                        console.log("The whole is: " + JSON.stringify(req.session.fitbitData));
                        fulfill();
                    });
            });
        }).catch(function (error) {
            console.log("The error: " + error);
            reject();
            res.send(error);
        });
    });
};


/* GET home page. */
router.get('/', function(req, res, next) {
    // req.session.destroy();

  // console.log("The user session: "+req.session.userID)
  if(req.session == null || req.session.userID==null || typeof req.session.userID == "undefined"){
      console.log("hi")
      res.render('login');
  }
  else {
      console.log("About to call function");
      getFitbitData(req).then(function(){
          console.log("The fitbit data is: "+JSON.stringify(req.session.fitbitData));
          var parseData = JSON.parse(JSON.stringify(req.session.fitbitData))

          // Using JSON Path to parse the object that was created when doing the fitbit calls. They are divided into three sections:
          // 1) heart object
          // 2) activities object
          // 3) sleeping object
          var restingHeartRate =parseData.heart['activities-heart'][0];

          var activities = parseData.activities;

          var sleep = parseData.sleep;

          //Calculating BMI

          var bmi= bodyMassIndex(req.session.weight+ ' lb', req.session.height);

          res.render('index',{restingHeartRate:restingHeartRate, activities:activities, sleep:sleep, name:req.session.name, bmi:bmi});
          // res.render('index');
      })
  }
});

router.post('/login',function(req,res,next){
    console.log("Inside");
    mysql.handle_database(function(connection) {

        var email = req.body.username;
        var password = req.body.password;
        console.log("email: "+email);
        console.log("password: "+password);


        connection.query("SELECT * FROM `Users` WHERE `email` = ? AND `password` = ?", [email, password],function(err,rows){
            connection.release();
            if(!err) {
                console.log("length: "+rows.length);
                if(rows.length>0)
                {
                    console.log(req);
                    req.session.userID = rows[0].user_Id;
                    req.session.name = rows[0].firstname + " "+rows[0].lastname
                    req.session.weight = rows[0].weight;
                    req.session.height = rows[0].height;
                    req.session.email = rows[0].email;
                    res.redirect(200,'/fitbit');
                }
                else
                {
                    res.redirect(200,"/");
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

router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

router.get('/register',function(req,res,next){
   res.render('register')
});


router.post('/register',function(req,res,next){
        console.log("shilpa");
        mysql.handle_database(function (connection) {
            var email = req.body.email;
            var password = req.body.password;
            var firstname = req.body.firstname;
            var lastname = req.body.lastname;
            var phonenumber = req.body.phonenumber;
            var height = req.body.height;
            var weight = req.body.weight;
            var gender = req.body.gender;
            console.log("Sql statement: " + "INSERT INTO 'Users' ('user_Id', 'email', 'password', 'phonenumber', 'height', 'weight', 'gender') VALUES (NULL,'" + email + "', '" + password + "', '" + firstname + "','" + lastname + "','" + phonenumber + "','" + height + "','" + weight + "','" + gender + "')")

            connection.query("INSERT INTO `Users` (`user_Id`, `email`, `password`, `firstname`, `lastname`, `phonenumber`, `height`, `weight`, `gender`) VALUES (null,'" + email + "', '" + password + "', '" + firstname + "','" + lastname + "','" + phonenumber + "','" + height + "','" + weight + "','" + gender + "')", function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
                    res.redirect(200,"/");
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

});



module.exports = router;






// var FitbitApiClient = require("fitbit-node"),
//     client = new FitbitApiClient("2284LP", "e558ddfd01c6b4b4abb60facdfa92124");
//
// // redirect the user to the Fitbit authorization page
// router.get("/fitbit", function (req, res) {
//     console.log("Test here")
//     // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
//     res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'http://http://ec2-34-208-166-178.us-west-2.compute.amazonaws.com:3000/test'));
// });
//
// // handle the callback from the Fitbit authorization flow
// router.get("/test", function (req, res) {
//   console.log("reaching here");
//     // exchange the authorization code we just received for an access token
//     client.getAccessToken(req.query.code, 'http://http://ec2-34-208-166-178.us-west-2.compute.amazonaws.com:3000/test').then(function (result) {
//       console.log("Here is the result: "+result)
//         // use the access token to fetch the user's profile information
//         client.get("/profile.json", result.access_token).then(function (results) {
//           console.log("Look: "+results[0]);
//             res.send(results[0]);
//         });
//     }).catch(function (error) {
//       console.log("The error: "+error);
//         res.send(error);
//     });
// });