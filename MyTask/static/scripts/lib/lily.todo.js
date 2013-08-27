!function ($) {

  "use strict"; // jshint ;_;


 /* PUBLIC CLASS DEFINITION
  * ============================== */

  var Todo= function ($todoElement, options) {
    this.$element = $todoElement
    this.options = $.extend({}, $.fn.todo.defaults, options)
  }

  Todo.prototype = {

    constructor: Todo,

    process: function(button) {
        var $button = $(button)
        this.$button = $button
        var url = $button.attr("href")
        var that = this
        function processResponse(responseData) {
            if(url.match(/trash$/)) {
                $button.closest('li').remove()
            }
            else if(url.match(/\/done$/)) {
                if(!that.$completeContainer) {
                    var test = that.$element.closest('article')
                    that.$completeContainer = test.find("ul.completed")
                }
                $button.attr("href", url.substring(0, url.length - 4) + "undone")
                that.$element.addClass("completed").appendTo(that.$completeContainer)
                that.$element.find('.pill').removeClass("delay")
				$('.editable,.echo', that.$element).each(function(){
					var $this = $(this)
                    $.lily.fillHtml($this, responseData)
				})
                $.lily.hideWait($button)
            }
            else if(url.match(/\/undone$/)) {
                if(!that.$uncompleteContainer) {
                    var test = that.$element.closest('article')
                    that.$uncompleteContainer = test.find("ul.todos")
                }
                $button.attr("href", url.substring(0, url.length - 6) + "done")
                that.$element.removeClass("completed").appendTo(that.$uncompleteContainer)
                that.$element.attr("data-behavior", "has_hover_content")
                $.lily.hideWait($button)
            }
        }
        $.lily.showWait($button)
        $button.css("display", "none")
        var confirmMessage = $button.attr("data-confirm")
        if(confirmMessage) {
            if(!confirm(confirmMessage)) {
                that.resetButton()
                return
            }
        }
        $.lily.ajax({url: url,
            dataType: 'json',
            type: 'POST',
            processResponse: processResponse
        })
        
    },

    resetButton: function() {
        $.lily.hideWait(this.$button)
        $button.css("display", "")
    }
}


 /* PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.todo

  $.fn.todo= function (option) {
    return this.each(function () {
      var $this = $(this)
        , options = typeof option == 'object' && option
        , $todoElement = $this.closest('li')
        , data = $todoElement.data('todo')
      if (!data) $todoElement.data('todo', (data = new Todo($todoElement, options)))
      data.process(this)
    })
  }

  $.fn.todo.defaults = {
    loadingText: 'loading...'
  }

  $.fn.todo.Constructor = Todo


 /* NO CONFLICT
  * ================== */

  $.fn.todo.noConflict = function () {
    $.fn.todo= old
    return this
  }


 /* DATA-API
  * =============== */

  $(document).on('click.todo.data-api', '[data-toggle^=post]', function (e) {
    var $btn = $(e.target)
    if($btn[0].nodeName.toLowerCase() == 'a')
        e.preventDefault()
    $btn.todo()
  })

}(window.jQuery);
