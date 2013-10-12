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

    $(document).on('click.hidewindow.data-api', function (e) {
        if($.lily && $.lily.lastWindow) {
            $.lily.lastWindow.hide()
            $.lily.lastWindow = null
        }
    })

    function renderAutoComplete(data) {
        var lastType
        var $documentContainer = $('#autocomplete_container')
        $documentContainer.empty()
        var highlighting= data.highlighting
        for(var i in data.documents) {
            var result = $.parseJSON(data.documents[i])
            if(lastType !== result.type) {
                var typeDisplay = '讨论'
                $documentContainer.append('<div class="ac-row-label">' + typeDisplay + '</div>')
                lastType = result.type
            }
            var $row = $('<div class="ac-row" id=":48" data-behavior="selected_content">' + highlighting[result.id].text + '</div>')
            $documentContainer.append($row)
        }
        $documentContainer.append($('<div class="show_all" data-behavior="selected_content">'
            + '<a data-stacker="false" href="/search?q=' + data.token + '">搜索所有的讨论，待办…</a></div>'))
    }
    $('#autocomplete').autoComplete({
        url: '/autocomplete',
        requestName: 'token',
        minLength: 1,
        render: renderAutoComplete
    })
    $('.timeago').timeago()
    /*
    var WebSocket = window.WebSocket || window.MozWebSocket;
    if (WebSocket) {
        try {
            var socket = new WebSocket('ws://{{options.domain}}/updates');
        } catch (e) {}
    }

    if (socket) {
        socket.onmessage = function(event) {
            console.log(event.data)
            if($.lily.webSocketProcess) {
                var data = $.parseJSON(event.data)
                $.lily.webSocketProcess(data)
            }
        }
    }
    */
})(window.jQuery)

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-43705611-1', 'mytask.com');
ga('send', 'pageview');
