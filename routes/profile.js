var express = require('express');
var router = express.Router();
var mysql = require('../public/javascripts/mysql');

/* GET users listing. */
router.get('/profile', function(req, res, next) {

    if(req.session.userID==null){
        res.render('login')
    }
    else
    res.render('profile');
});

router.get('/preferences', function(req, res, next) {
    if(req.session.userID==null){
        res.render('login')
    }
    else
    res.render('index');
});

router.get('/emergencyContacts', function(req, res, next) {
    if(req.session.userID==null){
        res.render('login')
    }
    else
    res.render('contact',{name:req.session.name});
});

router.get('/getEmergencyContacts', function(req, res, next) {
    if(req.session.userID==null){
        res.render('login')
    }
    else {
        mysql.handle_database(function (connection) {

            connection.query("SELECT * FROM EmergencyContacts WHERE user_Id= ?", [req.session.userID], function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
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
                res.render("404",{error:err});
            });

        });
    }
});

router.get('/getProfileInformation', function(req, res, next) {
    if(req.session.userID==null){
        res.render('login')
    }
    else {
        mysql.handle_database(function (connection) {

            connection.query("SELECT * FROM Users WHERE `user_Id`=?", [req.session.userID], function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
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
                res.render("404",{error:err});
            });

        });
    }
});

router.post('/addContact',function(req,res,next){
    if(req.session.userID==null){
        res.render('login')
    }
    else {
        mysql.handle_database(function (connection) {
            var phoneNumber = req.body.phoneNumber;
            var name = req.body.name;
            var relation = req.body.relation;
            console.log("Sql statement: " + "INSERT INTO 'EmergencyContacts' ('emergency_Id', 'phonenumber', 'name', 'relation', 'user_Id') VALUES (NULL,'" + phoneNumber + "', '" + name + "', '" + relation + "','" + req.session.userID + "')")

            connection.query("INSERT INTO `EmergencyContacts` (`emergency_Id`, `phonenumber`, `name`, `relation`, `user_Id`) VALUES (NULL,'" + phoneNumber + "', '" + name + "', '" + relation + "',"+req.session.userID+")", function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
                    res.redirect("/emergencyContacts");
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
    }
});

router.post('/deleteContact',function(req,res,next){
    if(req.session.userID==null){
        res.render('login')
    }
    else {
        mysql.handle_database(function (connection) {
            var emergency_Id = req.body.emergency_Id;
            console.log("The emergency ID is: " + emergency_Id);
            console.log("The delete query is: " + "DELETE FROM `EmergencyContacts` WHERE `emergency_Id`=" + emergency_Id);
            connection.query("DELETE FROM `EmergencyContacts` WHERE `emergency_Id`=" + emergency_Id, function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
                    res.redirect("/emergencyContacts");
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
    }
});

router.post('/updateContact',function(req,res,next){
    if(req.session.userID==null){
        res.render('login')
    }
    else {
        mysql.handle_database(function (connection) {

            var phoneNumber = req.body.phoneNumber;
            console.log("Inside route is phoneNumber: " + phoneNumber);
            var name = req.body.name;
            console.log("Inside route is name: " + name);
            var relation = req.body.relation;
            console.log("Inside route is relation: " + relation);
            var emergency_Id = req.body.emergency_Id;
            console.log("Inside route is emergency_Id: " + emergency_Id);


            connection.query("UPDATE EmergencyContacts SET phonenumber = ?, name = ?, relation = ? WHERE emergency_Id = ?", [phoneNumber, name, relation, emergency_Id], function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
                    res.redirect("/emergencyContacts");
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
    }
});

router.post('/updateProfile',function(req,res,next){
    if(req.session.userID==null){
        res.render('login')
    }
    else {
        mysql.handle_database(function (connection) {

            var email = req.body.email;
            var phoneNumber = req.body.phoneNumber;
            var height = req.body.height;
            var weight = req.body.weight;
            var gender = req.body.gender;

            req.session.weight = weight;
            req.session.height = height;


            connection.query("UPDATE Users SET email = ?, phonenumber = ?, height = ?, weight = ?, gender = ? WHERE user_Id = ?", [email, phoneNumber, height, weight, gender, req.session.userID], function (err, rows) {
                connection.release();
                if (!err) {
                    console.log("rows are: " + JSON.stringify(rows));
                    res.redirect("/emergencyContacts");
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
    }
});




module.exports = router;
