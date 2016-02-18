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

  	function socialLogin( network ){
    	var url = 'http://localhost:8080/auth/' + network,
		    width = 1000,
		    height = 650,
		    top = ($window.outerHeight - height) / 2,
		    left = ($window.outerWidth - width) / 2;

	    $window.open(url, 'login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
    	console.log(User);

      $window.addEventListener( 'message', function( message ) {
        var origin = event.origin || event.originalEvent.origin;
        console.log(origin);
        if ( origin !== 'http://localhost:8080' ) {
          return;
        }

        var data = message.data;

        $rootScope.$apply(function() {
          switch ( data.state ) {
            case 'success':
              console.log('Auth success!', data.user);
              // sessionService.authSuccess(user);
              break;
            case 'failure':
              console.log('Auth failure!');
              // sessionService.authFailed();
              break;
          }
        });
      }, false );
  	}

  	var service = {
  		socialLogin: socialLogin
  	};

  	return service;
}]);