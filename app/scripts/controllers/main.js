'use strict';

/**
 * @ngdoc function
 * @name freestateApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the freestateApp
 */
angular.module('freestateApp')
  .controller('MainCtrl', [ 'ModalFactory', '$timeout', function( ModalFactory, $timeout ){
    var self = this;

    self.init = function() {
	    self.limit = false;
    };

    self.startCreateProcess = function() {
	    var modal = new ModalFactory({
			// Add CSS classes to the modal
			// Can be a single string or an array of classes
			class: 'small dialog',
			// Set if the modal has a background overlay
			overlay: true,
			// Set if the modal can be closed by clicking on the overlay
			overlayClose: true,
			// Define a template to use for the modal
			templateUrl: 'views/modals/timerSet.html',
			// Allows you to pass in properties to the scope of the modal
			contentScope: {
				step: 1,
				closeModal: function( limit ) {
					modal.deactivate();

					$timeout(function() {
						modal.destroy();
					}, 1000);

					if( limit ) {
						self.limit = limit;
					}
				}
			}
		});
		modal.activate();
    };

    self.init();
  }]);
