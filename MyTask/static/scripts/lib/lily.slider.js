/**
 * jQuery slider - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 */
 
 
(function($, undefined){
	"use strict"

 	/* modal CLASS DEFINITION
  	 * ====================== */

	var Slider = function ( element, options ) {
		this.init(element, options);
	}
	
	Slider.prototype = {
		constructor: Slider,
		
		init: function(element, options) {
			
			this.$element = $(element);
			

			this.sliderInner = this.$element.children('.slides-inner');
			
			this.sliderInner.children().wrapAll('<div class="slides-control"/>');
			
			this.container = this.sliderInner.children('.slides-control');
			this.options = options;
			this.active = false;
			this.loaded = false;
			this.total = this.container.children().size();
			this.width = this.container.children().outerWidth();
			this.height = this.container.children().outerHeight();
			var self = this;
			
			if(this.options.animationButton) {
				if(this.options.animationButtonArea)
					this.animationButtonArea = this.$element.find('#' + this.options.animationButtonArea);
				else
					this.animationButtonArea = this.$element;
			}
			
			
			
			var start = this.options.start - 1,
				effect = this.options.effect,
				next = 0, 
				prev = 0, 
				number = 0, 
				clicked,
				imageParent, 
				pauseTimeout, 
				playInterval;
			
			if (this.total < 2) {
				this.container.fadeIn(this.options.fadeSpeed, this.options.fadeEasing, function(){
					self.loaded = true;
				});
				return false;
			}
			if (start < 0) {
				start = 0;
			}
			if (start > this.total) {
				start = this.total - 1;
			}
			if (this.options.start) {
				this.current = start;
			}
			this.sliderInner.css({
				overflow: 'hidden',
				position: 'relative'
			});
			this.container.children().css({
				position: 'absolute',
				top: 0, 
				left: this.container.children().outerWidth(),
				zIndex: 0,
				display: 'none'
			});
			this.container.css({
				position: 'relative',
				width: (this.width * 3),
				height: this.height,
				left: -this.width
			});
			this.sliderInner.css({
				display: 'block'
			});
			if (this.options.preload && this.container.find('img:eq(' + start + ')').length) {
				container.css({
					background: 'url(' + this.options.preloadImage + ') no-repeat 50% 50%'
				});
				var img = this.container.find('img:eq(' + start + ')').attr('src') + '?' + (new Date()).getTime();
				if ($('img', elem).parent().attr('class') != 'slides_control') {
					imageParent = container.children(':eq(0)')[0].tagName.toLowerCase();
				} 
				else {
					imageParent = container.find('img:eq(' + start + ')');
				}
				this.container.find('img:eq(' + start + ')').attr('src', img)
					.load(function() {
						this.container.find(imageParent + ':eq(' + start + ')')
						.fadeIn(this.options.fadeSpeed, this.options.fadeEasing, function(){
							$(this).css({
								zIndex: 5
							});
							$('.' + this.options.container, elem).css({
								background: ''
							});
							self.loaded = true;
						});
				});
			}
			else {
				this.container.children(':eq(' + start + ')')
					.fadeIn(this.options.fadeSpeed, this.options.fadeEasing, function(){
						self.loaded = true;
					});
			}
			
			if(this.options.animationButton) {
				this.animationButtonArea.children('.' + this.options.next).click(function(e){
					e.preventDefault();
					if (self.options.play) {
						pause();
					}
					self.animate('next', effect);
				});
				this.animationButtonArea.children('.' + this.options.prev).click(function(e){
					e.preventDefault();
					if (self.options.play) {
						 pause();
					}
					self.animate('prev', effect);
				});
			}
			
			
			if (this.options.generatePagination) {
				var self = this;
				this.options.pagination = true;
				this.pageContainer = this.$element.find('#' + this.options.paginationArea);
				if(!this.pageContainer)
					return;
				// for each slide create a list item and link
				this.container.children().each(function(){
					if(self.options.padinationIndex)
						self.pageContainer.append('<li pageIndex="' + number + '"><a href="#">'+ (number+1) +'</a></li>');
					else
						self.pageContainer.append('<li pageIndex="' + number + '"></li>');
					number++;
				});
				this.pageContainer.children('li:eq('+ start +')').addClass(this.options.currentClass);
				
				this.pageContainer.children().click(function(){
					if (self.options.play) {
						 pause();
					}
					clicked = $(this).attr('pageIndex');
					if (self.current != clicked) {
						self.animate('pagination', effect, clicked);
					}
					return false;
				});
			}
			
			if (this.options.play) {
				playInterval = setInterval(function() {
					animate('next', effect);
				}, this.options.play);
				elem.data('interval',playInterval);
			}
		},
		
		prevElement: function() {
			this.animate('prev');
		},
		
		nextElement: function() {
			this.animate('next');
		},
		
		currentIndex: function() {
			return this.current;
		},
		
		animate: function(direction, effect, clicked) {
			if(arguments.length == 1) {
				if($.lily.format.isInteger(direction)) {
					clicked = parseInt(direction) - 1;
					direction = 'pagination';
					effect = this.options.effect;
				}
			}
			if (!this.active && this.loaded) {
				this.active = true;
				var self = this;
				this.options.animationStart(this.current + 1);
				switch(direction) {
				case 'next':
					this.prev = this.current;
					this.next = this.current + 1;
					this.next = this.total === this.next ? 0 : this.next;
					this.position = this.width*2;
					this.direction = -this.width*2;
					this.current = this.next;
					break;
				case 'prev':
					this.prev = this.current;
					this.next = this.current - 1;
					this.next = this.next === -1 ? this.total-1 : this.next;			
					this.position = 0;								
					this.direction = 0;		
					this.current = this.next;
					break;
				case 'pagination':
					this.next = parseInt(clicked,10);
					this.prev = this.current;//$('li.'+ this.options.currentClass, this.pageContainer).attr('pageIndex');
					if(this.next === this.prev) {
						self.active = false;
						return;
					}
					if (this.next > this.prev) {
						this.position = this.width*2;
						this.direction = -this.width*2;
					} 
					else {
						this.position = 0;
						this.direction = 0;
					}
					this.current = this.next;
					break;
				}
				if (effect === 'fade') {
					if (this.options.crossfade) {
						this.container.children(':eq('+ next +')', elem).css({
							zIndex: 10
						}).fadeIn(this.options.fadeSpeed, this.options.fadeEasing, function(){
							self.container.children(':eq('+ prev +')', elem).css({
								display: 'none',
								zIndex: 0
							});
							self.container.children(':eq('+ next +')', elem).css({
								zIndex: 0
							});
							self.options.animationComplete(next + 1);
							self.active = false;
						});
					} 
					else {
						this.container.children(':eq('+ prev +')', elem).fadeOut(this.options.fadeSpeed,  this.options.fadeEasing, function(){
							this.container.children(':eq('+ next +')', elem).fadeIn(this.options.fadeSpeed, this.options.fadeEasing, function(){
								if($.browser.msie) {
									$(this).get(0).style.removeAttribute('filter');
								}
							});
							self.options.animationComplete(next + 1);
							self.active = false;
						});
					}
				}
				else {
					this.container.children(':eq('+ this.next +')').css({
						left: this.position,
						display: 'block'
					});
						this.container.animate({
							left: this.direction
						},this.options.slideSpeed, this.options.slideEasing, function(){
							self.container.css({
								left: -self.width
							});
							self.container.children(':eq('+ self.next +')').css({
								left: self.width,
								zIndex: 5
							});
							self.container.children(':eq('+ self.prev +')').css({
								left: self.width,
								display: 'none',
								zIndex: 0
							});
							self.options.animationComplete(self.next + 1);
							self.active = false;
						});
				}
				if (this.options.pagination) {
					$('li.' + this.options.currentClass, this.pageContainer).removeClass(this.options.currentClass);
					$('li:eq('+ this.next +')', this.pageContainer).addClass(this.options.currentClass);
				}
				if (this.options.padinationArray) {
					this.options.padinationArray.removeClass('active');
					$(this.options.padinationArray[this.current]).addClass('active');
				}
			}
		}, 
			
		stop: function() {
			clearInterval(elem.data('interval'));
		},

		pause: function() {
			if (this.options.pause) {
				clearTimeout(elem.data('pause'));
				clearInterval(elem.data('interval'));
				pauseTimeout = setTimeout(function() {
					clearTimeout(elem.data('pause'));
					playInterval = setInterval(	function(){
						animate("next", effect);
					},this.options.play);
					elem.data('interval',playInterval);
				},this.options.pause);
				elem.data('pause',pauseTimeout);
			} 
			else {
				stop();
			}
		},
		
		appendSlidesItem: function(slidesItem) {
			this.container.append(slidesItem);
			
			if (this.options.generatePagination) {
				var self = this;
				this.pageContainer = this.$element.find('#' + this.options.paginationArea);
				
				var pageBtn;
				if(self.options.padinationIndex)
					pageBtn = '<li pageIndex="' + this.total + '"><a href="#">'+ (++this.total) +'</a></li>';
				else
					pageBtn = '<li pageIndex="' + (this.total++) + '"></li>';
				
				var effect = this.options.effect;
				$(pageBtn)
				.appendTo(self.pageContainer)
				.click(function(){
					if (self.options.play) {
						 pause();
					}
					var clicked = $(this).attr('pageIndex');
					if (self.current != clicked) {
						self.animate('pagination', effect, clicked);
					}
					return false;
				});
			}
		}
	}
	
	$.fn.slider = function( option ) {
		option = $.extend( {}, $.fn.slider.option, option );
		return this.each(function(){
			var $this = $(this), 
				data = $this.data('slider'), 
				options = typeof option == 'object' && option;
      		if (!data) 
      			$this.data('slider', (data = new Slider(this, options)));
      		if (typeof option == 'string') 
      			data[option]();
		});
	};
	
	$.fn.slider.option = {
		preload: false, // boolean, Set true to preload images in an image based slideshow
		preloadImage: '/img/loading.gif', // string, Name and location of loading image for preloader. Default is "/img/loading.gif"
		container: 'slides_container', // string, Class name for slides container. Default is "slides_container"
		next: 'next', // string, Class name for next button
		prev: 'prev', // string, Class name for previous button
		animationButton: false,
		animationButtonArea: null,
		pagination: false, // boolean, If you're not using pagination you can set to false, but don't have to
		padinationIndex: true,
		padinationArray: null,
		currentClass: 'current', // string, Class name for current class
		fadeSpeed: 350, // number, Set the speed of the fading animation in milliseconds
		fadeEasing: '', // string, must load jQuery's easing plugin before http://gsgd.co.uk/sandbox/jquery/easing/
		slideSpeed: 350, // number, Set the speed of the sliding animation in milliseconds
		slideEasing: '', // string, must load jQuery's easing plugin before http://gsgd.co.uk/sandbox/jquery/easing/
		start: 1, // number, Set the speed of the sliding animation in milliseconds
		effect: 'slide', // string, '[next/prev], [pagination]', e.g. 'slide, fade' or simply 'fade' for both
		crossfade: false, // boolean, Crossfade images in a image based slideshow
		play: 0, // number, Autoplay slideshow, a positive number will set to true and be the time between slide animation in milliseconds
		pause: 0, // number, Pause slideshow on click of next/prev or pagination. A positive number will set to true and be the time of pause in milliseconds
		animationStart: function(){}, // Function called at the start of animation
		animationComplete: function(){} // Function called at the completion of animation
	};
})(jQuery);