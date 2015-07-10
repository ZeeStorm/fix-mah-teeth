'use strict';

var Appointments = ($q, $rootScope, $timeout, $http, config) => {
	// get saved from local storage
	var saved = localStorage.getItem( 'appointments-saved' );
	
	// attempt to parse our search
	if ( saved ) {
		try {
			saved = JSON.parse( saved );
		} catch ( e ) {
			saved = {};
		}
	}
	
	var days = [];
	
	for ( var i = 1; i <= 31; ++i ) {
		days.push( i );
	}
	
	return {
		months: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		],
		days: days,
		years: [ 2015, 2016 ],
		times: [
			{
				id: '1000',
				text: '10:00 AM',
			},
			{
				id: '1030',
				text: '10:30 AM',
			},
			{
				id: '1100',
				text: '11:00 AM',
			},
			{
				id: '1130',
				text: '11:30 AM',
			},
			{
				id: '1400',
				text: '2:00 PM',
			},
			{
				id: '1430',
				text: '2:30 PM',
			},
			{
				id: '1500',
				text: '3:00 PM',
			},
			{
				id: '1530',
				text: '3:30 PM',
			},
			{
				id: '1600',
				text: '4:00 PM',
			},
			{
				id: '1630',
				text: '4:30 PM',
			},
		],
		saved: saved || {},
		
		addAppointment( specialistId, appointment ) {
			// ensure we have an array
			if ( typeof this.saved[ specialistId ] == 'undefined' ) {
				this.saved[ specialistId ] = [];
			}
						
			// add our time
			this.saved[ specialistId ].push( angular.copy( appointment ) );
			
			localStorage.setItem( 'appointments-saved', JSON.stringify( this.saved ) );
		}
	};
};

Appointments.$inject = ['$q', '$rootScope', '$timeout', '$http', 'config'];

export default Appointments;