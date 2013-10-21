$(function(){
    $("#message_content").editor()

    $('#file_upload_article').fileuploader({
        url: '/attachment'
    })
})
