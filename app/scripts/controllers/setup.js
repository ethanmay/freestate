'use strict';

/**
 * @ngdoc function
 * @name freestateApp.controller:SetupCtrl
 * @description
 * # SetupCtrl
 * Controller of the freestateApp
 */
angular.module('freestateApp')
  .controller('SetupCtrl', [ '$scope', function( $scope ){
    var self = this;

    self.init = function() {
        self.expiry = 0;
	    self.timeLimit = {
	    	min: 0,
	    	hrs: 0
	    };
	    self.wordLimit = 0;
	    self.buttonText = 'BEGIN';
        self.limit = {};
    };

    self.clearInput = function( e ) {
        angular.element( e.target ).val( '' );
    };

    self.validifyTime = function() {
    	var lim = self.timeLimit;
    	
    	if( ( lim.min < 0 || lim.hrs < 0 ) || ( lim.hrs === 0 && lim.min === 0 ) || ( !lim.hrs && !lim.min ) ) {
    		self.buttonText = 'Time only goes forward...';
    	} else {
		    self.buttonText = 'Next';
    	}
    };

    self.limitByTime = function() {
    	var lim = self.timeLimit;

    	if( ( lim.min < 0 || lim.hrs < 0 ) || ( lim.hrs === 0 && lim.min === 0 ) || ( !lim.hrs && !lim.min ) ) {
    		self.buttonText = 'Time only goes forward...';
    		return false;
    	} else {
    		self.limit.type = 'time';
    		self.limit.value = lim;
            self.buttonText = 'BEGIN';
            $scope.step = 'expire';
    	}
    };

    self.validifyWords = function() {
    	if( self.wordLimit <= 0 || !self.wordLimit ) {
    		self.buttonText = 'That doesn\'t make sense...';
    	} else {
		    self.buttonText = 'Next';
    	}
    };

    self.limitByWords = function() {
    	if( self.wordLimit <= 0 || !self.wordLimit ) {
    		self.buttonText = 'That doesn\'t make sense...';
    		return false;
    	} else {
    		self.limit.type = 'words';
    		self.limit.value = self.wordLimit;
            self.buttonText = 'BEGIN';
    		$scope.step = 'expire';
    	}
    };

    self.validifyExpiry = function() {
        var lim = self.expiry;
        
        if( lim < 0 || lim === 0 || !lim ) {
            self.buttonText = 'Time only goes forward...';
        } else {
            self.buttonText = 'BEGIN';
        }
    };

    self.setExpirationTime = function() {
        var lim = self.expiry;

        if( lim < 0 || lim === 0 || !lim ) {
            self.buttonText = 'Time only goes forward...';
            return false;
        } else {
            self.limit.expiry = lim;
            $scope.closeModal( self.limit );
        }
    };

    self.init();
  }]);
