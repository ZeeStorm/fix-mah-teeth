'use strict';

/**
 * Dashboard Controller
 */
var DashboardCtrl = ($scope, Specialists) => {
	$scope.saved = [];
	$scope.searches = [];

	// watch for previous searches array changes
	$scope.$watch(() => {
		return Search.searches;
	}, (val) => {
		$scope.searches = val || [];
	});

	// watch for saved array changes
	$scope.$watch(() => {
		return Search.saved;
	}, (val) => {
		val = val || [];
		
		if ( val.length ) {
			var saved = [],
				specialist;
			
			// pull in information for each
			for ( var i = 0, len = val.length; i < len; ++i ) {
				specialist = Specialists.getSpecialistById( val[ i ] );
				
				// ensure specialist is not false
				if ( specialist ) {
					saved.push( specialist );
				}
			}
			
			$scope.saved = saved;
		} else {
			$scope.saved = [];
		}
	});
};

DashboardCtrl.$inject = ['$scope', 'Search'];

export default DashboardCtrl;