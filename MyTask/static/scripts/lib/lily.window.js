/**
 * jQuery window - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 */
 
(function( $ , undefined){
	"use strict"

 	/* modal CLASS DEFINITION
  	 * ====================== */

	var Window = function ( $element, options ) {
		this.options = options;
		this.$element = $element;
        this.$container = $(this.options.appendTo)
		
		var self = this;

	  	$('#window-close-' + this.options.windowId, this.$element).bind('click.closeWindow', function(){
	  		self.close();
	  	});
	  	
	  	$('#window-min-' + this.options.windowId, this.$element).bind('click.minWindow', function(){
	  		if(self.options.shadeFlag=='true'){
//	  			closeWindowShade();
	  			
	  		}
	  		self.minimize();
	  	});
	  	
	  	if(this.options.url && this.options.url !== '')
	  		$('.window-body', this.$element).load(this.options.url, this.options.param);
	  	
	  	if(this.options.tranCode && this.options.tranCode !== '') {
	  		var mvcOptions = {
	  			tranCode: this.options.tranCode,
	  			startStep:this.options.startStep,
				parentMVC: this.options.parentMVC,
				requestData: this.options.param
	  		}
	  		if(this.options.mvcOptions)
	  			$.extend(mvcOptions, this.options.mvcOptions);
	  		$('.window-body', this.$element).mvc(this, mvcOptions);
	  		
	  	}
	  		
	  		
	  	if(this.options.content && this.options.content !== '') {
	  		$('.window-body', this.$element).append(this.options.content);
	  		/*
	  		if(this.options.afterFun)
	  			this.callback = function() {this.options.content[this.options.afterFun]();};
	  		*/
	  	}
	  	
	  	this.isShown = false;
	}
	
	Window.prototype = {
		constructor: Window,
		
		show: function() {
			if(this.isShown)
				return;
	  		this.isShown = true;
	  		if(this.options.showFun)
	  			this.options.showFun();
	  		var self = this;
	  		backdrop.call(this, function () {
                var left = (self.$container.width() - self.$element.width()) / 2
                var top = 100
                if(self.options.source) {
                	top = self.options.source.offset().top
                }
                else {
                	top = (self.$container.height() - self.$element.height()) / 2
                }
	  			
                self.$element.css({
                    top: top,
                    left: left
                })
				self.$element.stop().fadeIn(self.options.fadeSpeed, self.options.fadeEasing);

				
				if(self.options.afterFun) {
					self.options.afterFun(self.$element);
				}
			});
	  		function autoClose() {
	  			if(self.options.shadeFlag=='true'){
		  			closeWindowShade();
		  		}
	  			self.close();
	  		}
	  		if(this.options.autoClose) {
	  			setTimeout(autoClose, this.options.autoClose);
	  		}
		},
		
		minimize: function() {
			if(!this.isShown)
				return;
			this.isShown = false;
			if(this.options.backdrop) {
				this.$backdrop.removeClass('in');
	    		removeBackdrop.call(this);
	    	}
			if (this.options.taskWindow) 
				$('#task-' + this.options.windowId, $("body").data("taskbar").taskContainer).removeClass('active');
			this.$element.stop().fadeOut(this.options.fadeSpeed, this.options.fadeEasing);
		},
		
		maximize: function() {
			if(this.isShown)
				return;
		},
		
		close: function(isTaskClose) {
			if(this.options.backdrop) {
				this.$backdrop.removeClass('in');
	    		removeBackdrop.call(this);
	    	}
			var self = this;
			this.$element.stop().fadeOut(this.options.fadeSpeed, this.options.fadeEasing ,function(){
				self.destory();
			});
			
			if(this.options.shadeFlag=='true'){
	  			closeWindowShade();
//	  			self.$element.data("zhezhao").remove();
	  		}
			
			if(!isTaskClose && this.options.taskWindow) {
				$('body').data("taskbar").removeTask(this.options.windowId);
			}
		},
		
		destory: function() {
			this.$element.remove();
			this.$element = null;
			if(this.options.closeFun) {
	  			this.options.closeFun();
			}
		},
		updateContentSearch: function(content) {
			$('.search-result-window').children().remove();
			$('.search-result-window').append(content);
		},
		
		updateContent: function(content) {
			$('.window-body', this.$element).children().remove();
			$('.window-body', this.$element).append(content);
		}
	}
	
	function backdrop( callback ) {
		var that = this ;
	
		if (this.isShown && this.options.backdrop) {
	
	  		this.$backdrop = $('<div class="window-backdrop " />')
	    		.appendTo($(this.options.appendTo));
	
	  		if (this.options.backdrop != 'static') {
	  			if(this.options.closeWhenHidden) {
	  				this.$backdrop.click($.proxy(this.close, this));
	  			} 
	  			else {
	    			this.$backdrop.click($.proxy(this.minimize, this));
	    		}
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
	
	$.fn.window = function ( option ) {
  		var options = $.extend({}, $.fn.window.defaults, typeof option == 'object' && option),
  			windowId = '',
  			data;
		if(options.windowId)
			windowId = options.windowId;
		else
			windowId = $.lily.generateUID();
		$.extend(options, {"windowId": windowId});
		var windowHtml = '';
		if(options.commWindowFlag ==true){//弹出窗口标志
			windowHtml = '<div id="trans-window-' + windowId + '"><div class="window-head-comm" style="">';
			windowHtml += ' <div class="menu_dh_left3"></div>';
			if(!isEmpty(options.title)){
				windowHtml +='<div class="menu_dhmc">'+options.title+'</div>';
			}
			windowHtml += '<a class="' + options.btnClass + ' close" id="window-close-' + windowId + '"></a>';
			windowHtml += '</div>';
			windowHtml += '<div class="window-body" style="left:0px;top:24px;width:'+(options.width-5)+'px;height:'+(options.height-24)+'px;position:absolute;overflow: hidden;"></div>'
			windowHtml += '</div>';
		}else{
			windowHtml = '<div id="trans-window-' + windowId + '"><div class="window-head">';
			if(options.title && options.title !== '') {
				windowHtml += '<div class="window-title"><div class="window-mainTitle" >' + options.title + '</div>';
				if(options.subTitle && options.subTitle !== '')
					windowHtml += '<div class="window-subTitle">' + options.subTitle + '</div>';
				windowHtml += '</div>'
			}
			if(options.allowClose)
				windowHtml += '<a class="' + options.btnClass + ' close" id="window-close-' + windowId + '"></a>';
			if(options.allowMinimize)
				windowHtml += '<a class="' + options.btnClass + ' min"  id="window-min-' + windowId + '"></a>';
			windowHtml += '</div>';
			windowHtml += '<div class="window-body"></div>'
			if(options.taskWindow) 
				windowHtml += '<div class="window-right-body"></div>'
			windowHtml += '</div>';
		}
	
	  	var $this = $(windowHtml);
		$this.addClass(options.windowClass);
	  	if(options.commWindowFlag){
	  		$this.css('position','absolute');
	  		$this.css('width',options.width);
	  		$this.css('height',options.height);
	  		$this.css('top',options.top);
	  		$this.css('left',options.left);
	  		$this.css('z-index','99999');
	  		$this.css('color','#031355');
	  		$this.css('background','url(img/card_bg.png) left bottom repeat-x');
	  		$this.css('border','3px solid #e5e5e5');
	  		$this.css('padding','0px');
	  		$this.css('overflow','#hidden');
	  		if(!isEmpty(options.shadeFlag) && options.shadeFlag=='true'){
	  			 openWindowShade();
	  		}
	  	}
	  	
	  	$this.appendTo($(options.appendTo))
	  	
  		$this.data('window', (data = new Window($this, options)));
  		
  		if (typeof option == 'string') 
  			data[option]();
  		else if (options.show) 
  			data.show();
  		return data;
  	}
	
	$.fn.window.defaults = {
		backdrop: false, 
		show: true,
		duration: 300,
		appendTo:'body', 
		showType: 'fade',
		url: '',
		tranCode: '',
		startStep:null,
		content: '',
		param: null,
		title: '',
		allowClose: true,
		allowMinimize: true,
		windowClass: 'transaction-window',
		btnClass: 'window-op-btn',
		taskWindow: false,
		showFun: null,
		closeFun: null,
		shadeFlag:'false',
		commWindowFlag: false,
		closeWhenHidden: true
  	}
  	
  	$.fn.window.Constructor = Window;
  	
  	$.openWindow = function ( option ) {
  		return $.fn.window(option);
  	}
  	
})(jQuery)
