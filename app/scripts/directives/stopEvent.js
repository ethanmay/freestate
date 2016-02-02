'use strict';

/**
 * @ngdoc function
 * @name freestateApp.directive:stopEvent
 * @description
 * # stopEvent
 */
angular.module('freestateApp')
	.directive('stopEvent', function () {
	    return {
	    	restrict: 'A',
	    	link: function (scope, element, attr) {
	        	element.on(attr.stopEvent, function (e) {
	        		e.stopPropagation();
	        	});
	    	}
	    };
	});