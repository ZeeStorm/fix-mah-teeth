'use strict';

/**
 * Search List Controller
 * Maintains the last search results
 */
var SearchListCtrl = ( $scope, Specialists)  => {
	$scope.searches = [];

	// watch for previous searches array changes
	$scope.$watch(() => {
		return Specialists.searches;
	}, (val) => {
		$scope.searches = val || [];
	});
};

SearchListCtrl.$inject = ['$scope', 'Specialists'];

export default SearchListCtrl;