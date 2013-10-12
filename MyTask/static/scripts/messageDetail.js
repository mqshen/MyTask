$(function(){
    $("#message_content").editor()

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
                + '<strong>' + data.own.name + '</strong>:'
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
                + '<a class="decorated" data-behavior="local_file_picker" href="javascript:;" tabindex="-1">'
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
                    + '<img src="/static/images/filetype/' + attachment.icon + '_small.png")}}" class="editable file_icon" '
                    + 'data-type="file" data-content="' 
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
        if(dataContent && dataContent === 'new') {
            $('.image_grid_view', $target).imageView()
        }
        else {
            $('.image_grid_view', $target).data("imageView").reload()
        }
        $.lily.showWarring($target)
        $('time.timeago').timeago()
    }
    $('.image_grid_view').imageView()

    $('[data-toggle=editorTrigger]').data("doResponse", doResponse)
    $('time.timeago').timeago()


    $.lily.webSocketProcess = doResponse
})
