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
          // var data = AuthService.decode( token );
          d.resolve( response );
          // AuthService.setToken( token ); 
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
          // var data = AuthService.decode( token );
          d.resolve( response );
          // AuthService.setToken( token ); 
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
          // var data = AuthService.decode( token );
          d.resolve( response );
          // AuthService.setToken( token ); 
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

    function setUser( user ) {
      if( !$rootScope.user._id ) {
        $rootScope.user = user;
      }
      if( user.local && !$rootScope.user.name ) {
        $rootScope.user.name = $rootScope.user.local.email;
      }
      if( user.facebook && !$rootScope.user.name || $rootScope.user.name === $rootScope.user.local.email ) {
        $rootScope.user.name = user.facebook.name;
      } else if( user.twitter && !$rootScope.user.name || $rootScope.user.name === $rootScope.user.local.email ) {
        $rootScope.user.name = user.twitter.displayName;
      } else if( user.google && !$rootScope.user.name || $rootScope.user.name === $rootScope.user.local.email ) {
        $rootScope.user.name = user.google.name;
      }
      if( user.local && !$rootScope.user.local.email ) {
        $rootScope.user.local = user.local;
      }
      if( user.facebook && !$rootScope.user.facebook ) {
        $rootScope.user.facebook = user.facebook;
      }
      if( user.twitter && !$rootScope.user.twitter ) {
        $rootScope.user.twitter = user.twitter;
      }
      if( user.google && !$rootScope.user.google ) {
        $rootScope.user.google = user.google;
      }
      console.log($rootScope.user);
    }

    function logOut() {
      var d = $q.defer();
      $http.delete( 'http://127.0.0.1:8080/logout', { withCredentials: true } )
        .success( function( response ){
          // var data = AuthService.decode( token );
          d.resolve( response );
          // AuthService.setToken( token ); 
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
      logout: logOut
  	};

  	return service;
}]);