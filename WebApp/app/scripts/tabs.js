(function ( $, win, doc ) {
	'use strict';

	$.fn.tabs = function(options) {
		var settings = $.extend({}, options ),
			activeClass = 'active',
			panelClass = 'tab-content';

		function tabClicked(e) {
			e.preventDefault();

			var $tab = $(this),
				$panel = $($tab.attr('href')),
				$siblingPanels = $panel.siblings('.' + panelClass);

			$tab.addClass(activeClass).siblings().removeClass(activeClass);

			$panel.show();
			$siblingPanels.hide();
		}

		return this.each(function() {
			var $this = $(this),
				$tabs = $this.find('.tab'),
				activeIndex = $tabs.filter('.' + activeClass).index() || 0,
				$panels = $this.find('.' + panelClass);

			$tabs.click(tabClicked);

			$panels.eq(activeIndex).show().siblings('.' + panelClass).hide();
		});
	};

}( jQuery, window, document ));