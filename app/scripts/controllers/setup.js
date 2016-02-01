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
    	
    	if( ( lim.min < 0 || lim.hrs < 0 ) || ( lim.hrs === 0 && lim.min === 0 ) ) {
    		this.buttonText = 'Time only goes forward...';
    	} else {
		    this.buttonText = 'BEGIN';
    	}
    };

    this.limitByTime = function() {
    	var lim = this.timeLimit;

    	if( ( lim.min < 0 || lim.hrs < 0 ) || ( lim.hrs === 0 && lim.min === 0 ) ) {
    		this.buttonText = 'Time only goes forward...';
    		return false;
    	} else {
    		this.limit.type = 'time';
    		this.limit.value = lim;
    		$scope.closeModal( this.limit );
    	}
    };

    this.validifyWords = function() {
    	if( this.wordLimit <= 0 ) {
    		this.buttonText = 'That doesn\'t make sense...';
    	} else {
		    this.buttonText = 'BEGIN';
    	}
    };

    this.limitByWords = function() {
    	if( this.wordLimit <= 0 ) {
    		this.buttonText = 'That doesn\'t make sense...';
    		return false;
    	} else {
    		this.limit.type = 'words';
    		this.limit.value = this.wordLimit;
    		$scope.closeModal( this.limit );
    	}
    };

    this.init();
  }]);
