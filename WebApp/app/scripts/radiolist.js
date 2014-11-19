(function ( $ ) {
	'use strict';

	$.fn.radioList = function(options) {

		return this.each(function() {

			var list = $(this);

			list.find('input').change(function() {
				$(this).parent().toggleClass('button-selected', this.checked).siblings().removeClass('button-selected');

				if(options.itemChange) {
					options.itemChange.call(this);
				}
			})
			.filter(':checked').parent().addClass('button-selected');

		});
	};

}( jQuery ));