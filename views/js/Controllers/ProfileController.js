// var SmartHealthTracker = angular.module('SmartHealthTracker',[]);


SmartHealthTracker.controller('ProfileController',function($scope,$http,$location,$window,$sce) {

    $scope.genders = [
        {value: 1, text: 'M'},
        {value: 2, text: 'F'},
    ];

    $scope.addContact = function () {
        console.log("here bro");
        $http({
            method: "POST",
            url: '/addContact',
            headers: {
                'Content-Type': 'application/json'
            },
            data : {
                name: $scope.name,
                relation: $scope.relation,
                phoneNumber: $scope.phoneNumber,
            }
        }).success(function (data) {
            console.log("the data is: "+ data.name+", "+ data.relation+", "+data.phoneNumber)
            //checking the response data for statusCode
            if (data.statusCode == 401) {
            }
            else if (data.statusCode == 402) {
                alert(data.errorMessage);
            }
            else {
                console.log("after everything checking if i made it here");
                //Making a get call to the '/about' API
                window.location.assign('/emergencyContacts');
            }
        }).error(function (error) {
            console.log("error in the post");
            $scope.invalid_login = true;
        });
    };

    $scope.deleteContact = function (contact) {
        console.log("The id is: "+contact);
        $http({
            method: "POST",
            url: '/deleteContact',
            headers: {
                'Content-Type': 'application/json'
            },
            data : {
                emergency_Id: contact.emergency_Id
            }
        }).success(function (data) {
            //checking the response data for statusCode
            if (data.statusCode == 401) {
            }
            else if (data.statusCode == 402) {
                alert(data.errorMessage);
            }
            else {
                console.log("after everything checking if i made it here: "+ JSON.stringify(data));
                //Making a get call to the '/about' API
                var index = $scope.contacts.indexOf(contact);
                if(index>-1){
                        $scope.contacts.splice(index, 1);
                }
            }
        }).error(function (error) {
            console.log("error in the post");
            $scope.invalid_login = true;
        });
    };

    $scope.updateContact = function (data2,emergency_Id) {
        $scope.contacts.name = data2.name
        $scope.contacts.phonenumber = data2.phoneNumber
        $scope.contacts.relation = data2.relation

        $http({
            method: "POST",
            url: '/updateContact',
            data : {
                name: $scope.contacts.name,
                relation: $scope.contacts.relation,
                phoneNumber: $scope.contacts.phonenumber,
                emergency_Id: emergency_Id
            }
        }).success(function (datda) {
            //checking the response data for statusCode
            if (datda.statusCode == 401) {
            }
            else if (datda.statusCode == 402) {
                alert(datda.errorMessage);
            }
            else {
                console.log("after everything checking if i made it here");
                //Making a get call to the '/about' API
            }
        }).error(function (error) {
            console.log("error in the post");
            $scope.invalid_login = true;
        });
    };

    $scope.updateProfile = function (data) {

        $scope.profile.email = data.email;
        $scope.profile.phoneNumber = data.phoneNumber;
        $scope.profile.height = data.height;
        $scope.profile.weight = data.weight;
        $scope.profile.gender = data.gender.text;
        console.log("The gender is: "+$scope.profile.gender);
        console.log("here bro");
        console.log("$scope.profile.email: "+$scope.profile.email);

        $http({
            method: "POST",
            url: '/updateProfile',
            data : {
                email: $scope.profile.email,
                phoneNumber: $scope.profile.phoneNumber,
                height: $scope.profile.height,
                weight: $scope.profile.weight,
                gender: $scope.profile.gender
            }
        }).success(function (data) {
            console.log(JSON.stringify("Updated Profile: "+data));

            if (data.statusCode == 401) {
            }
            else if (data.statusCode == 402) {
                alert(data.errorMessage);
            }
            else {
                console.log("after everything checking if i made it here");
                //Making a get call to the '/about' API
                //window.location.assign('/emergencyContacts');
            }
        }).error(function (error) {
            console.log("error in the post");
            $scope.invalid_login = true;
        });
    };

    $scope.getContacts = function () {
        console.log("here bro");
        $http({
            method: "GET",
            url: '/getEmergencyContacts',
        }).success(function (data) {
            console.log("the data in controller is: "+ data)
            //checking the response data for statusCode
            if (data.statusCode == 401) {
            }
            else if (data.statusCode == 402) {
                alert(data.errorMessage);
            }
            else {
                console.log("Made in to initialize scope");
                $scope.contacts = data;
                console.log("Here is the contacts: "+JSON.stringify($scope.contacts));
            }
        }).error(function (error) {
            console.log("Error in getting value")
        });
    };

    $scope.getProfileInformation = function () {
        console.log("here bro");
        $http({
            method: "GET",
            url: '/getProfileInformation',
        }).success(function (data) {
            console.log("the data in controller is: "+ JSON.stringify(data))
            //checking the response data for statusCode
            if (data.statusCode == 401) {
            }
            else if (data.statusCode == 402) {
                alert(data.errorMessage);
            }
            else {
                console.log("Made in to initialize scope");
                console.log("The get profile is: "+JSON.stringify(data));
                $scope.profile = data[0];
                console.log("Gender is: "+$scope.profile.gender);
                // $scope.profile.phoneNumber = data.phonenumber;
                // $scope.profile.height = data.height;
                // $scope.profile.weight = data.weight;
                // $scope.profile.gender = data.gender;

            }
        }).error(function (error) {
            console.log("Error in getting value")
        });
    };

    $scope.login = function () {

        $scope.errorInLogin = false;

        $http({
            method: "POST",
            url: '/login',
            data : {
                username: $scope.username,
                password: $scope.password,
            }
        }).success(function (data) {
            console.log(JSON.stringify("Logged in Successfully: "+data.username));

            if (data.statusCode == 401) {
            }
            else if (data.statusCode == 402) {
                alert(data.errorMessage);
            }
            else {
                console.log("after everything checking if i made it here");
                //Making a get call to the '/about' API
                window.location.assign('/fitbit');
            }
        }).error(function (error) {
            console.log("error in the post");
            $scope.invalid_login = true;
        });
    };

    $scope.register = function () {
        console.log("Made it in the regsiter!!!!!")
        $http({
            method: "POST",
            url: '/register',
            data : {
                email: $scope.email,
                password: $scope.password,
                password2: $scope.confirm_password,
                firstname: $scope.firstname,
                lastname: $scope.lastname,
                phonenumber: $scope.phonenumber,
                height: $scope.height,
                weight: $scope.weight,
                gender: $scope.gender,
            }
        }).success(function (data) {
            console.log(JSON.stringify("Registered Successfully: "+data.username));

            if (data.statusCode == 401) {
            }
            else if (data.statusCode == 402) {
                alert(data.errorMessage);
            }
            else {
                console.log("after everything checking if i made it here");
                window.location.assign('/');
                //Making a get call to the '/about' API
                //window.location.assign('/emergencyContacts');
            }
        }).error(function (error) {
            console.log("error in the post");
            $scope.invalid_login = true;
        });
    };

    $scope.getFood = function () {
        console.log("here bro");
        $http({
            method: "GET",
            url: '/getFood',
        }).success(function (data) {
            console.log("the data in controller is: "+ data)
            //checking the response data for statusCode
            if (data.statusCode == 401) {
            }
            else if (data.statusCode == 402) {
                alert(data.errorMessage);
            }
            else {
                console.log("Made in to initialize scope");
                $scope.foods = data;
                $scope.foods.push(data);
                console.log("Here is the contacts: "+JSON.stringify($scope.foods));
            }
        }).error(function (error) {
            console.log("Error in getting value")
        });
    };

    $scope.addFood = function () {

        console.log("here is one data that was added: "+ $scope.foodName);

        $http({
            method: "POST",
            url: '/addFood',
            data : {
                foodName: $scope.foodName,
                timeConsumed: $scope.timeConsumed,
                amount: $scope.amount,
                calories: $scope.calories,
                fat: $scope.fat,
                fiber: $scope.fiber,
                carbs: $scope.carbs,
                sodium: $scope.sodium,
                protein: $scope.protein,
            }
        }).success(function (datda) {
            //checking the response data for statusCode
            if (datda.statusCode == 401) {
            }
            else if (datda.statusCode == 402) {
                alert(datda.errorMessage);
            }
            else {
                console.log("after everything checking if i made it here");
                window.location.assign('/food');
            }
        }).error(function (error) {
            console.log("error in the post");
            $scope.invalid_login = true;
        });
    };

    $scope.logWeight = function () {
        $http({
            method: "POST",
            url: '/logWeight',
            headers: {
                'Content-Type': 'application/json'
            },
            data : {
                weight: $scope.weightLog,
            }
        }).success(function (data) {
            //checking the response data for statusCode
            if (data.statusCode == 401) {
            }
            else if (data.statusCode == 402) {
                alert(data.errorMessage);
            }
            else {
                console.log("after everything checking if i made it here");
                //Making a get call to the '/about' API
                window.location.assign('/food');
            }
        }).error(function (error) {
            console.log("error in the post");
            $scope.invalid_login = true;
        });
    };


});