(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var mouthApp = _interopRequire(require("./app"));

angular.element(document).ready(function () {
	angular.bootstrap(document, [mouthApp]);
});

},{"./app":3}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
"use strict";

// ------------------------------------------------
// Imports
// ------------------------------------------------

/**
 * Services
 */

var Specialists = _interopRequire(require("./services/specialists"));

var Appointments = _interopRequire(require("./services/appointments"));

/**
 * Controllers
 */

var DashboardCtrl = _interopRequire(require("./controllers/dashboard"));

var SearchListCtrl = _interopRequire(require("./controllers/searchList"));

var SpecialistsCtrl = _interopRequire(require("./controllers/specialists"));

var AppointmentsCtrl = _interopRequire(require("./controllers/appointments"));

/**
 * Directives
 */

var SearchInput = _interopRequire(require("./directives/search-input"));

// ------------------------------------------------
// Module Registration
// ------------------------------------------------
var config = "mouthApp.config";
var services = "mouthApp.services";
var controllers = "mouthApp.controllers";
var directives = "mouthApp.directives";

/**
 * Config
 */
angular.module(config, []).constant("config", {});

/**
 * Services
 */
angular.module(services, []).factory("Specialists", Specialists).factory("Appointments", Appointments);

/**
 * Controllers
 */
angular.module(controllers, []).controller("DashboardCtrl", DashboardCtrl).controller("SpecialistsCtrl", SpecialistsCtrl).controller("SearchListCtrl", SearchListCtrl).controller("AppointmentsCtrl", AppointmentsCtrl);

/**
 * Directives
 */
angular.module(directives, []).directive("searchInput", SearchInput);

exports.services = services;
exports.controllers = controllers;
exports.directives = directives;
exports.config = config;

},{"./controllers/appointments":4,"./controllers/dashboard":5,"./controllers/searchList":6,"./controllers/specialists":7,"./directives/search-input":8,"./services/appointments":9,"./services/specialists":10}],3:[function(require,module,exports){

"use strict";

/**
 * Mouth App
 */

var _appConfig = require("./app.config");

var services = _appConfig.services;
var controllers = _appConfig.controllers;
var directives = _appConfig.directives;
var config = _appConfig.config;

var mouthApp = "mouthApp";
var appConfig = function ($stateProvider, $urlRouterProvider) {
	$stateProvider
	// dashboard
	.state("dashboard", {
		url: "/",
		templateUrl: "views/dashboard.html",
		controller: "DashboardCtrl"
	})
	// search specialists
	.state("specialists", {
		url: "/specialists/:query",
		templateUrl: "views/specialists-results.html",
		controller: "SpecialistsCtrl"
	})
	// add / modify appointments
	.state("appointments", {
		url: "/appointments/:id",
		templateUrl: "views/appointments.html",
		controller: "AppointmentsCtrl"
	});

	$urlRouterProvider.otherwise("/");
};

var appRun = function ($rootScope, Specialists) {
	Specialists.loadSpecialists();
};

appConfig.$inject = ["$stateProvider", "$urlRouterProvider"];

angular.module(mouthApp, ["ui.router", "ngMaterial", config, services, controllers, directives]).config(appConfig).run(appRun);

module.exports = mouthApp;

},{"./app.config":2}],4:[function(require,module,exports){
"use strict";

/**
 * Appointments Controller
 */
var AppointmentsCtrl = function ($scope, $stateParams, $state, Appointments) {
	if (!$stateParams.id) {
		$state.go("dashboard");
	};

	// handle current appointments for this dentist
	$scope.appointments = [];

	// watch for saved array changes
	$scope.$watch(function () {
		return Appointments.saved;
	}, function (val) {
		// filter for our dentist id
		if (typeof val[$stateParams.id] != "undefined" && val[$stateParams.id].length) {
			// we found some, save them in our scope
			$scope.appointments = val[$stateParams.id];
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
	$scope.addAppointment = function () {
		Appointments.addAppointment($stateParams.id, $scope.data);
	};

	// take our data sets from the Appointments service
	$scope.months = Appointments.months;
	$scope.days = Appointments.days;
	$scope.years = Appointments.years;
	$scope.times = Appointments.times;
};

AppointmentsCtrl.$inject = ["$scope", "$stateParams", "$state", "Appointments"];

module.exports = AppointmentsCtrl;

},{}],5:[function(require,module,exports){
"use strict";

/**
 * Dashboard Controller
 */
var DashboardCtrl = function ($scope, Specialists, Appointments) {
	$scope.saved = [];
	$scope.specialists = [];
	$scope.appointments = {};

	// this could do a better xor instead of replacing the array everytime..
	function reloadSpecialists() {
		if ($scope.saved.length) {
			var saved_specialists = [],
			    specialist;

			// pull in information for each
			for (var i = 0, len = $scope.saved.length; i < len; ++i) {
				specialist = Specialists.getSpecialistById($scope.saved[i]);

				// ensure specialist is not false
				if (specialist) {
					saved_specialists.push(specialist);
				}
			}

			$scope.specialists = saved_specialists;
		} else {
			$scope.specialists = [];
		}
	};

	// watch for saved array changes
	$scope.$watch(function () {
		return Specialists.saved;
	}, function (val) {
		$scope.saved = val;

		// get our details and put them into specialists
		reloadSpecialists();
	});

	// watch for saved array changes
	$scope.$watch(function () {
		return Appointments.saved;
	}, function (val) {
		$scope.appointments = val || {};
	}, true);
};

DashboardCtrl.$inject = ["$scope", "Specialists", "Appointments"];

module.exports = DashboardCtrl;

},{}],6:[function(require,module,exports){
"use strict";

/**
 * Search List Controller
 * Maintains the last search results
 */
var SearchListCtrl = function ($scope, Specialists) {
	$scope.searches = [];

	// watch for previous searches array changes
	$scope.$watch(function () {
		return Specialists.searches;
	}, function (val) {
		$scope.searches = val || [];
	});
};

SearchListCtrl.$inject = ["$scope", "Specialists"];

module.exports = SearchListCtrl;

},{}],7:[function(require,module,exports){
"use strict";

/**
 * Specialists Controller
 */
var SpecialistsCtrl = function ($rootScope, $scope, $stateParams, Specialists) {
	// init variables
	$scope.results = [];
	$scope.query = "";

	$scope.isLoading = false;
	$scope.enabled = false;

	$scope.saveSpecialist = function (id) {
		Specialists.saveSpecialist(id);
	};

	if ($stateParams.query) {
		Specialists.handleSearch($stateParams.query);
	};

	// set up watchers
	// watch for results array updates
	$scope.$watch(function () {
		return Specialists.results;
	}, function (val) {
		if (val) {
			$scope.results = val;
		}
	});

	// watch for search query changes
	$scope.$watch(function () {
		return Specialists.query;
	}, function (val) {
		if (!val) {
			$scope.query = Specialists.query;
			$scope.results = [];
		}
	});

	// watch for loading bool
	$scope.$watch(function () {
		return Specialists.isLoading;
	}, function (val) {
		$scope.isLoading = Specialists.isLoading;
	});
};

SpecialistsCtrl.$inject = ["$rootScope", "$scope", "$stateParams", "Specialists"];

module.exports = SpecialistsCtrl;

},{}],8:[function(require,module,exports){
"use strict";

/**
 * Search Input
 */
var SearchInput = function ($state, Specialists) {
	return {
		restrict: "E",
		scope: {},
		template: ["<div class=\"search-input\">", "<input type=\"text\" ng-model=\"query\" placeholder=\"Search Specialists...\"></input>", "<i ng-click=\"resetQuery()\" ng-show=\"query.length\" class=\"fa fa-times\"></i>", "</div>"].join(""),

		link: function link(scope, el, attrs) {
			var triggerSearch = function () {
				$state.go("specialists", { query: scope.query });
			};

			el.bind("keydown", function (e) {
				if (e.keyCode === 13) {
					triggerSearch();
				}
			});

			scope.resetQuery = function () {
				Specialists.query = "";
				scope.query = "";
			};
		}
	};
};

SearchInput.$inject = ["$state", "Specialists"];

module.exports = SearchInput;

},{}],9:[function(require,module,exports){
"use strict";

var Appointments = function ($q, $rootScope, $timeout, $http, config) {
	// get saved from local storage
	var saved = localStorage.getItem("appointments-saved");

	// attempt to parse our search
	if (saved) {
		try {
			saved = JSON.parse(saved);
		} catch (e) {
			saved = {};
		}
	}

	var days = [];

	for (var i = 1; i <= 31; ++i) {
		days.push(i);
	}

	return {
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		days: days,
		years: [2015, 2016],
		times: [{
			id: "1000",
			text: "10:00 AM" }, {
			id: "1030",
			text: "10:30 AM" }, {
			id: "1100",
			text: "11:00 AM" }, {
			id: "1130",
			text: "11:30 AM" }, {
			id: "1400",
			text: "2:00 PM" }, {
			id: "1430",
			text: "2:30 PM" }, {
			id: "1500",
			text: "3:00 PM" }, {
			id: "1530",
			text: "3:30 PM" }, {
			id: "1600",
			text: "4:00 PM" }, {
			id: "1630",
			text: "4:30 PM" }],
		saved: saved || {},

		addAppointment: function addAppointment(specialistId, appointment) {
			// ensure we have an array
			if (typeof this.saved[specialistId] == "undefined") {
				this.saved[specialistId] = [];
			}

			// add our time
			this.saved[specialistId].push(angular.copy(appointment));

			localStorage.setItem("appointments-saved", JSON.stringify(this.saved));
		}
	};
};

Appointments.$inject = ["$q", "$rootScope", "$timeout", "$http", "config"];

module.exports = Appointments;

},{}],10:[function(require,module,exports){
"use strict";

var Specialists = function ($q, $rootScope, $timeout, $http, config) {
	// get searches from local storage
	var searches = localStorage.getItem("specialists-searches");

	// attempt to parse our search
	if (searches) {
		try {
			searches = JSON.parse(searches);
		} catch (e) {
			searches = [];
		}
	}

	// get saved from local storage
	var saved = localStorage.getItem("specialists-saved");

	// attempt to parse our search
	if (saved) {
		try {
			saved = JSON.parse(saved);
		} catch (e) {
			saved = [];
		}
	}

	return {
		specialists: [],
		results: [],
		searches: searches || [],
		saved: saved || [],

		query: "",
		isLoading: false, // because we could have a web service call.. simulate with timeout

		loadSpecialists: function loadSpecialists() {
			var _this = this;

			console.log("loading specialists..");
			$.getJSON("/views/specialists.json").done(function (obj) {
				// ensure we have an object, and it has specialists
				if (obj && typeof obj.specialists != "undefined") {
					_this.specialists = obj.specialists;
				}
			});
		},

		getSpecialistById: function getSpecialistById(id) {
			for (var i = 0, len = this.specialists.length; i < len; ++i) {
				if (this.specialists[i].id == id) {
					return this.specialists[i];
				}
			}

			return false;
		},

		saveSpecialist: function saveSpecialist(id) {
			if (this.saved.indexOf(id) == -1) {
				this.saved.unshift(id);

				localStorage.setItem("specialists-saved", JSON.stringify(this.saved));
			}
		},

		searchSpecialists: function searchSpecialists(query) {
			var _this = this;

			this.isLoading = true;

			var deferred = $q.defer();

			$timeout(function () {
				var items = [];

				// normalize
				query = query.toLowerCase();

				// loop through each specialist
				for (var i = 0, len = _this.specialists.length; i < len; ++i) {
					// now search each key
					for (var k in _this.specialists[i]) {
						if (_this.specialists[i].hasOwnProperty(k)) {
							// look for a match after normalize
							if (("" + _this.specialists[i][k]).toLowerCase().search(query) > -1) {
								items.push(_this.specialists[i]);
								break;
							}
						}
					}
				}

				if (items.length) {
					deferred.resolve(items);
				} else {
					deferred.reject();
				}
			}, 500);

			return deferred.promise;
		},

		_appendSearch: function _appendSearch(val) {
			// add the new search
			this.searches.unshift(val);

			// then only save the last 10 right now
			while (this.searches.length > 10) {
				this.searches.pop();
			}

			localStorage.setItem("specialists-searches", JSON.stringify(this.searches));
		},

		handleSearch: function handleSearch(val) {
			var _this = this;

			// set our query.. even if blank
			this.query = val;

			// add to our recent searches
			if (val) {
				this._appendSearch(val);

				this.searchSpecialists(val).then(
				// resolved
				function (res) {
					_this.results = res;
					_this.isLoading = false;
				},
				// rejected
				function () {
					_this.results = [];
					_this.isLoading = false;
				});
			}
		}
	};
};

Specialists.$inject = ["$q", "$rootScope", "$timeout", "$http", "config"];

module.exports = Specialists;

},{}]},{},[1]);
