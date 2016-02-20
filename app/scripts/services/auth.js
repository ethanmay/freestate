'use strict';

/**
 * @ngdoc service
 * @name freestateApp.AuthService
 * @description
 * # AuthService
 * Service in the freestateApp.
 */
angular.module('freestateApp')
  .service('AuthService', [ '$rootScope', '$resource', '$window', '$http', '$q', function ( $rootScope, $resource, $window, $http, $q ) {

    function checkAuth() {
      var d = $q.defer();
      $http.get( 'http://127.0.0.1:8080/auth/check', { withCredentials: true } )
        .success( function( response ){
          d.resolve( response );
        })
        .error( function( err ) {
          d.reject( err );
        });
      return d.promise;
    }

    function login( data ) {
      var d = $q.defer();
      $http.post( 'http://127.0.0.1:8080/login', data, { withCredentials: true } )
        .success( function( response ){
          d.resolve( response );
        })
        .error( function( err ) {
          d.reject( err );
        });
      return d.promise;
    }

    function signUp( data ) {
      var url = '';
      if( !$rootScope.user._id ) {
        url = 'http://127.0.0.1:8080/signup';
      } else {
        url = 'http://127.0.0.1:8080/connect/local';
      }
      var d = $q.defer();
      $http.post( url, data, { withCredentials: true } )
        .success( function( response ){
          d.resolve( response );
        })
        .error( function( err ) {
          d.reject( err );
        });
      return d.promise;
    }

  	function socialLogin( network ){
      var url = '';
      if( !$rootScope.user._id ) {
        url = 'http://127.0.0.1:8080/auth/' + network;
      } else {
        url = 'http://127.0.0.1:8080/connect/' + network;
      }
	    $window.open( url, 'login' );

      $window.addEventListener( 'message', function( message ) {
        var origin = event.origin || event.originalEvent.origin;
        if ( origin !== 'http://127.0.0.1:8080' ) {
          return;
        }

        var data = message.data;
        if( data.user ) {
          $rootScope.$broadcast('socialLoginSuccess', data.user);
        }

        $window.removeEventListener( 'message' );
      }, false );
  	}

    function setUser( user, hardReset ) {
      if( !$rootScope.user._id || hardReset ) {
        $rootScope.user = user;
      }
      if( user.local ) {
        $rootScope.user.local = user.local;
        if( !$rootScope.user.name ) {
          $rootScope.user.name = $rootScope.user.local.email;  
        }
      } else {
        user.local = { email: false };
      }
      if( user.facebook ) {
        $rootScope.user.facebook = user.facebook;
        if( !$rootScope.user.name || $rootScope.user.name === $rootScope.user.local.email ) {
          $rootScope.user.name = user.facebook.name;  
        }
      }
      if( user.twitter ) {
        $rootScope.user.twitter = user.twitter;
        if( !$rootScope.user.name || $rootScope.user.name === $rootScope.user.local.email ) {
          $rootScope.user.name = user.twitter.displayName;  
        }
      }
      if( user.google ) {
        $rootScope.user.google = user.google;
        if( !$rootScope.user.name || $rootScope.user.name === $rootScope.user.local.email ) {
          $rootScope.user.name = user.google.name;  
        }
      }
      console.log($rootScope.user);
    }

    function unlinkAccount( network ) {
      var d = $q.defer();
      $http.get( 'http://127.0.0.1:8080/unlink/' + network, { withCredentials: true } )
        .success( function( response ){
          d.resolve( response );
        })
        .error( function( err ) {
          d.reject( err );
        });
      return d.promise;
    }

    function logOut() {
      var d = $q.defer();
      $http.delete( 'http://127.0.0.1:8080/logout', { withCredentials: true } )
        .success( function( response ){
          d.resolve( response );
        })
        .error( function( err ) {
          d.reject( err );
        });
      return d.promise;
    }

  	var service = {
      check: checkAuth,
      login: login,
  		socialLogin: socialLogin,
      signUp: signUp,
      set: setUser,
      unlink: unlinkAccount,
      logout: logOut
  	};

  	return service;
}]);