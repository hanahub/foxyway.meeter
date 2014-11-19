var Keyboard = (function () {
	var shift = false, capslock = false;

	function getSpecialCharacter(key, shift) {
		var onOff = shift ? '.on' : '.off',
			childElement = key.children(onOff),
			character = childElement.length ? childElement.text() : key.text();

		return $.trim(character);
	}
	
	function init() {
		var button = $('.keyboard li button');
		var okButton = $('.filename-ok');
		var deleteButton = $('.filename-delete');

		button.unbind('click');
		button.click(function () {
			var $this = $(this),
				character = $.trim($this.text()); // If it's a lowercase letter, nothing happens to this variable
				
			var thisKeyBoard = $(this).parents('.panel-content');
			var $input = thisKeyBoard.find('.filename-input'); // $('#filename-input');

			// Shift keys
			if ($this.hasClass('shift')) {
				$('.letter', thisKeyBoard).toggleClass('uppercase');
				$('.shift', thisKeyBoard).toggleClass("selected");
				$('.symbol span', thisKeyBoard).toggle();

				shift = !shift;
				capslock = false;
				return false;
			}

			// Caps lock
			if ($this.hasClass('capslock')) {
				$('.letter', thisKeyBoard).toggleClass('uppercase');
				$('.caps', thisKeyBoard).toggleClass("selected");
				capslock = true;
				return false;
			}

			if ($this.hasClass('hide')) {
				try {
					$('.keyboard').hide();
				} catch (e) {
					alert("Error hiding keyboard");
					// document.getElementById('keyboard').style.display = "none";
				}
				return false;
			}

			// Delete
			if ($this.hasClass('delete')) {
				var text = $input.val();

				$input.val(text.substr(0, text.length - 1));
				return false;
			}

			// Special characters
			if ($this.hasClass('symbol')) character = getSpecialCharacter($this, shift);
			if ($this.hasClass('space')) character = ' ';
			if ($this.hasClass('return')) character = "\n";

			// Uppercase letter
			if ($this.hasClass('uppercase')) character = character.toUpperCase();

			// Remove shift once a key is clicked.
			if (shift === true) {
				$('.symbol span', thisKeyBoard).toggle();
				$('.shift', thisKeyBoard).removeClass("selected");

				if (capslock === false) $('.letter').toggleClass('uppercase');

				shift = false;
			}

			// Add the character
			$input.val($input.val() + character);

			$input.trigger('input');
		});

		deleteButton.unbind('click');
		deleteButton.click(function () {
			var thisKeyBoard = $(this).parents('.panel-content');
			var $input = thisKeyBoard.find('.filename-input');
			var	text = $input.val();

			$input.val(text.substr(0, text.length - 1));
		});



		// okButton.click(function () {
		// 	var thisKeyBoard = $(this).parents('.panel-content');
		// 	var $input = thisKeyBoard.find('.filename-input');
		// 	$input.trigger('input');
		// });
	}

	return {
		init: init
	};

})();