'use strict';

/**
 * Search Input
 */
var SearchInput = ($state, Specialists) => {
		return {
			restrict: 'E',
			scope: {},
			template: [
					'<div class="search-input">',
						'<input type="text" ng-model="query" placeholder="Search Specialists..."></input>',
						'<i ng-click="resetQuery()" ng-show="query.length" class="fa fa-times"></i>',
					'</div>'
				].join(''),

			link(scope, el, attrs) {
				var triggerSearch = () => {
					$state.go('search');
					Specialists.handleInput(scope.query);
				};

				el.bind('keydown', (e) => {
					if (e.keyCode === 13) {
						triggerSearch();
					}
				}).bind('search', () => {
					triggerSearch();
				});

				scope.resetQuery = () => {
					Specialists.query = '';
					scope.query = '';
				};
			}
		};
};

SearchInput.$inject = ['$state', 'Specialists'];

export default SearchInput;