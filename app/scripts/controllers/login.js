'use strict';

/**
 * @ngdoc function
 * @name freestateApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the freestateApp
 */
angular.module('freestateApp')
  .controller('LoginCtrl', [ '$rootScope', '$scope', 'AuthService', 'DocumentService', '$state', '$timeout', 'ModalFactory', 'Document', function( $rootScope, $scope, AuthService, DocumentService, $state, $timeout, ModalFactory, Document ){
	var self = this;

	self.login = function() {
		AuthService.login( self.data ).then( function( user ) {
			if( user._id ) {
				AuthService.set( user );
				DocumentService.sync();
				self.step = 1;
			} else {
				console.log('User not set...');
			}
		});
	};

	self.signUp = function() {
		AuthService.signUp( self.data ).then( function( user ) {
			if( user._id ) {
				AuthService.set( user );
				self.step = 1;
			} else {
				console.log('User not set...');
			}
		});
	};

	self.socialLogin = function( network ) {
		AuthService.socialLogin( network );
		$rootScope.$on('socialLoginSuccess', function( event, user ) {
			if( user._id ) {
				AuthService.set( user );
				self.step = 1;
				$scope.$apply();
			} else {
				console.log('User not set...');
			}
		});
	};

	self.unlink = function( network ) {
		AuthService.unlink( network ).then( function( user ) {
			AuthService.set( user, true );
			if( !user.local.password && !user.facebook.token && !user.twitter.token && !user.google.token ) {
	        	self.logout();
			}
		});
	};

	self.openDeleteModal = function( id ) {
    	var modal = new ModalFactory({
			class: 'small dialog',
			overlay: true,
			overlayClose: true,
			templateUrl: 'views/modals/deleteDocument.html',
			contentScope: {
				docId: id,
				closeModal: function( id ) {
					if( id ) {
						Document.delete({
							userId: $rootScope.user._id,
							docId: id
						}, function() {
							console.log('document deleted');
						});
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

	self.logout = function() {
		AuthService.logout().then( function() {
        	$rootScope.user = { _id: false, name: false, local: { email: false } };
        	if( !$state.is('root') ) {
        		$state.go('root');
        	}
		});
	};

}]);