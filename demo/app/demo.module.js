angular.module('angularVerticalMenuDemo', [ 'ngRoute', 'ngSanitize', 'ngAnimate', 'hljs', 'angularVerticalMenu' ])
	.config([ '$routeProvider', function($routeProvider) {

	    $routeProvider.when('/basic-usage', {
		templateUrl : 'app/basic-usage.html'
	    }).when('/bullet-icon', {
		templateUrl : 'app/bullet-icon.html'
	    }).when('/animation', {
		templateUrl : 'app/animation.html'
	    }).when('/badge', {
		templateUrl : 'app/badge.html'
	    }).when('/route/save', {
		templateUrl : 'app/route.html'
	    }).otherwise({
		redirectTo : '/'
	    });

	} ]);