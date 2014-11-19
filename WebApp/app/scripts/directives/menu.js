/*
	Requires jQuery.menu plugin

	Use attribute menu-id to trigger the directive. menu-id should be the id of the HTML element that contains the menu.
	Use menu-direction="up|down" to specify the direction that the menu should be opened in.
*/

angular.module('foxwayApp')
.directive('menuId', function () {
	return {
		restrict: 'A',
		scope: {},
		link: function (scope, element) {
			$(element).menu({
				closeOnItemClick: true
			});
		}
	};
});