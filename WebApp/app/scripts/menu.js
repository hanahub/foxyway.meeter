(function ( $ ) {
	'use strict';

	var defaults = {
			direction: 'down', // 'up' or 'down'
			itemClick: null, // function handler
			closeOnItemClick: true // true or false
		};

	$.fn.menu = function(opts) {
		var options = $.extend({}, defaults, opts);

		function toggleMenu(e) {
			e.stopPropagation();

			var button = $(this),
				menuId = '#' + button.attr('menu-id'),
				menu = $(menuId),
				buttonPos = button.offset(),
				buttonWidth = button.outerWidth(),
				menuWidth = menu.outerWidth(),
				menuOffset = 2,
				direction = button.attr('menu-direction') || options.direction,
				top = 0;

			button.toggleClass('button-active');
			menu.toggleClass('menu-show');

			if(menuWidth < buttonWidth) {
				menuWidth = buttonWidth;
			}

			if(direction === 'down') {
				top = buttonPos.top + button.outerHeight() + menuOffset;
			}
			else {
				top = buttonPos.top - menu.outerHeight() - menuOffset;
			}

			menu.css({ 
				top: top, 
				left: buttonPos.left,
				width: menuWidth
			});
		}

		return $(this).each(function() {
			var button = $(this),
				menuId = button.attr('menu-id'),
				menu = $('#' + menuId),
				menuItems = menu.find('button, .button');

			menu.data('opener', button);

			button.click(toggleMenu);

			menuItems.click(function() {


			    if(options.closeOnItemClick) {
			    	menu.data('opener').removeClass('button-active');
			    	menu.removeClass('menu-show');
			    }

			    //if(options.itemClick) {
			    //	options.itemClick.call(this, menu.data('opener'));
			    //}

			});

		});
	};

	// close menus when click outside 
	$(document).click(function () {
		$('div.menu-show').each(function () {

			$(this).removeClass('menu-show')
				.data('opener').removeClass('button-active');
		});
	});

}( jQuery ));