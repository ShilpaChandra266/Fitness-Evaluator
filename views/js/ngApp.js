/**
 * Created by rominoushana on 2/27/17.
 */
var SmartHealthTracker = angular.module('SmartHealthTracker', ['ngRoute',"xeditable"]);
SmartHealthTracker.config(['$locationProvider', '$routeProvider', function($locationProvider,$routeProvider) {
    // $locationProvider.html5Mode({
    //     enabled: true,
    //     requireBase: false
    // });
    $routeProvider
        .when('/profile', {
            templateURL: '../profile.ejs',
            controller: 'ProfileController'
        })
        .when('/emergencyContacts', {
            templateURL: '../contact.ejs',
            controller: 'ProfileController'
        })
        .when('/food', {
            templateURL: '../food.ejs',
            controller: 'ProfileController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);