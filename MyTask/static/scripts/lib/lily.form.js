!function(){

    "use strict"

    var Form = function(button, element, options) {
        this.$submitButton = $(button)
        this.$element = $(element)
        this.options = $.extend({}, $.fn.form.defaults, options)
    }

    Form.prototype = {
        constructor: Form,

        submit: function() {
		    this.oldText = this.$submitButton.text()
		    this.$submitButton.attr("disabled",true).text(this.$submitButton.attr("data-disable-with"))
            var $this = $(this) 
            var requestData = $.lily.collectRequestData(this.$element);
            if(this.$element.data("collectData")) {
                var specialData = this.$element.data("collectData")()
                $.extend(requestData, specialData)
            }
            var self = this
            function processResponse(reponseData) {
                if(self.$element.data("doResponse")) {
                    self.$element.data("doResponse")(reponseData, self.$element) 
                    self.resetForm()
                }
                else {
                    document.location.href = reponseData.successUrl
                }
            }
            $.lily.ajax({url: this.$element.attr("action"), 
                data: requestData, 
                dataType: 'json',
                type: 'POST',
                processResponse: processResponse
            })
        },

        resetForm: function() {
		    this.$submitButton.attr("disabled", false).text(this.oldText)
            if(this.$element.attr("data-save"))
                return
            this.$element[0].reset()
        }

    }

    $.fn.form = function ( option ) {
       return this.each(function () {
           var $this = $(this), 
               data = $this.data('form'), 
               options = typeof option == 'object' && option;
           if (!data) {
               var form = $this.closest("form")
               $this.data('form', (data = new Form(this, form, options)));
           }
           if (option == 'submit') 
               data.submit();
       });
   }

   $.fn.form.defaults = {
       loadingText: 'loading...'
   }

   $.fn.form.Constructor = Form 

   $(document).on('click.form.data-api', '[data-toggle^=submit]', function (e) {
        var $btn = $(e.target)
        $btn.form("submit")

   })
}(window.jQuery)
