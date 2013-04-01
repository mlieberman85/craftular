'use strict';

// declare top-level module which depends on filters,and services
var myApp = angular.module('myApp',
    ['myApp.filters',
        'myApp.directives', // custom directives
        'ngGrid', // angular grid
        'ui', // angular ui
        'ngSanitize', // for html-bind in ckeditor
        'ui.bootstrap', // jquery ui bootstrap
        '$strap.directives', // angular strap
      'myApp.services'
    ]);

// bootstrap angular
myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    // TODO use html5 *no hash) where possible
    // $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
        templateUrl:'partials/home'
    });/*
    $routeProvider.when('/contact', {
        templateUrl:'partials/contact'
    });
    $routeProvider.when('/about', {
        templateUrl:'partials/about'
    });

    // note that to minimize playground impact on app.js, we
    // are including just this simple route with a parameterized 
    // partial value (see playground.js and playground.html)
    $routeProvider.when('/playground/:widgetName', {
        templateUrl:'playground/playground.html',
        controller:'PlaygroundCtrl'
    });

    $routeProvider.when('/events/:widgetName', {
      templateUrl: 'partials/events/events',
      controller: 'EventsCtrl'
    });
  $routeProvider.when('/users/:widgetName', {
    templateUrl: 'partials/users/users',
    controller: 'UsersCtrl'
  });*/

    // by default, redirect to site root
    $routeProvider.otherwise({
        redirectTo:'/'
    });

}]);

// this is run after angular is instantiated and bootstrapped
myApp.run(function ($rootScope, $location, $route, $http, $timeout, $dialog ) {


});



