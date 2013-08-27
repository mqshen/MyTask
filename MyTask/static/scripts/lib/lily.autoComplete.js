!function($) {

	"use strict"; // jshint ;_;

	/*
	 * BUTTON PUBLIC CLASS DEFINITION ==============================
	 */

	var AutoComplete = function(element, options) {
		this.$element = $(element)
		this.options = $.extend({}, $.fn.autoComplete.defaults, options)
		
		var self = this
		this.$element.keyup(function() {
			self.showQuery()
		})
		
		this.resultContainer = $('<div class="autocomplete-pick" style="display:none"></div>')
			.appendTo(document.body);
		var left = this.$element.offset().left;
		var top = this.$element.offset().top + this.$element.height();
		this.requestData = {}
		this.requestData[this.options.requestName] = ""
		$.extend(this.requestData, this.options.data)
		
		this.resultContainer
		.css({
			left: left + "px",
			top: top + "px",
			width: this.$element.width() + "px",
			zIndex: this.options.zIndex
		})
	  	this.isShown = false;
	}

	AutoComplete.prototype = {
		showQuery: function() {
			var value = this.$element.val();
			if(value.length < this.options.minLength)
				return;
			this.transaction = true;
			var self = this;
            this.request_token = value
			this.requestData[this.options.requestName] = value;
			$.lily.ajax({
			    url: this.options.url,
			    data: this.requestData,
			    type: 'get',
			    processResponse: function(data) {
			    	self.processData(data)
			    }
			});	
		},
		
		processData: function(data) {
            if(data[this.options.requestName] !== this.request_token)
                return
            console.log("begin process!")
            if(this.options.render) {
                this.options.render(data)
            }
            else {
			    this.resultContainer.empty();
			    this.data = data
			    for(var i in data) {
			    	var item = data[i]
			    	this.resultContainer.append('<li data-content="' + i + '">' + item[this.options.displayName] + '</li>')
			    }
			    this.show()
			    var self = this
			    $('li', this.resultContainer).click($.proxy(this.selectItem, this))
            }
		},
		
		selectItem: function(e) {
			var btn = e.target
			var index = $(btn).attr("data-content")
			this.options.callback(this.data[index])
			this.hide()
		},
		
		show: function() {
			if(this.isShown)
				return;
			var self = this;

			self.isShown = true;
			backdrop.call(this, function () {
				self.resultContainer.fadeIn(self.options.fadeSpeed, self.options.fadeEasing);
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
        		self.resultContainer.fadeOut(self.options.fadeSpeed, self.options.fadeEasing);
        	});
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
	/*
	 * BUTTON PLUGIN DEFINITION ========================
	 */

	var old = $.fn.button

	$.fn.autoComplete = function(option) {
		return this.each(function() {
			var $this = $(this), data = $this.data('autoComplete'), options = typeof option == 'object' && option
				if (!data)
					$this.data('autoComplete', (data = new AutoComplete(this, options)))
		})
	}

	$.fn.autoComplete.defaults = {
		loadingText : 'loading...',
		fadeSpeed: 600, 
		fadeEasing: '',
		minLength: 5
	}

	$.fn.autoComplete.Constructor = AutoComplete

	/*
	 * BUTTON DATA-API ===============
	 */

}(window.jQuery);
