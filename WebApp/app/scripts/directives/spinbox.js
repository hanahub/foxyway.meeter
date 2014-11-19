/*
	Requires jQuery spinbox

	Use spinbox attr to trigger
*/

angular.module('foxwayApp')
.directive('spinbox', function ($timeout) {
	return {
		restrict: 'A',
		scope: {
			min: '@',
			max: '@',
			step: '@',
			text: '@',
			value: '@',
			buttonPosition: '@',
			model: '='
		},
		template: '<span class="spinbox-label">{{text}}</span>' +
					'<div class="spinbox-input-wrapper"><input type="text" class="spinbox-input" ng-model="model" /></div>' +
					'<button class="spinbox-up"></button>' +
					'<button class="spinbox-down"></button>',
		transclude: true,
		link: function (scope, element) {

			var options = {};

			if (scope.step) {
				options.step = Number(scope.step);
			}

			if (scope.min) {
				options.min = Number(scope.min);
			}

			if (scope.max) {
				options.max = Number(scope.max);
			}

			if (scope.value) {
				options.val = Number(scope.value);
			}

			if (scope.buttonPosition === 'bottom') {
				options.buttonPosition = 'bottom';
			}

			$(element).addClass('spinbox').spinbox(options);

			$(element).on('spinned', function(event, val){
				$timeout(function(){
					scope.$apply(function(){
						console.log(val + "");
						if(typeof scope.model !== "undefined"){
							scope.model = val + "";
						}
					});
				});
			});

		}
	};
});