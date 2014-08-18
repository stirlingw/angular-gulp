'use strict';

var angular = require('angular'); // That's right! We can just require angular as if we were in node

var WelcomeCtrl = require('./controllers/WelcomeCtrl'); // We can use our WelcomeCtrl.js as a module. Rainbows.
var AboutCtrl = require('controllers/AboutCtrl'); // We can use our WelcomeCtrl.js as a module. Rainbows.

var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/views/home.html',
                controller: 'WelcomeCtrl'
            }).
            when('/about', {
                templateUrl: '/views/about.html',
                controller: 'AboutCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(true);
    }]);

app.controller('WelcomeCtrl', ['$scope', WelcomeCtrl]);
app.controller('AboutCtrl', ['$scope', AboutCtrl]);


