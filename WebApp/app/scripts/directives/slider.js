/*
	Requires jQuery nouislider

	Use attribute slider to trigger
*/

angular.module('foxwayApp')
.directive('slider', function ($timeout) {
	return {
		restrict: 'A',
		scope: {
			min: '@',
			max: '@',
			start: '@',
			step: '@',
			orientation: '@',
			direction: '@',
			model: '='
		},
		link: function (scope, element) {

			var jElement = jQuery(element);

			var options = {
				behaviour: 'extend-tap',
				range: {},
					serialization: {
					lower: [

						jQuery.Link({
							target: function( val ){

								$timeout(function(){
									scope.$apply(function(){
										console.log(val + "");
										if(scope.model){
											scope.model = val + "";
										}
									});
								});
								
							},
							format: {
								decimals: 0
							}
						})
					]
				}

			};

			if (scope.orientation) {
				options.orientation = scope.orientation;
			}

			if (scope.start) {
				options.start = Number(scope.start);
			}

			if (scope.direction) {
				options.direction = scope.direction;
			}

			if (scope.step) {
				options.step = Number(scope.step);
			}

			if (scope.min) {
				options.range.min = Number(scope.min);
			}

			if (scope.max) {
				options.range.max = Number(scope.max);
			}

			jElement.noUiSlider(options);

			// jElement.on('slide', function(){
			// 	var newVal = jQuery(this).val();
			// 	scope.$apply(function(){
			// 		console.log(newVal + "");
			// 		scope.model = newVal + "";
			// 	});
				
			// });

		}
	};
});