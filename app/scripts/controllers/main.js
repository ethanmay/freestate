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
  	'$analytics',
  	'AutoSave',
  	'AuthService',
  	'$rootScope',
  	'Document',
  	'DocumentService',
  	function( ModalFactory, $timeout, $interval, textAngularManager, $scope, $analytics, AutoSave, AuthService, $rootScope, Document, DocumentService ){
	    var self = this;

	    self.init = function() {
	    	self.checkAuthorization();

		    self.limit = false;
		    self.showToolbar = false;
	    	self.enableWriting = false;
	    	self.counterStarted = false;
	    	self.text = '';
			self.timer = 0;
			self.editMode = false;
			self.wordCount = 0;

		    var windowHeight = angular.element(window).outerHeight();
		    var headHeight = angular.element('.bar-top').outerHeight();
		    var footHeight = angular.element('.bar-bottom').outerHeight();
		    var total = windowHeight - ( headHeight + footHeight );

		    $timeout( function() {
			    angular.element('.page-container').css( 'min-height', total );
			    angular.element('.page-container [text-angular] .ta-scroll-window > .ta-bind').css( 'min-height', total - 73 ); // subtract padding of container
		    }, 250);
	    };

	    self.checkAuthorization = function() {
			AuthService.check().then( function( user ) {
				if( user ) {
					if( !user.local && !user.facebook.token && !user.twitter.token && !user.google.token ) {
						console.log('Logging user out.');
			        	AuthService.logout().then( function() {
				        	$rootScope.user = { _id: false, name: false, local: { email: false } };
						});
					} else {
						AuthService.set( user );
						DocumentService.sync();
					}
				} else {
					$rootScope.user = { _id: false, name: false, local: { email: false } };
				}
			});
	    };

	    self.openChallengeModal = function() {
		    var modal = new ModalFactory({
				class: 'small dialog',
				overlay: true,
				overlayClose: true,
				templateUrl: 'views/modals/timerSet.html',
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

	    self.openLoginModal = function() {
		    var modal = new ModalFactory({
				class: 'small dialog',
				overlay: true,
				overlayClose: true,
				templateUrl: 'views/modals/login.html',
				contentScope: {
					step: 1,
					closeModal: function( newDoc ) {
						modal.deactivate();

						$timeout(function() {
							modal.destroy();
						}, 1000);
						
						if( newDoc ) {
							self.openChallengeModal();
						}
					}
				}
			});
			modal.activate();
	    };

	    self.initWritingContainer = function() {
	    	console.log('init writing container');
	    	$analytics.eventTrack('Started Writing Session');
		    angular.element('.page-container').css( 'min-height', angular.element('.page-container').outerHeight() + 8 );
	    	self.enableWriting = true;
	    	self.text = 'Click here and start typing to begin...';
	    	if( !self.editMode ) {
		    	self.editor = textAngularManager.retrieveEditor('text-creator');
	    	} else {
		    	self.editor = textAngularManager.retrieveEditor('text-editor');
	    	}
	    	self.timer = self.limit.expiry;

	    	self.editor.scope.displayElements.text.click( function() {
	    		self.editor.scope.displayElements.text.html('&nbsp;');
		    	if( !self.editMode ) {
					textAngularManager.refreshEditor('text-creator');
				} else {
					textAngularManager.refreshEditor('text-editor');
				}
	    		if( self.limit.type === 'words' ) {
		    		self.wordCount = self.limit.value;
	    		}
	    		self.editor.scope.displayElements.text.off('click');
	    	});

	    	if( self.limit.type === 'time' ) {
				var timer = ( ( self.limit.value.min * 60 ) * 1000 ) + ( ( self.limit.value.hrs * 3600 ) * 1000 );
				var output = self.msToTime( timer );
				self.hourCounter = output.hrs;
				self.minuteCounter = output.min;
				self.secondCounter = output.sec;
	    	} else if( self.limit.type === 'words' ) {
	    		self.wordCount = self.limit.value;
    			self.beginWritingByWordCount();
	    	}
	    };

	    self.stoppedWriting = function() {
	    	console.log('stopped writing');
	    	if( self.enableWriting === true && !self.editMode && self.text !== '<p> </p>' ) {
    			self.detonate = $timeout( function() {
					$analytics.eventTrack('TIME UP Cleared Document');
					self.editor.scope.displayElements.text.html('&nbsp;');
			    	if( !self.editMode ) {
						textAngularManager.refreshEditor('text-creator');
					} else {
						textAngularManager.refreshEditor('text-editor');
					}
    				self.timer = self.limit.expiry;
    				angular.element('[text-angular] .ta-scroll-window > .ta-bind').css('opacity', 1);
			    	$interval.cancel( self.eraseTimer );
			    	$timeout.cancel( self.detonate );
    			}, self.limit.expiry * 1000);

    			self.eraseTimer = $interval( function() {
    				self.timer = self.timer - 1;
    				var opacity = angular.element('[text-angular] .ta-scroll-window > .ta-bind').css('opacity');
    				opacity = opacity - ( 1 / self.limit.expiry );
    				angular.element('[text-angular] .ta-scroll-window > .ta-bind').css('opacity', opacity);
    			}, 1000);
    		}
	    };

	    self.destroyTimers = function( $event ) {
	    	console.log('destroy timers');
	    	var inp = '';
	    	if( $event ) {
		    	inp = String.fromCharCode( $event.keyCode );
		    } else {
		    	console.log('no input event');
		    	return false;
		    }
			if ( /[a-zA-Z0-9-_ ]/.test( inp ) || $event.keyCode === 13 ) {
				if( self.detonate || self.eraseTimer ) {
		    		self.timer = self.limit.expiry;
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
			}
	    };

	    self.beginWritingByTime = function() {
	    	console.log('time mode');
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
	    	console.log('word count mode');
	    	self.counterStarted = true;
	    	self.wordCount = self.limit.value;

	    	self.countWatcher = $scope.$watch( function() {
				return self.editor.scope.wordcount;
			}, function( count ){
				if( count ) {
					self.wordCount = self.limit.value - count;
				}

				if( self.wordCount <= 0 ) {
					self.countWatcher();
					self.done();
				}
			});
	    };

	    self.initEditMode = function() {
	    	console.log('init edit mode');
	    	self.enableWriting = true;
	    	self.destroyTimers();
	    	self.finished = true;
		    self.showToolbar = true;
			self.counterStarted = false;
			self.editMode = true;
			self.limit = false;
			self.wordCount = 0;
	    };

	    self.done = function() {
	    	console.log('done!');
			$analytics.eventTrack('Finished Document', { label: self.text });

	    	var modal = new ModalFactory({
				class: 'small dialog',
				overlay: true,
				overlayClose: true,
				templateUrl: 'views/modals/finished.html',
				contentScope: {
					closeModal: function( title ) {
						if( title ) {
							DocumentService.autoSave( title, self.text );
							var docs = DocumentService.sync();
							console.log(docs);
							// var stateParams = {
							// 	docId: docs[ docs.length - 1 ]
							// };
							// $state.go('doc', stateParams);
						}

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
