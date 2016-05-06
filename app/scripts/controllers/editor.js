'use strict';

/**
 * @ngdoc function
 * @name freestateApp.controller:EditCtrl
 * @description
 * # EditCtrl
 * Controller of the freestateApp
 */
angular.module('freestateApp')
  .controller('EditCtrl', [
  	'$scope',
  	'$rootScope',
  	'Document',
  	'$state',
  	'$stateParams',
  	function( $scope, $rootScope, Document, $state, $stateParams ){
      var self = this;

      self.init = function() {
        if( !angular.isDefined( $stateParams.docId ) || !angular.isDefined( $rootScope.user._id ) ) {
          $state.go('root');
        }

        var docResource = Document.get({
          userId: $rootScope.user._id,
          docId: $stateParams.docId
        }, function(){
          if( docResource.$resolved && angular.isDefined( docResource.doc ) ) {
            $scope.main.text = docResource.doc.content;
            $scope.main.enableWriting = true;
            $scope.main.initEditMode();
          }
        });
      };

      self.init();
    }]);