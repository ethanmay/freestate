'use strict';

/**
 * @ngdoc service
 * @name freestateApp.User
 * @description
 * # User
 * Factory in the freestateApp
 */
angular.module('freestateApp')
  .factory('User', [ '$resource', function ( $resource ) {
    return $resource('/user/:userId', {userId:'@id'});
  }]);