$(function(){

    $('select').change(function() {
        var member = $('#member_filter').val()
        $('li.todo').each(function(){
            var $this = $(this)
            if(member && member.length > 0){
                var thisMember = member
                if(member === "unassigned") 
                    thisMember = ""
                var currentMember = $this.find("[name=workerId]").val()
                if(currentMember == thisMember)
                    $this.show()
                else
                    $this.hide()
            }
            else {
                $this.show()
            }
        })
    })
    $('#tpl-todo-popover').data("callback", dateSelectCallback)
    function dateSelectCallback(date, that) {
        function processResponse(data) {
            var date = data.deadline
            var workerName = data.worker.name
            that.$element.find('[name=deadlineDate]').text(date.substring(0, 10));
            that.$element.find('[name="worker.name"]').text(workerName);
            $.lily.hideWait(that.$element)
        }
        var workerId = that.$content.find("select").val()
        var workerName = that.$content.find("select").find("option:selected").text()
        that.$element.find('input[name=deadLine]').val($.lily.format.formatDate(date, 'yyyy-mm-dd 23:59:59'));
        that.$element.find('input[name=workerId]').val(workerId);
    	if(that.$element.attr("data-remote") == "true") {
    		that.hide()
    		var url = that.$element.attr("href");
    		var requestData = $.lily.collectRequestData(that.$element);
    		requestData[that.$element.attr("data-date-name")] = $.lily.format.formatDate(date, 'yyyy-mm-dd 23:59:59')
    		$.lily.showWait(that.$element);
    		$.lily.ajax({url: url,
    			dataType: 'json',
    			data: requestData,
    	        type: 'POST',
    	        processResponse: processResponse
    	    })
    	}
    	else {
        	that.$element.find('[name=deadlineDate]').text($.lily.format.formatDate(date));
        	that.$element.find('[name=workerName]').text(workerName);
        	that.hide();
    	}
    }
})

