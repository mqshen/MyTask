$(function(){
    $('time.timeago').timeago()
    function doReponseTodoItem(responseData, $element) {
        var $target = $element.closest('article').find('.todos') 
        var contentStr = '<li class="todo show editable_container" data-behavior="has_hover_content" href="/' + responseData.teamId + '/project/' 
            + responseData.project_id 
            + '/todolist/' + responseData.todolist_id + '/todoitem/' + responseData.id + '">'
            + '<div class="nubbin" style="display: none; left: -62px;" data-behavior="hover_content">'
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

    function doReponseTodoList(responseData) {
        var contentStr = '<li data-sortable-type="todolist" id="sortable_todolist" >'
            + '<article class="todolist">'
            + '<header class="collapsed_content editable_container" data-behavior="has_hover_content" href="/' + responseData.teamId + '/project/' 
            + responseData.project_id + '/todolist/' + responseData.id + '">'
            + '<div class="nubbin" style="left: -62px; display: none;" data-behavior="hover_content">'
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
    $(".new_todo").data('doResponse', doReponseTodoList)

        function doResponse(data, $obj, $container){
            var dataContent = 'new'
            if(arguments.length > 1)
                dataContent = $obj.attr("data-content")
            else
                $container = $('#new_comment_container')
            var imageContainerSelector = '#image_attachment' 
            var fileContainerSelector = '#file_attachments'

            var $imageContainer, $fileContainer, $target = $container 
            
            if(dataContent && dataContent === 'new') {
                $target = $('<article class="comment editable_container" '
                    + 'href="/' + responseData.teamId + '/project/' + data.project_id + '/message/' + data.message_id + '/comment">'
                    + '<a href="/' + responseData.teamId + '/people/' + data.own.id + '" class="editable" data-type="html">'
                    + '<img class="avatar" src="/avatar/' + data.own.avatar + '">'
                    + '</a>'
                    + '<div class="formatted_content">'
                    + '<strong>' + data.own.name + '</strong>-'
                    + '<div class="editable" name="content" data-type="textarea">'
                    + data.content
                    + '</div>'
                    + '</div>'
                    + '<footer class="time">'
                    + '在<time class="timeago" data-time="' + data.createTime + '" style="">' + data.createTime
                    + '</time>发布<span>–'
                    + '<a class="edit" data-remote="true" href="javascript:;" data-toggle="editorTrigger" data-content="21">'
                    + '编辑</a> 或'
                    + '<a class="delete" data-confirm="Are you sure you want to delete this comment?"' 
                    + 'data-toggle="post" href="/' + responseData.teamId + '/project/55/message/42/comment/21/trash" rel="nofollow">删除</a>'
                    + '</span></footer>'
                    + '<div class="attachments editable" data-type="html">'
                    + '<div class="attachment_tool">'
                    + '<span class="prompt_graphic"></span>'
                    + '<div class="file_input_button">'
                    + '<span data-with-features="files_api">'
                    + '上传文件'
                    + '</span>'
                    + '<span class="file_input_container">'
                    + '<input name="attachment" type="file" multiple="" id="messageAttachment" '
                    + 'data-content="_new" tabindex="-1">'
                    + '<a class="decorated" data-behavior="local_file_picker" href="#" tabindex="-1">'
                    + '选择要上传的文件'
                    + '</a>'
                    + '</span>'
                    + '</div>'
                    + '</div>'
                    + '<ul class="pending_attachments ui-sortable" id="attachments_container">'
                    + '</ul>'
                    + '<div id="attachments_for_message_11182345">'
                    + '<div class="image_grid_view">'
                    + '<table class="in_3_columns">'
                    + '<tbody id="image_attachment' + data.id + '">'
                    + '</tbody>'
                    + '</table>'
                    + '</div>'
                    + '<ul class="file_attachments" id="file_attachments' + data.id + '">'
                    + '</ul>'
                    + '</div>'
                    + '</div>'
                    + '</article>')
                $('#add_comment_content').text('')
                $target.insertBefore($container)
                imageContainerSelector += data.id
                fileContainerSelector += data.id
                if($obj)
                    $obj.data("editorTrigger").distory()
            }
            else if(dataContent){
                imageContainerSelector += dataContent
                fileContainerSelector += dataContent
            }
            var $imageContainer = $(imageContainerSelector, $target)
            var $fileContainer = $(fileContainerSelector, $target)
            $fileContainer.empty()
            $imageContainer.empty()
            var $images 
            var imageNum = 0
            for(var i in data.attachments) {            
                console.log(i)
                var attachment = data.attachments[i]
                if(attachment.fileType == 0) { 
                    if( imageNum % 3 == 0)
                        $images = $('<tr class="images"></tr>')
                    ++imageNum
                    var image = '<td class="occupied">'
                        + '<article class="image">'
                        + '<figure class="thumbnail proportinal">'
                        + '<a href="/' + responseData.teamId + '/attachment/' + attachment.url + '" target="_blank">'
                        + '<div class="background" style="height: 174px; width: 262px;">'
                        + '<img alt="" class="thumbnail editable" src="/attachment/' + attachment.url
                        + '" data-type="image" data-append="#attachments_container" data-content="' + attachment.url + '" '
                        + 'data-width="' + attachment.width + '" data-height="' + attachment.height + '">'
                        + '</div>'
                        + '</a>'
                        + '</figure>'
                        + '</article>'
                        + '</td>'
                    $images.append(image)
                    if( imageNum % 3 == 2)
                        $imageContainer.append($images) 
                }
                else {
                    var $fileObj = $('<li>'
                        + '<a href="/' + responseData.teamId + '/attachment/' + attachment.url + '" target="_blank">'
                        + '<img src="{{static_url("images/document.png")}}" class="editable" data-type="file" data-content="' 
                        + attachment.url + '" data-append="#attachments_container">'
                        + '<span>' + attachment.name + '</span>'
                        + '</a>'
                        + '<div class="tags">'
                        + '<ul class="tags">'
                        + '</ul>'
                        + '</div>'
                        + '</li>')
                    $fileContainer.append($fileObj)
                }
            }
            if(imageNum %3 != 2)
                $imageContainer.append($images) 
            /*
            if(dataContent && dataContent === 'new') {
                $('.image_grid_view', $target).imageView()
            }
            else {
                $('.image_grid_view', $target).data("imageView").reload()
            }
            */
            $.lily.showWarring($target)
            $('time.timeago').timeago()
        }
        $('[data-toggle=editorTrigger]').data("doResponse", doResponse)
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

