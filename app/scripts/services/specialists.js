'use strict';

var Specialists = ($q, $rootScope, $sanitize, $timeout, $http, config) => {
	// get searches from local storage
	var searches = localStorage.getItem( 'specialists-searches' );
	
	// attempt to parse our search
	if ( searches ) {
		try {
			searches = JSON.parse( searches );
		} catch ( e ) {
			searches = [];
		}
	}
	
	// get saved from local storage
	var saved = localStorage.getItem( 'specialists-saved' );
	
	// attempt to parse our search
	if ( saved ) {
		try {
			saved = JSON.parse( saved );
		} catch ( e ) {
			saved = [];
		}
	}
	
	return {
		specialists: [],
		results: [],
		searches: searches || [],
		saved: saved || [],

		query: '',
		
		loadSpecialists() {
			console.log( 'loading specialists..' );
			$.getJSON( '/views/specialists.json' )
				.done(( obj ) => {
					// ensure we have an object, and it has specialists
					if ( obj && typeof obj.specialists != 'undefined' ) {
						this.specialists = obj.specialists;
					}
				});
		},
		
		getSpecialistById( id ) {
			for ( var i = 0, len = this.specialists.length; i < len; ++i ) {
				if ( this.specialists[ i ].id == id ) {
					return this.specialists[ i ];
				}
			}
			
			return false;
		},
		
		isLoading: false, // because we could have a web service call.. simulate with timeout

		saveSpecialist( id ) {
			if ( this.saved.indexOf( id ) => -1 ) {
				this.saved.unshift( id );
			}
		},

		searchSpecialists( query ) {
			this.isLoading = true;
			
			var deferred = $q.defer();

			$timeout( () => {
				var items = [];
				
				// normalize
				query = query.toLowerCase();
				
				// loop through each specialist
				for ( var i = 0, len = this.specialists.length; i < len; ++i ) {
					// now search each key
					for ( var k in this.specialists[ i ] ) {
						if ( this.specialists[ i ].hasOwnProperty( k ) ) {
							// look for a match after normalize
							if ( ( "" + this.specialists[ i ][ k ] ).toLowerCase().search( query ) > -1 ) {
								items.push( this.specialists[ i ] );
							}
						}
					}
				}
				
				if ( items.length )
				{
					deferred.resolve( items );
				}
				else
				{
					deferred.reject();
				}
			}, 1000 );

			return deferred.promise;
		},
		
		_appendSearch(val) {
			// add the new search
			this.searches.unshift( val );
			
			// then only save the last 10 right now
			while ( this.searches.length > 10 ) {
				this.searches.pop();
			}
		},

		handleInput(val) {
			// set our query.. even if blank
			this.query = val;
			
			// add to our recent searches
			if (val) {
				this.searches.unshift( val );

				this.searchSpecialists(val).then(
					// resolved
					(res) => {
						this.results = res;
						this.isLoading = false;
					},
					// rejected
					() => {
						this.results = [];
						this.isLoading = false;
					}
				);
			}
		}
	};
};

Search.$inject = ['$q', '$rootScope', '$sanitize', '$timeout', '$http', 'config'];

export default Search;