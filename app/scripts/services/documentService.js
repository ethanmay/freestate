'use strict';

/**
 * @ngdoc service
 * @name freestateApp.DocumentService
 * @description
 * # DocumentService
 * Service in the freestateApp
 */
angular.module('freestateApp')
	.factory('DocumentService', [ '$rootScope', 'AuthService', 'Document', 'AutoSave', function( $rootScope, AuthService, Document, AutoSave ) {
		
		function syncAllDocuments() {

			if( !$rootScope.user._id ) {
				console.log( 'User not set. Can\'t perform sync.' );
				return false;
			}

			console.log('documentService performing Sync');
			var localDocs = AutoSave.get('docs');

			var serverDocs = Document.query({ userId: $rootScope.user._id }, function() {
				if( serverDocs.$resolved ) {
					$rootScope.docs = serverDocs;

					// Compare local docs to server docs
					if( localDocs ) {
						angular.forEach( localDocs, function( localDoc ) {
							angular.forEach( $rootScope.docs, function( serverDoc ) {
								if( !angular.equals( serverDoc.created, localDoc.created ) ) {
									console.log( 'Syncing new document' );
									var newDoc = new Document();
									angular.copy( localDoc, newDoc );
									newDoc.$save({ userId: $rootScope.user._id });
								} else {
									// Remove local doc....
								}
							});
						});
					}
				}
			});
		}
		
		var service = {
			syncAll: syncAllDocuments
		};

		return service;
	}]);