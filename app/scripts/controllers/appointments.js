'use strict';

/**
 * Appointments Controller
 */
var AppointmentsCtrl = ($scope, $stateParams, $state, Appointments) => {
	if ( !$stateParams.id ) {
		$state.go( 'dashboard' );
	};
	
	// handle current appointments for this dentist
	$scope.appointments = [];
	
	// watch for saved array changes
	$scope.$watch(() => {
		return Appointments.saved;
	}, (val) => {
		// filter for our dentist id
		if ( typeof val[ $stateParams.id ] != 'undefined' && val[ $stateParams.id ].length ) {
			// we found some, save them in our scope
			$scope.appointments = val[ $stateParams.id ];
		}
	}, true);
	
	// use date module to get the current date
	var current = new Date();
	
	// init our data models with our current date info
	$scope.data = {
		month: current.getMonth() + 1,
		day: current.getDate(),
		year: current.getFullYear(),
		timeslot: false
	};
	
	// setup our submit function
	$scope.addAppointment = () => {
		Appointments.addAppointment( $stateParams.id, $scope.data );
	};
	
	// take our data sets from the Appointments service
	$scope.months = Appointments.months;
	$scope.days = Appointments.days;
	$scope.years = Appointments.years;
	$scope.times = Appointments.times;
};

AppointmentsCtrl.$inject = ['$scope', '$stateParams', '$state', 'Appointments'];

export default AppointmentsCtrl;