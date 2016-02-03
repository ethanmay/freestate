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
    
    this.init = function() {
        this.expiry = 0;
	    this.timeLimit = {
	    	min: 0,
	    	hrs: 0
	    };
	    this.wordLimit = 0;
	    this.buttonText = 'BEGIN';
        this.limit = {};
    };

    this.validifyTime = function() {
    	var lim = this.timeLimit;
    	
    	if( ( lim.min < 0 || lim.hrs < 0 ) || ( lim.hrs === 0 && lim.min === 0 ) || ( !lim.hrs && !lim.min ) ) {
    		this.buttonText = 'Time only goes forward...';
    	} else {
		    this.buttonText = 'Next';
    	}
    };

    this.limitByTime = function() {
    	var lim = this.timeLimit;

    	if( ( lim.min < 0 || lim.hrs < 0 ) || ( lim.hrs === 0 && lim.min === 0 ) || ( !lim.hrs && !lim.min ) ) {
    		this.buttonText = 'Time only goes forward...';
    		return false;
    	} else {
    		this.limit.type = 'time';
    		this.limit.value = lim;
            this.buttonText = 'BEGIN';
            $scope.step = 'expire';
    	}
    };

    this.validifyWords = function() {
    	if( this.wordLimit <= 0 || !this.wordLimit ) {
    		this.buttonText = 'That doesn\'t make sense...';
    	} else {
		    this.buttonText = 'Next';
    	}
    };

    this.limitByWords = function() {
    	if( this.wordLimit <= 0 || !this.wordLimit ) {
    		this.buttonText = 'That doesn\'t make sense...';
    		return false;
    	} else {
    		this.limit.type = 'words';
    		this.limit.value = this.wordLimit;
            this.buttonText = 'BEGIN';
    		$scope.step = 'expire';
    	}
    };

    this.validifyExpiry = function() {
        var lim = this.expiry;
        
        if( lim < 0 || lim === 0 || !lim ) {
            this.buttonText = 'Time only goes forward...';
        } else {
            this.buttonText = 'BEGIN';
        }
    };

    this.setExpirationTime = function() {
        var lim = this.expiry;

        if( lim < 0 || lim === 0 || !lim ) {
            this.buttonText = 'Time only goes forward...';
            return false;
        } else {
            this.limit.expiry = lim;
            $scope.closeModal( this.limit );
        }
    };

    this.init();
  }]);
