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
		'ui.router',
		'textAngular',
		'foundation',
		'angulartics', 
		'angulartics.google.analytics'
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
		.run( [ 'ModalFactory', '$timeout', function( ModalFactory, $timeout ){
			FastClick.attach( document.body );
			if( window.mobilecheck() ) {
				var modal = new ModalFactory({
					// Add CSS classes to the modal
					// Can be a single string or an array of classes
					class: 'tiny dialog',
					// Set if the modal has a background overlay
					overlay: true,
					// Set if the modal can be closed by clicking on the overlay
					overlayClose: true,
					// Define a template to use for the modal
					templateUrl: 'views/modals/homescreen.html',
					// Allows you to pass in properties to the scope of the modal
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
		}]);
