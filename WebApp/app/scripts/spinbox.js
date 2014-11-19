(function ( $ ) {
	'use strict';

	$.fn.spinbox = function (options) {

		function getVal(input) {
			var val = 0;

			val = Number(input.val()) || val;

			return val;
		}

		return this.each(function() {

			var $this = $(this),
				up = $this.find('button.spinbox-up'),
				down = $this.find('button.spinbox-down'),
				input = $this.find('input.spinbox-input'),
				max,
				min,
				step;

			if (typeof options.max != 'undefined') {
				max = Number(options.max);
			}

			if (typeof options.min != 'undefined') {
				min = Number(options.min);
			}

			if (typeof options.step != 'undefined') {
				step = Number(options.step);
			}
			else {
				step = 1;
			}

			if (typeof options.val != 'undefined') {
				
				input.val(options.val);
			}

			if (options.buttonPosition === 'bottom') {
				$this.addClass('spinbox-buttons-bottom');
			}

			if (!input.val() && min) {
				input.val(min);
			}

			if (input.val() == max) {
				up.attr('disabled', 'disabled');
			}
			else if (input.val() == min) {
				down.attr('disabled', 'disabled');
			}

			up.click(function () {
				var val = getVal(input) + step;

				if (max && val >= max) {
					val = max;
					up.attr('disabled', 'disabled');
				}

				if (down.is(':disabled')) {
					down.removeAttr('disabled');
				}

				input.val(val);

				$this.trigger('spinned', val);
			});

			down.click(function () {
				var val = getVal(input) - step;

				if (typeof min != 'undefined' && val <= min) {
					val = min;
					down.attr('disabled', 'disabled');
				}

				if (up.is(':disabled')) {
					up.removeAttr($(this).is(':disabled'));
				}

				input.val(val);

				$this.trigger('spinned', val);
			});

			$this.val = function () {
				return input.val();
			};

		});
	};

}( jQuery ));