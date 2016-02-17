'use strict';

/**
 * @ngdoc service
 * @name freestateApp.AuthService
 * @description
 * # AuthService
 * Service in the freestateApp.
 */
angular.module('freestateApp')
  .service('AuthService', [ '$rootScope', 'User', '$resource', '$window', function ( $rootScope, $resource, User, $window ) {

  	function login( network ){
    	var url = 'http://127.0.0.1:1337/auth/' + network,
		    width = 1000,
		    height = 650,
		    top = ($window.outerHeight - height) / 2,
		    left = ($window.outerWidth - width) / 2;

	    $window.open(url, 'facebook_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
    	console.log(User);
	}

  	var service = {
  		login: login
  	};

  	return service;
}]);