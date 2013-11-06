$(function(){
    var $accessesSection = $("#accessesSection")
    var $inviteSection = $("#inviteSection")
    $('a').click(function(e){
        var $btn = $(e.target) 
        var $obj = $btn.closest("article")
        var data = {"userId": $obj.attr("data-content")}
        var callback
        if($btn.hasClass("remove")){
            callback = function() {$obj.prependTo($inviteSection)}
            $.extend(data, {"operation": "remove"})
        }
        else {
            callback = function() {$obj.prependTo($accessesSection)}
            $.extend(data, {"operation": "add"})
        }
        $.lily.ajax({
            url : '/' + $.lily.currentTeam + '/project/' + $.lily.currentProjectId + '/access',
			data : data,
			type: 'post',
			processResponse : callback
		});

    })
})
