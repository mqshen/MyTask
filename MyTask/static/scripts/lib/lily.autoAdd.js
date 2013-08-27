!function(){

    "use strict"

    var AutoAdd = function(element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.autoAdd.defaults, options)
        this.$addContent = this.$element.children().clone()
        this.init()
    }

    AutoAdd.prototype = {
        constructor: AutoAdd,

        init: function() {
            this.bindEvent(this.$element.children())
            this.hasEmptyInput = this.options.initSize
            for(var i=1; i< this.options.initSize; ++i) {
                this.addElement()
            }
        },

        addElement: function() {
            var $element = this.$addContent.clone()
            this.$element.append($element)
            this.bindEvent($element)
        },

        bindEvent: function($element) {
            var self = this
            $('input', $element).blur(function(){
                var $this = $(this)
                self.endInput($this)
            })
            $('input', $element).focus(function(){
                var $this = $(this)
                self.beginInput($this)
            })
        },

        beginInput: function($obj) {
            var $element = $obj.closest(".field")
            $element.addClass("focused")
            if($obj.val().length == 0)
                --this.hasEmptyInput
        },
        endInput: function($obj){
            var self = this
            var $element = $obj.closest(".field")
            if($obj.val().length == 0) {
                ++this.hasEmptyInput
                $element.removeClass("focused")
            }
            else {
                if($element.children('.remove').length == 0) {
                    $element.append('<a class="remove" data-toggle="remove"></a>')
                }
            }
            if(this.hasEmptyInput < 2) {
                this.addElement()
                ++this.hasEmptyInput
            }
        }
    }

    $.fn.autoAdd = function ( option ) {
       return this.each(function () {
           var $this = $(this), 
               data = $this.data('autoAdd'), 
               options = typeof option == 'object' && option;
           if (!data) {
               $this.data('autoAdd', (data = new AutoAdd(this, options)));
           }
       });
   }

   $.fn.autoAdd.defaults = {
       loadingText: 'loading...',
       initSize: 3
   }

   $.fn.autoAdd.Constructor = AutoAdd 

}(window.jQuery)
