!function ($) {

  "use strict"; // jshint ;_;


 /* BUselectTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Select = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.select.defaults, options)
  }

  Select.prototype.setState = function (state) {
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

  Select.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="select-radio"]')

    $parent && $parent
      .find('.selected')
      .removeClass('selected')

    this.$element.toggleClass('selected')
  }


 /* select PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.select

  $.fn.select = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('select')
        , options = typeof option == 'object' && option
      if (!data) $this.data('select', (data = new Select(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.select.defaults = {
    loadingText: 'loading...'
  }

  $.fn.select.Constructor = Select 


 /* select NO CONFLICT
  * ================== */

  $.fn.select.noConflict = function () {
    $.fn.select = old
    return this
  }


 /* select DATA-API
  * =============== */

  $(document).on('click.select.data-api', '[data-toggle^=select]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.select('toggle')
  })

}(window.jQuery);