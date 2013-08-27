/*!
 *
 */
(function ($, undefined) {
	function postAreaInit() {
		var $openerContainer = $('#post-message-container');
		var $fakeEditorContainer = $('#publisher-opener-container', $openerContainer);
		var $editorContainer = $('#publisher-components', $openerContainer);
		var $textArea = $('textarea', $editorContainer);
		var $publishButton = $('#publisher-button', $editorContainer);
		function showEditor() {
			var $this = $(this);
			var compontId = $(this).attr('data-content');
			$fakeEditorContainer.css("display", "none");
			$editorContainer.css("display", "block");
			$textArea.focus();
		}
		$('a', $openerContainer ).bind('click.publisher', showEditor);
		$fakeEditorContainer.bind('click.publisher', showEditor);
		$textArea.bind("input",function(){
			var $this = $(this);
			var text = $this.val();
			if(text.trim().length == 0)
				$publishButton.attr("disabled", true);
			else
				$publishButton.attr("disabled", false);
		})
		
	}
	$(function(){
		postAreaInit();
	});
})(window.jQuery)