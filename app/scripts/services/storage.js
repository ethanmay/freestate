'use strict';

/**
 * @ngdoc service
 * @name freestateApp.User
 * @description
 * # User
 * Factory in the freestateApp
 */
angular.module('freestateApp')
	.factory('AutoSave', function( store ) {
		return store.getNamespacedStore('autosave');
	});