!function ($) {

  "use strict"; // jshint ;_;


 /* renderPopover PUBLIC CLASS DEFINITION
  * =============================== */

    var RenderrenderPopover = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.renderPopover.defaults, options)
        this.mainOffset = $('#workspace').offset()
        var afterCall
        if(this.$element.attr("data-content")) {
            var $content = $(this.$element.attr("data-content"))
            afterCall = $content.data("afterCall")
            this.$content = $content.clone();
            this.$content.insertAfter($content)
            this.callback = $content.data("callback")
            this.isAddContent = true
        }
        else {
            this.$content = $('.renderPopover', this.$element.parent())
            this.callback = this.$content.data("callback")
            afterCall = this.$content.data("afterCall")
        }
        var that = this
        $('[data-behavior="confirm"]', this.$content).click(function(e){
            e.preventDefault()
            that.submit(0)
        })
        $('[data-behavior="cancel"]', this.$content).click(function(e){
            e.preventDefault()
            that.submit(1)
        })

        if(afterCall)
            afterCall(this.$element, this.$content)
        
    }


    /* NOTE: renderPopover EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */
    
    RenderrenderPopover.prototype = {
    
        constructor: RenderrenderPopover,

        toggle: function () {
            return this[!this.isShown ? 'show' : 'hide']()
        },
        
        show: function() {
            if (this.isShown )
                return
            this.isShown = true

            var that = this
            this.backdrop(function () {
                var offset = that.$element.offset()
                var shownbottom = $(window).height() - offset.top + $(window).scrollTop()
                if(!that.isAddContent ) {
                    offset.top = 0
                    offset.left = that.$element.parent().width()
                }
                if(shownbottom > that.$content.height()) {
                    that.$content.css({
                        top: offset.top - that.options.gap ,//- that.$element.height()/2,
                        left: offset.left + that.$element.width() + that.options.horizontalGap
                    })
                    that.$content.removeClass("direction-right-top")
                    that.$content.addClass("direction-right-bottom")
                }
                else {
                    that.$content.css({
                        top: offset.top - that.$content.height() + that.options.gap + that.$element.height(),
                        left: offset.left + that.$element.width() + that.options.horizontalGap
                    })
                    that.$content.removeClass("direction-right-bottom")
                    that.$content.addClass("direction-right-top")
                }
                that.$content.fadeOut()

                //that.$element.show()
                
                that.$content.fadeIn()
                function dateSelectCallback(date) {
                    that.submit(date)
                }
                $('.datepicker', that.$content).calendar({
			    	selectFun: dateSelectCallback,
			    	target: that.$element
			    })
            })
        },

        submit: function(date) {
            var that = this
            if(that.callback)
                that.callback(date, that)
        },

        hide: function(e) {
            var that = this

            if (!this.isShown )
                return
            this.isShown = false
            this.$content.fadeOut()
            this.removeBackdrop()
        },

        destory: function(){
            this.hide()
            this.$content.remove()
            this.data('renderPopover', null)
        },

        removeBackdrop: function () {
            this.$backdrop && this.$backdrop.remove()
            this.$backdrop = null
        },

        backdrop: function (callback) {
            var that = this
            if (this.isShown && this.options.backdrop) {
                this.$backdrop = $('<div class="backdrop" />')
                    .appendTo(document.body)
                this.$backdrop.click(function() {
                    that.hide()
                })
                this.$backdrop.addClass('in')
                if (!callback) return
                callback()
            } 
            else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass('in')
                callback()
            } 
            else if (callback) {
                callback()
            }
        }
    }
    
    
     /* renderPopover PLUGIN DEFINITION
      * ======================= */
    
    
    $.fn.renderPopover = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('renderPopover')
                , options = typeof option == 'object' && option
            if (!data) $this.data('renderPopover', (data = new RenderPopover(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    
    $.fn.renderPopover.Constructor = RenderPopover
    
    $.fn.renderPopover.defaults = {
        placement: 'right', 
        trigger: 'click', 
        content: '', 
        backdrop: true,
        gap: 15,
        horizontalGap: 25,
        template: '<div class="renderPopover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }
    

 /* renderPopover NO CONFLICT
  * =================== */

    $.fn.renderPopover.noConflict = function () {
        $.fn.renderPopover = old
        return this
    }

}(window.jQuery);
