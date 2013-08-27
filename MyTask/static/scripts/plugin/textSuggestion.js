/**
 * jQuery textSuggestion - v1.0
 * auth: shenmq
 * website: shenmq.github.com
 *
 */

(function( $, undefined ){

	"use strict"

 	/* textSuggestion PUBLIC CLASS DEFINITION
	 * ============================== */

	var TextSuggestion = function ( element, options ) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.textSuggestion.defaults, options);
		this.url = this.$element.attr("url");
	}

	TextSuggestion.prototype = {
	
		constructor: TextSuggestion, 
		
		showSuggestion: function(){
			if(this.show)
				this.updateContext();
			else {
				this.$suggestionContainer = $('<div class="popup-tip"></div>')
				var left = this.$element.offset().left;
				var top = this.$element.offset().top + this.$element.height();
				
				this.$suggestionContainer.css({
					"left": left + "px",
					"height": top + "px"
				})
				this.$suggestionContainer.appendTo('body');
				this.updateContext();
			}
			this.show = true;
		},
		
		updateContext: function() {
			if(this.url.length < 1)
				return;
			var requestData = {"query": this.$element.val()};
			$.lily.ajax({url: this.url, 
				data: requestData, 
				type: 'POST',
				processResponse: function ( responseData ) {
					var $currentElement = $(responseData);
					this.$suggestionContainer.empty();
					$currentElement.appendTo(this.$suggestionContainer);
				}
			});
		}
	}


 	/* textSuggestion PLUGIN DEFINITION
	 * ======================== */

	$.fn.textSuggestion = function ( option ) {
		return this.each(function () {
			var $this = $(this), 
				data = $this.data('textSuggestion'), 
				options = typeof option == 'object' && option;
			if (!data) 
				$this.data('textSuggestion', (data = new TextSuggestion(this, options)));
			data.showSuggestion();
		});
	}

  	$.fn.textSuggestion.defaults = {
		loadingText: 'loading...'
  	}

  	$.fn.textSuggestion.Constructor = TextSuggestion


 	/* textSuggestion DATA-API
 	 * =============== */

	$(function () {
		$('body').on('input.textSuggestion.data-api', '[data-toggle^=textSuggestion]', function ( e ) {
			$(this).textSuggestion();
		});
	})

})(jQuery ); 