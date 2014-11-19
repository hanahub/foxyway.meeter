(function ( $, win, doc ) {
	'use strict';

	$.fn.panel = function(options) {
		var settings = $.extend({}, options);

		function showPanel() {
			var $this = $(this),
				panelId = $this.attr('data-panel'),
				currentPanel = $this.closest('.panel');

			currentPanel.hide();
			$(panelId).show();
		}

		return this.each(function() {
			var $this = $(this);

			$this.click(showPanel);
		});
	};

}( jQuery, window, document ));