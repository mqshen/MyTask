!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    if(this.$element.attr("data-toggle") == "button-display") {
        $(this.$element.attr("data-content")).toggle()
        if(this.$element.attr("data-hidden"))
            $(this.$element.attr("data-hidden")).toggle()

    }
    else if(this.$element.attr("data-toggle") == "button-delete") {
    	this.$element.parent().remove()
    }
    else if(this.$element.attr("data-toggle") == "button-hide") {
    	this.$element.parent().hide()
    }
    
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })
  
  
    $(document).on('click.button.data-api', '[data-toggle^=remove]', function (e) {
        var $btn = $(e.target)
        if (!$btn.hasClass('remove')) $btn = $btn.closest('.remove')
        if($btn.attr("data-content")) {
            var $target = $btn.parent()
            $target.hide()
            $target.removeClass("selected")
        }
        else
            $btn.parent().remove()

    })
  

}(window.jQuery);
