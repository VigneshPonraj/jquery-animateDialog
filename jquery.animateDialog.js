(function($) {
	var properties = [
		"name",
		"iteration-count",
		"duration",
		"timing-function",
		"delay",
		"direction"
	], defaults = {
		"name" : "fade",
		"iteration-count" : 1,
		"duration" : "3s",
		"timing-function" : "ease",
		"delay" : "0s",
		"direction" : "normal"
	};

	function MessageDialog($el) {
		function durationToMillis(value) {
			var idx1 = value.indexOf("ms"),
				idx2 = value.indexOf("s");
			if (idx1 != -1) {
				value = value.substring(0, value.length - 2);
				return parseInt(value);
			} else if (idx2 != -1) {
				value = value.substring(0, value.length - 1);
			}
			return parseInt(value) * 1000;

		}
		function show(options) {
			if (shown) {
				queue.push(options);
				return;
			}
			shown = true;
			var params = {},
				msg = options.message;
			for (var i=0; i<properties.length; i++) {
				var name = properties[i],
					value = null;
				if (options[name]) {
					value = options[name];
				} else if (initials[name]) {
					value = initials[name];
				} else {
					value = defaults[name];
				}
				params["animation-" + name] = value;
				params["-webkit-animation-" + name] = value;
			}
			if (msg) {
				$el.find(".message").text(msg);
			}
			$el.css(params);
			$el.show();
			setTimeout(function() {
				$el.hide();
				$el.css("animation-name", "");
				$el.css("-webkit-animation-name", "");
				if (initialText) {
					$el.find(".message").text(initialText);
				}
				shown = false;
				if (queue.length > 0) {
					var next = queue.shift();
					setTimeout(function() {
						show(next);
					}, 10);
				}
			}, durationToMillis(params["animation-duration"]));
		}
		var initials = {},
			initialText = $el.find(".message").text(),
			shown = false,
			queue = [];
		for (var i=0; i<properties.length; i++) {
			var name = properties[i],
				value = $el.css("animation-" + name);
			if (value && value !== "none" && value !== "0s") {
				initials[name] = value;
			}
		}
		$.extend(this, {
		  "show" : show
		})
	}

	$.fn.animateDialog = function(msg, options) {
		if (this.length == 0) {
			return;
		}
		if (typeof(msg) === "object") {
			options = msg;
			msg = null;
		}
		if (!options) {
			options = {};
		}
		if (msg) {
			options.message = msg;
		}
		var dlg = $.data(this[0], "animateDialog");
		if (!dlg) {
			dlg = new MessageDialog(this);
			$.data(this[0], "animateDialog", dlg);
		}
		dlg.show(options);
	}
})(jQuery);