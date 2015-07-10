'use strict';

// ------------------------------------------------
// Imports
// ------------------------------------------------

/**
 * Services
 */
import Specialists from './services/specialists';
import Appointments from './services/appointments';

/**
 * Controllers
 */
import DashboardCtrl from './controllers/dashboard';
import SpecialistsCtrl from './controllers/specialists';
import AppointmentsCtrl from './controllers/appointments';

/**
 * Directives
 */
import SearchInput from './directives/search-input';

// ------------------------------------------------
// Module Registration
// ------------------------------------------------
var config = 'mouthApp.config';
var services = 'mouthApp.services';
var controllers = 'mouthApp.controllers';
var directives = 'mouthApp.directives';

/**
 * Config
 */
angular.module(config, [])
	.constant('config', {
	});

/**
 * Services
 */
angular.module(services, [])
	.factory('Specialists', Specialists)
	.factory('Appointments', Appointments);

/**
 * Controllers
 */
angular.module(controllers, [])
	.controller('DashboardCtrl', DashboardCtrl)
	.controller('SpecialistsCtrl', SpecialistsCtrl)
	.controller('AppointmentsCtrl', AppointmentsCtrl);

/**
 * Directives
 */
angular.module(directives, [])
	.directive('searchInput', SearchInput);

export { services, controllers, directives, config };