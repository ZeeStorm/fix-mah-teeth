'use strict';

/**
 * Specialists Controller
 */
var SpecialistsCtrl = ($rootScope, $scope, $stateParams, Specialists) => {
	// init variables
	$scope.results = [];
	$scope.query = '';
	
	$scope.isLoading = false;
	$scope.enabled = false;

	$scope.saveSpecialist = ( id ) => {
		Specialists.saveSpecialist( id );
	};

	if ( $stateParams.query ) {
		Specialists.handleSearch( $stateParams.query );
	};
	
	// set up watchers
	// watch for results array updates
	$scope.$watch(() => {
		return Specialists.results;
	}, (val) => {
		if (val) {
			$scope.results = val;
		}
	});

	// watch for search query changes
	$scope.$watch(() => {
		return Specialists.query;
	}, (val) => {
		if (!val) {
			$scope.query = Specialists.query;
			$scope.results = [];
		}
	});
	
	// watch for loading bool
	$scope.$watch(() => {
		return Specialists.isLoading;
	}, (val) => {
		$scope.isLoading = Specialists.isLoading;
	});
};

SpecialistsCtrl.$inject = ['$rootScope', '$scope', '$stateParams', 'Specialists'];

export default SpecialistsCtrl;