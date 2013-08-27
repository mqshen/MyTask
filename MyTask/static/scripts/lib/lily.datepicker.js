/**
 * jQuery datepicker - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 * 
 * depend lily.calendar.js
 */

(function($, undefined) {
	"use strict"

 	/* Datepicker CLASS DEFINITION
  	 * ====================== */
	var Datepicker = function ( element, options ) {
		this.options = options;
		this.$element = $(element);
		
		this.pickerContainer = $('<div class="ui-datepicker" style="display:none"></div>')
			.appendTo(document.body);
        this.pickerContainer.css({position: 'abs'})
		var left = this.$element.offset().left;
		var top = this.$element.offset().top + this.$element.height();
		
		this.pickerContainer
		.css({
			left: left + "px",
			top: top + "px",
            position: "absolute",
			width: this.options.width + "px",
			height: this.options.height + "px",
			zIndex: this.options.zIndex
		})
		.calendar({
			target: this,
			selectFun: this.setDate
		});
	  	this.isShown = false;
	}
	
	Datepicker.prototype = {
		constructor: Datepicker, 
		
		show: function() {
			if(this.isShown)
				return;
			var self = this;

			self.isShown = true;
			backdrop.call(this, function () {
				self.pickerContainer.fadeIn(self.options.fadeSpeed, self.options.fadeEasing);
        	});

		},
		
		hide: function() {
			if(!this.isShown)
				return;
			
			$('body').removeClass('displayer-open');

        	this.isShown = false;
        	this.$element.trigger('hide');

			var self = this;
        	//escape.call(this)
        	backdrop.call(this, function () {
        		self.pickerContainer.fadeOut(self.options.fadeSpeed, self.options.fadeEasing);
        	});
		},
		
		setDate: function(date) {
			this.$element.val(date.format('yyyy-mm-dd'));
			this.hide();
		}
	}
	
	function backdrop( callback ) {

		var that = this , 
			animate = this.$element.hasClass('fade') ? 'fade' : '';
		
		if (this.isShown && this.options.backdrop) {
			
	  		this.$backdrop = $('<div class="datepick-backdrop ' + animate + '" />')
	    		.appendTo(document.body);
	  		if (this.options.backdrop != 'static') {
	    		this.$backdrop.click($.proxy(this.hide, this));
	  		}
	
	  		//this.$backdrop[0].offsetWidth; // force reflow
	
	  		this.$backdrop.addClass('in');
	    	callback();
	
		} 
		else if (!this.isShown && this.$backdrop) {
	  		this.$backdrop.removeClass('in');
	    	removeBackdrop.call(this);
			callback();
		} 
		else if (callback) {
	  		callback();
		}
	}
	
	function removeBackdrop() {
		this.$backdrop.remove()
		this.$backdrop = null
	}
	
	$.fn.datepicker = function ( option ) {
    	return this.each(function () {
      		var $this = $(this), 
      			data = $this.data('datepicker'), 
      			options = $.extend({}, $.fn.datepicker.defaults, $this.data(), typeof option == 'object' && option);
      		if (!data) 
      			$this.data('datepicker', (data = new Datepicker(this, options)));
      		if (option == 'show') 
				data.show();
    	})
  	}
	
	$.fn.datepicker.defaults = {
		backdrop: true, 
		show: false,
		zIndex: 3001,
		fadeSpeed: 600, 
		fadeEasing: ''
  	}
	/* DATePICK DATA-API
 	 * =============== */

	$(function () {
		$('body').on('focus.input.data-api', '[data-toggle^=datepick]', function ( e ) {
			
			var $field = $(e.target);
			
			$field.datepicker('show');
			
		});
	})
	
})(jQuery);
