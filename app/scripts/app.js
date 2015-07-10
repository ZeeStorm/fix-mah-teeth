
'use strict';

/**
 * Mouth App
 */

import {services, controllers, directives, config} from './app.config';

var mouthApp = 'mouthApp';
var appConfig = ( $stateProvider, $urlRouterProvider ) => {
	$stateProvider
		// dashboard
		.state('dashboard', {
			url: '/',
			templateUrl: 'views/dashboard.html',
			controller: 'DashboardCtrl'
		})
		// search specialists
		.state('specialists', {
			url: '/specialists/:query',
			templateUrl: 'views/specialists-results.html',
			controller: 'SpecialistsCtrl'
		})
		// add / modify appointments
		.state('appointments', {
			url: '/appointments/:id',
			templateUrl: 'views/appointments.html',
			controller: 'AppointmentsCtrl'
		});

	$urlRouterProvider.otherwise('/');
};

var appRun = ( $rootScope, Specialists ) => {
	Specialists.loadSpecialists();
}

appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

angular.module( mouthApp, [
		'ui.router',
		'ngMaterial',
		config,
		services,
		controllers,
		directives
	])
	.config( appConfig )
	.run( appRun );

export default mouthApp;