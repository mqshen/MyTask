$(function(){
    var isQuery = false
    var lastDay = ''
    var lastProjectId = 0
    var currentPage = 0
    var lastIndex = 1
    function callback(responseData) {
        var $operations = $('#operations')
        var classArray = ["left", "right"]
        var flag = false
        for(var i in responseData.content) {
            var operation = responseData.content[i]
            var actionStr = '<div class="event_container" style="">'
            var createTime = $.lily.format.parseDate(operation.createTime, "yyyy-mm-dd hh:mi:ss")
            if(!createTime.isSameDay(lastDay)) {
                actionStr += '<div class="day">'
                    + '<a href="/2203367/summary/2013-05-07" class="decorated">'
                    + '<span>'
                    + '<span>' + createTime.format("mm-dd") + '</span>'
                    + '<time date-days-ago="" >' + $.lily.param.getDisplay("WEEK_DAY", createTime.getDay()) + '</time>'
                    + '</span>'
                    + '</a>'
                    + '</div>'
                lastProjectId = 0
                lastIndex = (lastIndex + 1) % 2
                flag = true
            }
            lastDay = createTime
            if(lastProjectId != operation.project_id) {
                if(!flag)
                    lastIndex = (lastIndex + 1) % 2
                actionStr += '<div class="project chiral ' + classArray[lastIndex] + '" style="">'
                    + '<a data-default-stack="true" href="/project/' + operation.project.id + '">' + operation.project.title + '</a>'
                    + '</div>'
            }
            flag = false
            lastProjectId = operation.project_id
    
            actionStr += '<article class="event chiral ' + classArray[lastIndex] + '" data-side="left">'
                + '<div class="time">'
                + '<span class="time_only">'
                + '<time data-local-time="" datetime="" style="">' + createTime.format("hh:mi") + '</time>'
                + '</span>'
                + '</div>'
                + '<div class="avatar">'
                + '<a data-stacker="false" href="/people/' + operation.own.id + '">'
                + '<img class="avatar" height="48" src="/avatar/' + operation.own.avatar + '" title="' + operation.own.name + '" width="48">'
                + '</a>'
                + '</div>'
                + '<div class="action">'
                + '<span class="creator" data-creator-id="4061968">'
                + operation.own.name
                + '</span>'
                + operation.digest
                + '</div>'
                + '</article>'
                + '</div>'
            $operations.append(actionStr)
        }
        if(responseData.content.length > 0)
            isQuery = false 
        $('#wait').hide()
    }
    
    function queryOperation(begin){
        isQuery = true
        $('#wait').show()
        $.lily.ajax({
            url : '/' + teamId + '/operation',
            data : {begin: begin, size: 30},
    		type: 'post',
    		processResponse : callback
    	});
    }
    queryOperation(currentPage)
    $(window).scroll(function() {
        if(isQuery)
            return
        var scrolled = $(window).scrollTop()
        if($('body').height() - $(window).height() - scrolled < 200)
            queryOperation(++currentPage)
    })
})
