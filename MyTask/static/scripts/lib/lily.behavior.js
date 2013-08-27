!function ($) {

  $(document).on('mouseover.behavior.data-api', '[data-behavior^=has_hover_content]', function (e) {
    var $btn = $(e.target)
    if (!($btn.attr('data-behavior') == 'has_hover_content')) $btn = $btn.closest('[data-behavior=has_hover_content]')
    var $content = $btn.children('[data-behavior=hover_content]')
    $content.show()
  })

  $(document).on('mouseout.behavior.data-api', '[data-behavior^=has_hover_content]', function (e) {
    var $btn = $(e.target)
    if (!($btn.attr('data-behavior') == 'has_hover_content')) $btn = $btn.closest('[data-behavior=has_hover_content]')
    var $content = $btn.children('[data-behavior=hover_content]')
    $content.hide()
  })

  $(document).on('mouseover.selected.data-api', '[data-behavior^=selected_content]', function (e) {
    var $btn = $(e.target)
    if (!($btn.attr('data-behavior') == 'selected_content')) $btn = $btn.closest('[data-behavior=selected_content]')
    $btn.addClass("selected")
  })

  $(document).on('mouseout.selected.data-api', '[data-behavior^=selected_content]', function (e) {
    var $btn = $(e.target)
    if (!($btn.attr('data-behavior') == 'selected_content')) $btn = $btn.closest('[data-behavior=selected_content]')
    $btn.removeClass("selected")
  })
  
}(window.jQuery);
