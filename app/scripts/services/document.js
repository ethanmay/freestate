'use strict';

/**
 * @ngdoc service
 * @name freestateApp.Document
 * @description
 * # Document
 * Factory in the freestateApp
 */
angular.module('freestateApp')
  .factory('Document', [ '$resource', '$rootScope', function ( $resource, $rootScope ) {
    return $resource( $rootScope.serverRoute + 'user/:userId/doc/:docId', {
    	userId: '@userId',
    	docId: '@docId'
    }, {
      'get':    { method:'GET', withCredentials: true },
		  'save':   { method:'POST', withCredentials: true },
		  'query':  { method:'GET', isArray: true, withCredentials: true },
		  'remove': { method:'DELETE', withCredentials: true },
		  'delete': { method:'DELETE', withCredentials: true }
    });
  }]);