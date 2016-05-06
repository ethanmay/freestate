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

		function update( localDoc, serverDoc ) {
			console.log('updating server document');
			console.log(localDoc);
			serverDoc.title = localDoc.title;
			serverDoc.content = localDoc.text;
			serverDoc.$save({ userId: $rootScope.user._id });
		}

		function save( doc ) {
			if( !$rootScope.user._id ) {
				console.log( 'User not set. Can\'t save document.' );
				return false;
			}

			console.log('documentService saving document');
			var newDoc = new Document();
			angular.copy( doc, newDoc );
			newDoc.$save({ userId: $rootScope.user._id });
		}

		function autoSave( title, text ) {
			console.log('documentService autosaving');

			var newDoc = new Document();
			var d = new Date();
			newDoc.created = d;
			if( title ) {
				newDoc.title = title;
			} else {
				newDoc.title = 'Autosave on ' + d.toDateString() + ' ' + d.toLocaleTimeString();
			}
			if( text ) {
				newDoc.text = text;
			}
			
			var curdocs = AutoSave.get('docs');
			if( curdocs ) {
				console.log(curdocs);
			} else {
				var docs = [newDoc];
				AutoSave.set('docs', docs);
			}
		}
		
		function syncAllDocuments() {

			if( !$rootScope.user._id ) {
				console.log( 'User not set. Can\'t perform sync.' );
				return false;
			}

			console.log('documentService performing Sync,', 'uid =', $rootScope.user._id);
			var localDocs = AutoSave.get('docs');

			var serverDocs = Document.query({ userId: $rootScope.user._id }, function() {
				if( serverDocs.$resolved ) {
					console.log('doc resource resolved', serverDocs);

					// Compare local docs to server docs
					if( localDocs ) {
						var count = 0;
						angular.forEach( localDocs, function( localDoc ) {
							count++;
							console.log('testing localdoc #' + count + ' against server docs');

							// if server docs, make sure we dont overwrite them
							if( serverDocs.length > 0 ) {
								// var sync = [];
								angular.forEach( serverDocs, function( serverDoc ) {
									var localCreate = localDoc.created;
									var serverCreate = new Date( serverDoc.created );
									if( angular.equals( serverCreate, localCreate ) ) {
										console.log('doc exists on server');
										update( serverDoc, localDoc );
									} else {
										console.log('new document');
										save( localDoc );
									}
								});
							} else {
								console.log( 'Nothing on server, syncing new doc' );
								save( localDoc );
							}

							// remove autosaved docs
							if( count === localDocs.length ) {
								console.log('clearing autosave');
								AutoSave.remove('docs');
								$rootScope.docs = serverDocs;
								return $rootScope.docs;
							}
						});
					} else {
						console.log('no local docs');
						$rootScope.docs = serverDocs;
						return $rootScope.docs;
					}
				} else {
					console.error('doc resource NOT resolved');
					return false;
				}
			});
		}
		
		var service = {
			autoSave: autoSave,
			save: save,
			sync: syncAllDocuments
		};

		return service;
	}]);