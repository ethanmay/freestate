'use strict';

/**
 * @ngdoc function
 * @name freestateApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the freestateApp
 */
angular.module('freestateApp')
  .controller('LoginCtrl', [ '$scope', 'AuthService', function( $scope, AuthService ){
	var self = this;

	self.socialLogin = function( network ) {
		AuthService.login( network );
		$scope.closeModal();
	};
}]);