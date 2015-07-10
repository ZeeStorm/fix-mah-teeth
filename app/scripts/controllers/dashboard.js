'use strict';

/**
 * Dashboard Controller
 */
var DashboardCtrl = ($scope, Specialists, Appointments) => {
	$scope.saved = [];
	$scope.specialists = [];
	$scope.appointments = {};

	// this could do a better xor instead of replacing the array everytime..
	function reloadSpecialists() {
		if ( $scope.saved.length ) {
			var saved_specialists = [],
				specialist;
			
			// pull in information for each
			for ( var i = 0, len = $scope.saved.length; i < len; ++i ) {
				specialist = Specialists.getSpecialistById( $scope.saved[ i ] );
				
				// ensure specialist is not false
				if ( specialist ) {
					saved_specialists.push( specialist );
				}
			}
			
			$scope.specialists = saved_specialists;
		} else {
			$scope.specialists = [];
		}
	};

	// watch for saved array changes
	$scope.$watch(() => {
		return Specialists.saved;
	}, (val) => {
		$scope.saved = val;
		
		// get our details and put them into specialists
		reloadSpecialists();
	});

	// watch for saved array changes
	$scope.$watch(() => {
		return Appointments.saved;
	}, (val) => {
		$scope.appointments = val || {};
	}, true);
};

DashboardCtrl.$inject = ['$scope', 'Specialists', 'Appointments'];

export default DashboardCtrl;