'use strict';

/**
 * @ngdoc function
 * @name freestateApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the freestateApp
 */
angular.module('freestateApp')
  .controller('MainCtrl', [
  	'ModalFactory',
  	'$timeout',
  	'$interval',
  	'textAngularManager',
  	'$scope',
  	function( ModalFactory, $timeout, $interval, textAngularManager, $scope ){
	    var self = this;

	    self.init = function() {
		    self.limit = false;
		    self.showToolbar = false;
	    	self.enableWriting = false;
	    	self.counterStarted = false;
	    	self.text = 'Click the plus button to create a new document.';
			self.timer = 5;
			self.editMode = false;

		    var windowHeight = angular.element(window).outerHeight();
		    var headHeight = angular.element('.bar-top').outerHeight();
		    var footHeight = angular.element('.bar-bottom').outerHeight();
		    var total = ( windowHeight - ( headHeight + footHeight ) ) + 18;

		    $timeout( function() {
			    angular.element('.page-container').css( 'min-height', total );
			    angular.element('.page-container [text-angular] .ta-scroll-window > .ta-bind').css( 'min-height', total - 70 ); // subtract padding of container
		    }, 250);
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
							self.initWritingContainer();
						}
					}
				}
			});
			modal.activate();
	    };

	    self.initWritingContainer = function() {
		    angular.element('.page-container').css( 'min-height', angular.element('.page-container').outerHeight() + 8 );
	    	self.enableWriting = true;
	    	self.text = 'Start typing to begin...';
	    	self.editor = textAngularManager.retrieveEditor('text-editor');

	    	if( self.limit.type === 'time' ) {
				var timer = ( ( self.limit.value.min * 60 ) * 1000 ) + ( ( self.limit.value.hrs * 3600 ) * 1000 );
				var output = self.msToTime( timer );
				self.hourCounter = output.hrs;
				self.minuteCounter = output.min;
				self.secondCounter = output.sec;
	    	} else if( self.limit.type === 'words' ) {
	    		self.wordCount = 0;
    			self.beginWritingByWordCount();
	    	}
	    };

	    self.stoppedWriting = function() {
	    	if( self.enableWriting === true && self.text !== '' && !self.editMode ) {
    			self.detonate = $timeout( function() {
			    	self.text = '<p></p>';
    				self.timer = 5;
    				angular.element('[text-angular] .ta-scroll-window > .ta-bind').css('opacity', 1);
    				textAngularManager.refreshEditor('text-editor');
			    	$interval.cancel( self.eraseTimer );
			    	$timeout.cancel( self.detonate );
    			}, 5000);

    			self.eraseTimer = $interval( function() {
    				self.timer = self.timer - 1;
    				var opacity = angular.element('[text-angular] .ta-scroll-window > .ta-bind').css('opacity');
    				opacity = opacity - 0.2;
    				angular.element('[text-angular] .ta-scroll-window > .ta-bind').css('opacity', opacity);
    			}, 1000);
    		}
	    };

	    self.destroyTimers = function() {
	    	if( self.detonate || self.eraseTimer ) {
	    		self.timer = 5;
		    	angular.element('[text-angular] .ta-scroll-window > .ta-bind').css('opacity', 1);
	    	}
	    	if( self.detonate ) {
		    	$timeout.cancel( self.detonate );
    		}
    		if( self.eraseTimer ) {
    			$interval.cancel( self.eraseTimer );
    		}

    		if( self.enableWriting === true && self.counterStarted === false ) {
	    		if( self.limit.type === 'time' ) {
	    			self.beginWritingByTime();
	    		}
	    	}
	    };

	    self.beginWritingByTime = function() {
	    	self.hourCounter = '';
	    	self.minuteCounter = '';
	    	self.secondCounter = '';
	    	self.finished = false;

			var hourCounter = self.limit.value.hrs;
			var minCounter = self.limit.value.min;
			var timer = ( ( minCounter * 60 ) * 1000 ) + ( ( hourCounter * 3600 ) * 1000 );

			var updateTimer = $interval( function() {
				timer = timer - 1000;
				var output = self.msToTime( timer );
				self.hourCounter = output.hrs;
				self.minuteCounter = output.min;
				self.secondCounter = output.sec;
			}, 1000);

			var finished = $timeout( function() {
		    	self.hourCounter = false;
				self.minuteCounter = false;
				self.secondCounter = false;
				$interval.cancel( updateTimer );
		    	$timeout.cancel( finished );
		    	self.done();
			}, timer);

	    	self.counterStarted = true;
	    };

	    self.beginWritingByWordCount = function() {
	    	self.counterStarted = true;

	    	self.countWatcher = $scope.$watch(function () {
				return self.editor.scope.wordcount;
			}, function( count ){
				if( count >= self.limit.value ) {
					self.countWatcher();
					self.done();
				}
			});
	    };

	    self.done = function() {
			self.destroyTimers();
	    	self.finished = true;
		    self.showToolbar = true;
			self.counterStarted = false;
			self.editMode = true;
			self.limit = false;

	    	var modal = new ModalFactory({
				// Add CSS classes to the modal
				// Can be a single string or an array of classes
				class: 'tiny dialog',
				// Set if the modal has a background overlay
				overlay: true,
				// Set if the modal can be closed by clicking on the overlay
				overlayClose: true,
				// Define a template to use for the modal
				templateUrl: 'views/modals/finished.html',
				// Allows you to pass in properties to the scope of the modal
				contentScope: {
					closeModal: function() {
						modal.deactivate();
						$timeout(function() {
							modal.destroy();
						}, 1000);
					}
				}
			});
			modal.activate();
	    };

	    self.msToTime = function( s ) {
			var ms = s % 1000;
			s = (s - ms) / 1000;
			var sec = s % 60;
			s = (s - sec) / 60;
			var min = s % 60;
			var hrs = (s - min) / 60;

			return { hrs: hrs, min: min, sec: sec };
		};

	    self.init();
	}]);
