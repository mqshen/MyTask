!function ($) {

  "use strict"; // jshint ;_;


 /* calendarEditor PUBLIC CLASS DEFINITION
  * =============================== */

    var CalendarEditor = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.calendarEditor.defaults, options)
        this.$content = $(this.options.content)
        var self = this
        this.$element.bind('click.showCalendar', function(e) {
            self.show(e)
        })
        
        this.$form =  $('form', this.$content)
        this.$title = $('[name="title"]', this.$content)
        this.$id = $('[name="id"]', this.$content)
        this.$swatches = $('.swatches', this.$content)
    }


    /* NOTE: calendarEditor EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */
    
    CalendarEditor.prototype = {
    
        constructor: CalendarEditor,

        toggle: function () {
            return this[!this.isShown ? 'show' : 'hide']()
        },
        
        submit: function() {
            var self = this
            function processResponse(responseData) {
                if(self.options.processResponse){
                    self.options.processResponse(responseData, self.$element, self.requestData)
                    self.hide();
                    self.$form[0].reset();
                }
            }
            var id = this.$element.attr('data-bucket-id');
            var requestData = $.lily.collectRequestData(this.$content);
            var url = this.$element.attr('data-url')
            $.lily.ajax({url: url,
                data: requestData, 
                dataType: 'json',
                type: 'POST',
                processResponse: processResponse
            })
        },

        remove: function() {
            var self = this
            var requestData = $.lily.collectRequestData(this.$content);
            var url = this.$element.attr('data-url') + '/' + requestData.id + '/trash'
            $.lily.ajax({url: url,
                dataType: 'json',
                type: 'POST',
                processResponse: function() {
                    if(self.options.deleteProcessResponse) {
                        self.options.deleteProcessResponse(self.requestData)
                        self.hide();
                        self.$form[0].reset();
                    }
                }
            })
        },

        show: function(e) {
            if (this.isShown || $(e.target).hasClass("btn"))
                return
            this.isShown = true

            var $trigger = $('.popover-btn', this.$element)

            if(this.options.isAdd) {
                this.$id.val('')
                this.$title.text('');
            }
            else {
                var requestData = $.lily.collectRequestData(this.$element);
                this.requestData = requestData 
                $('[name=id]', this.$content).val('')
                for(var i in requestData ) {
                    var value = requestData[i]
                    if(value && !$.lily.format.isEmpty(value) && value !== 'null') {
                        $('[name=' + i + ']', this.$content).val(value)
                    }
                }
                var color = $('.swatch', this.$element).css('background-color');

                if(color) {
                    var $colorElement = this.$swatches.find('[data-content="' + $.lily.rgb2hex(color) + '"]');
                    $colorElement.click()
                }
            }
            this.$element.addClass('selected')


            var that = this
            $('.action_button', this.$content).bind('click.submitCalendar', function(){
                that.submit();
            })

            $('.delete', this.$content).bind('click.delectCalendar', function(){
                that.remove();
            })

            $('.cancel', this.$content).bind('click.cancelCalendar', function(){
                that.cancel();
            })

            var leftGap = 0
            var topGap = 0
            if(this.options.position === 'side') {
                leftGap += $trigger.outerWidth(true)  + 15
                topGap = $trigger.height() / 2 - 36
            }
            else {
                leftGap -= this.$content.width() - 36;
                topGap += $trigger.height() + 12
            }
            this.backdrop(function () {
                var offset = $trigger.offset()
                var shownbottom = $(window).height() - offset.top + $(window).scrollTop()
                /*
                if(shownbottom > that.$content.height()) {
                    that.$content.css({
                        top: offset.top - that.options.gap,
                        left: offset.left + $trigger.width() - leftGap
                    })
                    if(that.options.position === 'side') {
                        that.$content.removeClass("direction-right-top")
                        that.$content.addClass("direction-right-bottom")
                    }
                    else {
                        that.$content.removeClass("direction-down-bottom")
                        that.$content.addClass("direction-up-top")
                    }
                }
                else {
                    */
                    that.$content.css({
                        top: offset.top + topGap,
                        left: offset.left + leftGap
                    })
                    if(that.options.position === 'side') {
                        that.$content.removeClass("direction-right-bottom")
                        that.$content.addClass("direction-right-top")
                    }
                    else {
                        //that.$content.removeClass("direction-up-top")
                        that.$content.addClass("top_right_side")
                    }
                //}
                //that.$element.show()
                
                that.$content.fadeIn()
                function dateSelectCallback(date) {
                    that.submit(date)
                }
            })
        },

        cancel: function() {
            if(this.options.doCancel)
                this.options.doCancel()
            this.hide()
        },

        hide: function(e) {
            var that = this

            if (!this.isShown )
                return
            this.isShown = false
            this.$content.fadeOut()
            this.removeBackdrop()
            this.$element.removeClass('selected')
        },

        destory: function(){
            this.hide()
            this.$content.remove()
            this.data('calendarEditor', null)
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
                    that.cancel()
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
    
    
     /* calendarEditor PLUGIN DEFINITION
      * ======================= */
    
    
    $.fn.calendarEditor = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('calendarEditor')
                , options = typeof option == 'object' && option
            if (!data) $this.data('calendarEditor', (data = new CalendarEditor(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    
    $.fn.calendarEditor.Constructor = CalendarEditor
    
    $.fn.calendarEditor.defaults = {
        placement: 'right', 
        trigger: 'click', 
        content: '', 
        backdrop: true,
        gap: 15,
        horizontalGap: 25,
        position: 'center',
        template: '<div class="calendarEditor"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }
    

 /* calendarEditor NO CONFLICT
  * =================== */

    $.fn.calendarEditor.noConflict = function () {
        $.fn.calendarEditor = old
        return this
    }


}(window.jQuery);
