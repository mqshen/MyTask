$(function(){
    var $element = $('#myCalendar')
    var $calendar_editor = $('#calendar_editor_singleton');
    function showCalendarEditor(e) {
        var $btn = $(e.target);
        var $source = $btn.parent('li');
        $calendar_editor.show();
    }
    function calendarProcess(responseData, $element) {
        $('span.swatch', $element).css("background-color", '#' + responseData.color)
        $('.calendar_title', $element).text(responseData.title)
        var bucket = 'Calendar:' + responseData.id
        $('.event[data-bucket="' + bucket + '"]').children(".event").css("color", "#" + responseData.color)
        $('.row[data-bucket="' + bucket + '"]').children(".event").css("background-color", "#" + responseData.color)
        calendarColor[bucket] = responseData.color
    }
    function projectProcess(responseData, $element) {
        $('span.swatch', $element).css("background-color", '#' + responseData.color)
        $('.calendar_title', $element).text(responseData.title)
    
        $('.event[data-bucket]')
    }
    
    function newCalendarProcess(responseData, $element) {
        var $calendar = $('<li class="calendar" id="calendar_451504" data-url="/' + responseData.teamId + '/calendar" data-bucket-id="' 
            + responseData.id + '">'
            + '<span class="swatch" style="background-color: #' + responseData.color + '">'
            + '<a href="javascript:;" class="active btn" data-toggle="select" data-behavior="toggle_bucket"></a>'
            + '</span>'
            + '<a href="javascript:;" class="calendar_title" title="Only show this calendar">' + responseData.title 
            + '</a><a href="javascript:;" class="popover-btn" title="">设置</a>'
            + '</li>')
        $('#calendar_list').append($calendar)
    }
    
    $('#calendar_list > li').calendarEditor({
        content: '#calendar_editor_singleton',
        processResponse: calendarProcess,
        deleteProcessResponse: removeEvent
    })
    
    $('#project_list > li').calendarEditor({
        content: '#project_editor_singleton',
        processResponse: projectProcess,
        deleteProcessResponse: removeEvent
    })
    
    $('#new_calendar_area').calendarEditor({
        content: '#calendar_editor_singleton',
        processResponse: newCalendarProcess,
        deleteProcessResponse: removeEvent
    })
    
    function doEventResponse(responseData, $element, oldEvent, $eventElement) {
        var event = responseData
        changeEvent(event, $element, oldEvent, $eventElement)
    }
    
    function getEventType(event) {
        if(event.startDate === event.endDate)
            return 1
        return 2
    }
    
    function removeEvent(event) {
       $element.find('.event[data-id="' + event.id + '"]').remove()
       $element.find('.row[data-id="' + event.id + '"]').remove()
    }
    
    function calculateStyle(beginDate, endDate, weekDay, nextWeekDay) {
        var slot = beginDate.minus(weekDay)
        var eventClass = ''
        if(slot < 0) {
            eventClass += 'slot_0 wraps_prev'
            slot = 0
        }
        else {
            eventClass += 'slot_' + slot
        }
        var width = nextWeekDay.minus(beginDate)
        var endWidth = endDate.minus(beginDate) + 1
        width = width < endWidth ? width : endWidth
        if(width > 7) {
            width = endDate.minus(weekDay) + 1
        }
        else if(width !== endWidth){
            eventClass += ' wraps_next'
        }
        if(width > 7) {
            eventClass += ' width_7 wraps_next'
            width = 7
        }
        else {
            eventClass += ' width_' + width 
        }
        return {class: eventClass, width: width, slot: slot}
    }
    function generateEventHtml(event, eventStyle) {
        if(event.startTime != undefined) {
            event.startTime = $.lily.timFormater.parse(event.startTime)
        }
        event.bucket =  'Calendar:' + event.calendar_id
        if(event.project_id != undefined)
            event.bucket = 'Project:' + event.project_id
        var color = calendarColor['Calendar:' + event.calendar_id]
        return '<div class="row" data-url="/' + teamId + '/event" data-id="' + event.id + '" data-bucket="' + event.bucket +'">'
            + '<div class="event ' + eventStyle.class + '" style="background-color: #' + color + '" >'
            + '<input data-toggle="remote" type="hidden" name="id" value="' + event.id + '">'
            + '<input data-toggle="remote" type="hidden" name="startDate" value="' + event.startDate + '">'
            + '<input data-toggle="remote" type="hidden" name="endDate" value="' + event.endDate + '">'
            + '<input data-toggle="remote" type="hidden" name="bucket" value="' + event.bucket + '">'
            + '<input data-toggle="remote" type="hidden" name="startTime" value="' + event.startTime + '">'
            + '<input data-toggle="remote" type="hidden" name="description" value="' + event.description + '">'
            + '<span class="event popover-btn" >' 
            + '<span class="title" name="title" data-toggle="remote">' + event.title + '</span></span>'
            + '</div></div>'
    }
    
    
    function spannedOperation($target, start, end, flag) {
        for(var j = start ; j < end; ++ j) {
            var $currentSpanned = $target.eq(j)
            if(flag)
                $currentSpanned.append('<div class="spacer"></div>')
            else {
                $currentSpanned.children().eq(0).remove()
            }
        }
    }
    
    function changeEvent(event, $target, oldEvent, $eventElement) {
        if(event.startTime != undefined && event.startTime.length > 0 ) {
            event.startTime = $.lily.timFormater.parse(event.startTime)
        }
        else {
            event.startTime = ''
        }
        var eventType = getEventType(event)
        var oldEventType = getEventType(oldEvent)
        event.bucket =  'Calendar:' + event.calendar_id
        if(event.project_id != undefined)
            event.bucket = 'Project:' + event.project_id
        var color = calendarColor[event.bucket]
        $target.attr("data-bucket", event.bucket)
        if(eventType != oldEventType) {
            removeEvent(oldEvent)
            if($eventElement)
                $eventElement.remove()
            appendEvent(event)
        }
        else if(eventType === 1) {
            $.lily.changeData($target, event)
        }
        else {
            if($eventElement)
                $eventElement.remove()
            var beginDate = $.lily.format.parseDate(event.startDate)
            var endDate = $.lily.format.parseDate(event.endDate)
    
            var oldBeginDate = $.lily.format.parseDate(oldEvent.startDate)
            var oldEndDate = $.lily.format.parseDate(oldEvent.endDate)
    
            var weekFirstDayArray = calendar.getWeekFirstDayArray()
            var weekDay = weekFirstDayArray[0]
    
            for(var i = 1; i < weekFirstDayArray.length; ++i) {
                var nextWeekDay = weekFirstDayArray[i]
                var interval = nextWeekDay.minus(beginDate)
                var nextInterval = endDate.minus(weekDay)
                if(interval > 0 && nextInterval >= 0) {
                    var $weekElement = $('.week[data-date=' + weekDay.format('yyyy-mm-dd') + ']', $element)
                    var $eventContainer = $weekElement.children(".events")
                    var $eventElement = $eventContainer.find('.row[data-id="' + event.id + '"]')
    
                    var eventStyle = calculateStyle(beginDate, endDate, weekDay, nextWeekDay)
                    var oldEventStyle = calculateStyle(oldBeginDate, oldEndDate, weekDay, nextWeekDay)
    
                    var color = calendarColor['Calendar:' + event.calendar_id]
                    if($eventElement.length == 0) {                
                        $eventElement = $(generateEventHtml(event, eventStyle))
                        $eventContainer.append($eventElement)
                        $eventElement.calendarEditor({
                            content: '#tpl-event-popover',
                            position: 'side',
                            processResponse: doEventResponse,
                            deleteProcessResponse: removeEvent
                        })
                        var $spanned = $weekElement.find(".events.spanned")
                        var $currentSpanned = $($spanned[0])
                        $currentSpanned.append('<div class="spacer"></div>')
                        spannedOperation($spanned, eventStyle.slot + 1, eventStyle.width + eventStyle.slot + 1, true)
                    }
                    else {
                        var $event = $eventElement.children('.event')
                        $event.removeClass(oldEventStyle.class)
                        $event.addClass(eventStyle.class)
                        $.lily.changeData($eventElement, event)
                        var $spanned = $weekElement.find(".date > .events.spanned")
    
                        var minStartSlot = eventStyle.slot 
                        var maxStartSlot = oldEventStyle.slot
                        if(minStartSlot !== maxStartSlot ) {
                            var spannedFlag = true
                            if(minStartSlot > maxStartSlot) {
                                minStartSlot = oldEventStyle.slot 
                                maxStartSlot = eventStyle.slot
                                spannedFlag = false
                            }
                            spannedOperation($spanned, minStartSlot, maxStartSlot, spannedFlag)
                        }
    
                        var minEndSlot = eventStyle.slot + eventStyle.width
                        var maxEndSlot = oldEventStyle.slot + oldEventStyle.width
                        if(minEndSlot !== maxEndSlot ) {
                            spannedFlag = false
                            if(minEndSlot > maxEndSlot) {
                                var temp = minEndSlot
                                minEndSlot = maxEndSlot
                                maxEndSlot = temp 
                                spannedFlag = true
                            }
                            spannedOperation($spanned, minEndSlot, maxEndSlot, spannedFlag)
                        }
                        $event.css("background-color", '#' + color)
                    }
                }
                else {
                    var $weekElement = $('.week[data-date=' + weekDay.format('yyyy-mm-dd') + ']', $element)
                    var $eventContainer = $weekElement.children(".events")
                    var $eventElement = $eventContainer.find('.row[data-id="' + event.id + '"]')
                    if($eventElement.length > 0) {
                        $eventElement.next().remove()
                        $eventElement.remove()
                        var eventStyle = calculateStyle(oldBeginDate, oldEndDate, weekDay, nextWeekDay)
                        var $spanned = $weekElement.find(".date > .events.spanned")
                        spannedOperation($spanned, eventStyle.slot , eventStyle.width + eventStyle.slot + 1, false)
                    }
                }
                weekDay = nextWeekDay
            }
        }
    }
    
    function addEvent($dayElement, event, type){
        var $eventContainer = $('.all_day', $dayElement)
        if($eventContainer.length == 0 ) {
            $eventContainer = $('<div class="events all_day"></div>')
            $dayElement.append($eventContainer) 
        }
        var title = event.title
        var startTime = event.startTime
        if(startTime == null || startTime == 'null')
            startTime = ''
        else
            startTime = $.lily.format.formatInputTime(startTime)
        var bucket =  'Calendar:' + event.calendar_id
        if(type === 'project')
            bucket = 'Project:' + event.project_id
        var color = calendarColor[bucket]
        $eventElement = $('<div class="event " data-url="/' + teamId + '/event" data-id="'+ event.id + '" data-bucket="' + bucket +'">' 
            + '<input data-toggle="remote" type="hidden" name="id" value="' + event.id + '">'
            + '<input data-toggle="remote" type="hidden" name="startDate" value="' + event.startDate + '">'
            + '<input data-toggle="remote" type="hidden" name="endDate" value="' + event.endDate + '">'
            + '<input data-toggle="remote" type="hidden" name="bucket" value="' + bucket + '">'
            + '<input data-toggle="remote" type="hidden" name="startTime" value="' + event.startTime + '">'
            + '<input data-toggle="remote" type="hidden" name="description" value="' + event.description + '">'
            + '<span class="event" style="color: #' + color + '" title="Calendar: General">'
            + '•&nbsp;<span class="title popover-btn" name="title" data-content="#tpl-event-popover" data-toggle="remote">' + title + '</span>'
            + '<span class="time" name="startTime" data-toggle="remote">' + startTime + '</span></span></div>')
        $eventContainer.append($eventElement)
        $eventElement.calendarEditor({
            content: '#tpl-event-popover',
            position: 'side',
            processResponse: doEventResponse,
            deleteProcessResponse: removeEvent
        })
    }
    function addNewEvent($dayElement, event){
        var $eventContainer = $('.all_day', $dayElement)
        var color = calendarColor[currentCalendar]
        $eventElement = $('<div class="event " data-url="/' + teamId + '/event">' 
            + '<input data-toggle="remote" type="hidden" name="startDate" value="' + $dayElement.attr("data-date") + '">'
            + '<input data-toggle="remote" type="hidden" name="endDate" value="' + $dayElement.attr("data-date") + '">'
            + '<span class="event" style="color: #' + color + '" title="Calendar: General">'
            + '•&nbsp;<span class="title popover-btn" name="title" data-content="#tpl-event-popover" data-toggle="remote">新事件</span>'
            + '<span class="time" name="startTime" data-toggle="remote"></span></span></div>')
        $eventContainer.append($eventElement)
        $eventElement.calendarEditor({
            content: '#tpl-event-popover',
            position: 'side',
            processResponse: function(responseData, $element, requestData) {
                doEventResponse(responseData, $element, requestData, $eventElement)
            },
            doCancel: function() {
                $eventElement.remove()
            },
            deleteProcessResponse: removeEvent
        })
        $('.popover-btn', $eventElement).click()
    }
    function appendEvent(event, type) {
        var startDate = event.startDate
        var endDate = event.endDate 
        if(startDate === endDate) {
            var $dayElement = $('[data-date=' + startDate + ']', $element)
            addEvent($dayElement, event);
        }
        else {
            var beginDate = $.lily.format.parseDate(event.startDate)
            var endDate = $.lily.format.parseDate(event.endDate)
    
            var weekFirstDayArray = calendar.getWeekFirstDayArray()
            var weekDay = weekFirstDayArray[0]
            for(var i = 1; i < weekFirstDayArray.length; ++i) {
                var nextWeekDay = weekFirstDayArray[i]
                var interval = nextWeekDay.minus(beginDate)
                var nextInterval = endDate.minus(weekDay)
                if(interval > 0 && nextInterval >= 0) {
                    var $weekElement = $('.week[data-date=' + weekDay.format('yyyy-mm-dd') + ']', $element)
                    var $eventContainer = $weekElement.children(".events")
                    var eventStyle = calculateStyle(beginDate, endDate, weekDay, nextWeekDay)
    
                    $eventElement = $(generateEventHtml(event, eventStyle ))
                    $eventContainer.append($eventElement)
                    $eventElement.calendarEditor({
                        content: '#tpl-event-popover',
                        position: 'side',
                        processResponse: doEventResponse,
                        deleteProcessResponse: removeEvent
                    })
                    var $spanned = $weekElement.find(".events.spanned")
                    var $currentSpanned = $($spanned[0])
                    $currentSpanned.append('<div class="spacer"></div>')
                    for(var j = eventStyle.slot + 1; j < eventStyle.width + eventStyle.slot + 1; ++ j) {
                        $spanned.eq(j).append('<div class="spacer"></div>')
                    }
                }
                weekDay = nextWeekDay
            }
        }
    }
    
    function queryEvents(startDate, endDate) {
        function callback(reponseData) {
            var todoItems = reponseData.todoItems
            for(var i in todoItems) {
                var todoItem = todoItems[i]
                var date = todoItem.deadline.substring(0,10)
                var $dayElement = $('.date[data-date=' + date + ']', $element)
                var $todoContainer = $('.todos', $dayElement)
                if($todoContainer.length == 0 ) {
                    $todoContainer = $('<div class="events todos "></div>')
                    $dayElement.append($todoContainer) 
                }
                var color = calendarColor['Project:' + todoItem.project_id]
                var description = todoItem.description
                var checkFlag = ''
                if(todoItem.done)
                    checkFlag = 'checked'
                var $todoElement = $('<div class="event todo " data-bucket="Project:' + todoItem.project_id + '" style="color:#' + color + '">'
                    + ' <span class="wrapper event">'
                    + '<input type="checkbox" value="1" ' + checkFlag + ' data-behavior="toggle_todo" data-url="/project/' + todoItem.project_id 
                    + '/todolist' + todoItem.todolist_id + '/todoitem/' + todoItem.id + '/done">'
                    + '<span class="content">'
                    + description + '</span></span></div>')
                $todoContainer.append($todoElement)
            }
            var projectEvents = reponseData.project_events
            for(var i in projectEvents ) {
                var event = projectEvents[i]
                appendEvent(event )
            }
            var calendarEvents = reponseData.calendar_events
            for(var i in calendarEvents ) {
                var event = calendarEvents[i]
                appendEvent(event )
            }
        }
        $.lily.ajax({
            url : '/' + teamId + '/event',
            data : {start_date: startDate, end_date: endDate},
        	type: 'get',
        	processResponse : callback
        });
    }
    
    $element.myCalendar({
        title: '#myCalendar_title',
        body: '#calendar_grid_singleton',
        jump: '#myCalendar_month_select',
        changer: queryEvents,
        selector: addNewEvent
    })
    var calendar = $element.data('myCalendar')
    
    $('#invitees').autoAdd()
    
    $('.toggle_calendar_list').click(function(){
        $('#calendar_display_singleton').toggleClass('calendar_list_visible')
    })
    
    $('#event_start_time').time()
    
    $(document).on('click.bucket.data-api', '[data-behavior=toggle_bucket]', function (e) {
        var $btn = $(e.target)
        var bucket = $btn.parent().parent().attr("data-bucket")
        $('.event[data-bucket="' + bucket + '"]').toggle()
        $('.row[data-bucket="' + bucket + '"]').toggle()
    })
})
