$(function(){
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
        that.$element.find('input[name=deadLine]').val($.lily.format.formatDate(date, 'yyyy-mm-dd'));
        that.$element.find('input[name=workerId]').val(workerId);
    	if(that.$element.attr("data-remote") == "true") {
    		that.hide()
    		var url = that.$element.attr("href");
    		var requestData = $.lily.collectRequestData(that.$element);
    		requestData[that.$element.attr("data-date-name")] = $.lily.format.formatDate(date, 'yyyy-mm-dd')
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
    $('#tpl-todo-popover').data("callback", dateSelectCallback)
    function doReponseTodoList(responseData) {
        var contentStr = '<li data-sortable-type="todolist" id="sortable_todolist" >'
            + '<article class="todolist">'
            + '<header class="collapsed_content editable_container" data-behavior="has_hover_content" href="/' 
            + responseData.teamId + '/project/' 
            + responseData.project_id + '/todolist/' + responseData.id + '">'
            + '<div class="nubbin" style="left: -54px; display: none;" data-behavior="hover_content">'
            + '<div class="spacer"></div>'
            + '<a class="image delete" data-confirm="您确定要删除这个任务列表吗" data-method="post" data-remote="true" href="/' + responseData.teamId + '/project/1/todolist//trash" rel="nofollow">Delete</a>'
            + '<a class="edit" href="javascript:;" data-toggle="editorTrigger">Edit</a>'
            + '</div>'
            + '<h3 >'
            + '<a class="linked_title editable" href="/' + responseData.teamId + '/project/' + responseData.project_id + '/todolist/' + responseData.id + '" name="title">'
            + responseData.title
            + '</a>'
            + '</h3>'
            + '</header>'
            + '<ul class="todos">'
            + '</ul>'
            + '<ul class="new expanded">'
            + '<li class="collapsed_content">'
            + '<a class="decorated btn" data-toggle="button-display" style="display:none" id="trigger_todoList_' + responseData.id
            + '" data-content="#new_todoitem_' + responseData.id + '" data-hidden="#trigger_todoList_' + responseData.id + '" href="javascript:;">'
            + '添加任务'
            + '</a>'
            + '</li>'
            + '<li class="expanded_content edit_mode">'
            + '<form action="/' + responseData.teamId + '/project/' + responseData.project_id + '/todolist/' + responseData.id + '/todoitem" class="new_todo" '
            + 'data-remote="true" id="new_todoitem_' + responseData.id + '" method="post">'
            + '<textarea id="todo_content" name="description" placeholder="添加一个新任务" '
            + 'rows="1" data-toggle="remote" data-autoresize="true" style="resize: none; overflow: hidden; min-height: 18px;"></textarea>'
            + '<span style="position:relative">'
            + '<span class="pill has_balloon blank ignore_hover">'
            + '<a class="popover-btn" href="javascript:;" data-toggle="popover" data-content="#tpl-todo-popover">'
            + '<input type="hidden" data-toggle="remote" name="deadLine">'
            + '<input type="hidden" data-toggle="remote" name="workerId">'
            + '<span name="workerName">'
            + '未分配'
            + '</span>'
            + '<span class="separator"> · </span>'
            + '<time name="deadlineDate">'
            + '无截止日期'
            + '</time>'
            + '</a>'
            + '</span>'
            + '</span>'
            + '<p class="submit">'
            + '<button name="commit" data-toggle="submit">添加任务</button>'
            + '<a class="cancel btn" data-role="cancel" href="javascript:;" data-toggle="button-display" '
            + 'data-content="#new_todoitem_' + responseData.id  + '" data-hidden="#trigger_todoList_' + responseData.id + '" >'
            + '取消'
            + '</a>'
            + '</p>'
            + '</form>'
            + '</li>'
            + '</ul>'
            + '</article>'
            + '</li>'

        var $todoList = $(contentStr)
        $('#new_todoList_article').toggle()
        $todoList.prependTo('#todolists_container')

        $("form", $todoList).data('doResponse', doReponseTodoItem)
    }

    function doReponseTodoItem(responseData, $element) {
        var $target = $element.closest('article').find('.todos') 
        var contentStr = '<li class="todo show editable_container" data-behavior="has_hover_content" href="/' + responseData.teamId + '/project/' 
            + responseData.project_id 
            + '/todolist/' + responseData.todolist_id + '/todoitem/' + responseData.id + '">'
            + '<div class="nubbin" style="display: none; left: -54px;" data-behavior="hover_content">'
            + '<div class="spacer"></div>'
            + '<a class="image delete" data-confirm="Are you sure you want to delete this to-do?" data-toggle="post" data-toggle="post"' 
            + ' href="/' + responseData.teamId + '/project/' + responseData.project_id 
            + '/todolist/' + responseData.todolist_id + '/todoitem/' + responseData.id + '/trash" rel="nofollow">Delete</a>'
            + '<a class="edit" data-remote="true" data-url="/' + responseData.teamId + '/project/' + responseData.project_id  + '/todolist/' 
            + responseData.todolist_id + '/todoitem/' 
            + responseData.id + '/edit" href="#" data-toggle="editorTrigger">Edit</a>'
            + '</div>'
            + '<div>'
            + '<span class="wrapper">'
            + '<input href="/' + responseData.teamId + '/project/' + responseData.project_id  + '/todolist/' + responseData.todolist_id + '/todoitem/' 
            + responseData.id + '/done" data-toggle="post" name="todo_complete" type="checkbox" value="1">'
            + '<span class="content">'
            + '<a href="/' + responseData.teamId + '/project/' + responseData.project_id + '/todolist/' + responseData.todolist_id + '/todoitem/' 
            + responseData.id + '" class="editable" data-type="textarea" name="description">'
            + responseData.description
            + '</a></span>'
            + '<form action="/' + responseData.teamId + '/project/' + responseData.project_id  + '/todolist/' + responseData.todolist_id + '/todoitem/' 
            + responseData.id + '" class="edit_todo editable" data-remote="true" id="edit_todo_41824572" method="post" data-type="html">'
            + '<span style="position:relative">'
            + '<span class="pill has_balloon blank showing exclusively_expanded expanded" data-toggle="popover" '
            + 'data-content="#tpl-todo-popover" data-hovercontent-strategy="visibility">'
            + '<a class="popover-btn" data-toggle="popover" data-remote="true" data-content="#tpl-todo-popover" href="/' + responseData.teamId + '/project/' 
            + responseData.project_id + '/todolist/' + responseData.todolist_id + '/todoitem/' + responseData.id + '">'
            + '<span name="worker.name" class="echo">'

        if(responseData.worker) {
            contentStr += responseData.worker.name
            contentStr += '</span><span class="separator"> · </span>'
            contentStr += '<input type="hidden" data-toggle="remote" name="workerId" value="' + responseData.worker.id + '">'
        }
        else {
            contentStr += '未分配'
            contentStr += '</span><span class="separator"> · </span>'
            contentStr += '<input type="hidden" data-toggle="remote" name="workerId" >'
        }


                    	
        contentStr += '<time name="deadlineDate">'
        if(responseData.deadline){
            contentStr += responseData.deadline.substring(0, 10)
            contentStr += '</time>'
            contentStr += '<input type="hidden" data-toggle="remote" name="deadLine" value="' + responseData.deadline + '">'
        }
        else {
            contentStr += '无截止日期'
            contentStr += '</time>'
            contentStr += '<input type="hidden" data-toggle="remote" name="deadLine" value="">'
        }
        contentStr += '</a>'
            + '</span>'
            + '</span></form>'
            + '</span>'
            + '</div>'
            + '</li>'
        var $todoItem = $(contentStr)
        $todoItem.appendTo($target)
        $element[0].reset()
    }

    
    $("#new_todolist").data('doResponse', doReponseTodoList)

    $(".new_todo").data('doResponse', doReponseTodoItem)
    $('time.timeago').timeago()
    $('#file_upload_article').fileuploader({
        url: '/attachment'
    })


    function doResponseFileUpload(responseData) {
        var $fileContainer = $('#file_container')
        for(var i in responseData.files) {
            var data = responseData.files[i]
            console.log(data)
            var imageStr
            if(data.fileType == '0')
                imageStr = '<img alt="" class="thumbnail editable" src="/' + responseData.teamId + '/attachment/' + data.url + '" data-type="image" data-content="' 
                    + data.url + '" data-width="' + data.width + '" data-append="#attachments_container" data-height="' + data.height + '">'
            else
                imageStr = '<img alt="" class="" src="/static/images/filetype/' + data.icon + '.png">'
            var $fileObj = $('<article class="attachment">'
                + '<table><tbody><tr><td class="icon"><figure class="thumbnail proportinal">'
                + '<a href="/' + responseData.teamId + '/attachment/' + data.url + '" target="_blank">'
                + imageStr 
                + '</a></figure></td><td class="text"><h3 class="filename">' + data.name
                + '</h3><div class="authorship"><p class="meta"><span class="creator">由 ' + data.own.name + ' 在</span>'
                + '<time class="timeago" data-time="' + data.createTime + '"></time><span>上传</span>'
                + '</p><p class="actions"><a data-stacker="false" href="/' + responseData.teamId + '/attachment/' + data.url + 'target=" _blank"="">下载</a>'
                + '</p></div></td></tr></tbody></table></article>')
            $fileContainer.prepend($fileObj)
        }
        $('#attachments_container').empty()
        $('#file_upload_article').hide()
    }

    $('#fileupload_form').data('doResponse', doResponseFileUpload)
    $('#file_container').imageView()
})
