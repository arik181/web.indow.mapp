'use strict';

var mapp = angular.module('mapp', ['ngRoute']) 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
          controller:  'jobsiteCtrl',
          templateUrl: '/index.html'
      }).when('/jobsite/add/:jobsiteId', {
          controller:  'jobsiteCtrl',
          templateUrl: '/index.html'
      }).when('/window/add/:windowId', {
          controller:  'windowCtrl',
          templateUrl: '/index.html'
      }).when('/window/:windowId', {
          controller:  'windowCtrl',
          templateUrl: '/index.html'
      }).otherwise({redirectTo : '/' });
}]);
