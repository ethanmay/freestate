'use strict';

/**
 * @ngdoc function
 * @name freestateApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the freestateApp
 */
angular.module('freestateApp')
  .controller('LoginCtrl', [ '$rootScope', '$scope', 'AuthService', function( $rootScope, $scope, AuthService ){
	var self = this;

	self.login = function() {
		AuthService.login( self.data ).then( function( user ) {
			if( user._id ) {
				AuthService.set( user );
				self.step = 1;
			} else {
				console.log('User not set...');
			}
		});
	};

	self.signUp = function() {
		AuthService.signUp( self.data ).then( function( user ) {
			if( user._id ) {
				AuthService.set( user );
				self.step = 1;
			} else {
				console.log('User not set...');
			}
		});
	};

	self.socialLogin = function( network ) {
		AuthService.socialLogin( network );
		$rootScope.$on('socialLoginSuccess', function( event, user ) {
			if( user._id ) {
				AuthService.set( user );
				self.step = 1;
				$scope.$apply();
			} else {
				console.log('User not set...');
			}
		});
	};

	self.logout = function() {
		AuthService.logout().then( function() {
        	$rootScope.user = { _id: false, name: false, local: { email: false } };
		});
	};
}]);