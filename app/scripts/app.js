'use strict';

/**
 * @ngdoc overview
 * @name freestateApp
 * @description
 * # freestateApp
 *
 * Main module of the application.
 */
angular
	.module('freestateApp', [
		'ngAnimate',
		'ngCookies',
		'ngTouch',
		'ui.router',
		'textAngular',
		'foundation'
	])
	.config( [
		'$urlRouterProvider',
		'$locationProvider',
		'$stateProvider',
		function( $urlRouterProvider, $locationProvider, $stateProvider ) {
			// Routing
			$urlRouterProvider.otherwise('/');

			$stateProvider
				.state('root', {
					url: '/',
					templateUrl: 'views/main.html'
				})
				.state('about', {
					url: '/about',
					templateUrl: 'views/about.html'
				});

			$locationProvider.html5Mode({
				enabled: false,
				requireBase: false
			});
		}])
		.run( [ function(){
			FastClick.attach( document.body );
		}]);
