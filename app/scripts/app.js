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
		'ngResource',
		'ui.router',
		'textAngular',
		'foundation',
		'angulartics', 
		'angulartics.google.analytics',
		'ngCordova',
		'angular-storage'
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
				.state('doc', {
					url: '/doc/:docId',
					templateUrl: 'views/main.html',
					controller: 'EditCtrl as edit'
				});

			$locationProvider.html5Mode({
				enabled: false,
				requireBase: false
			});
		}])
		.run( [
			'ModalFactory',
			'AuthService',
			'$rootScope',
			'$timeout',
			'GlobalConfig',
			'$window',
			function( ModalFactory, AuthService, $rootScope, $timeout, GlobalConfig, $window ){

			// Set Env Variables
			switch( $window.location.origin ) {
				case 'http://localhost:9000':
					$rootScope.serverRoute = GlobalConfig.LocalDevApi;
					break;
				default:
					console.log('unrecognized server', $window.location.origin);
					break;
			}

			// Attach FastClick
			FastClick.attach( document.body );

			// Check Mobile Devices
			if( window.mobilecheck() ) {
				var modal = new ModalFactory({
					class: 'tiny dialog',
					overlay: true,
					overlayClose: true,
					templateUrl: 'views/modals/homescreen.html',
					contentScope: {
						closeModal: function() {
							modal.deactivate();
							$timeout(function() {
								modal.destroy();
							}, 1000);
						}
					}
				});
				modal.activate();
			}

			// Initialize Empty User
	    	$rootScope.user = { _id: false, name: false, local: { email: false } };
	    	$rootScope.docs = [];
		}]);
