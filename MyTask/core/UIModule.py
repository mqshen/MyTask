import tornado.web

class UIModule(tornado.web.UIModule):
    def javascript_files(self): 
        scriptName = self.handler.__class__.__name__
        if scriptName == 'CalendarHandler':
            return [
                "scripts/lib/jquery.js",
                "scripts/lib/lily.core.js",
                "scripts/lib/lily.autoComplete.js",
                "scripts/lib/lily.format.js",
                "scripts/lib/lily.autoAdd.js",
                "scripts/calendarEditor.js",
                "scripts/myCalendar.js",
                "scripts/lib/lily.time.js",
                "scripts/Calendar.js"
            ]
        if scriptName.endswith('Handler') :
            scriptName = scriptName[:-7] 

        return [
            "scripts/lib/jquery.js",
            "scripts/lib/lily.autoComplete.js",
            "scripts/lib/jsrender.js",
            "scripts/lib/lily.core.js",
            "scripts/lib/lily.button.js",
            "scripts/lib/lily.select.js",
            "scripts/lib/lily.form.js",
            "scripts/lib/lily.behavior.js",
            "scripts/lib/lily.popover.js",
            "scripts/lib/lily.calendar.js",
            "scripts/lib/lily.datepicker.js",
            "scripts/lib/lily.format.js",
            "scripts/lib/lily.param.js",
            "scripts/lib/lily.editor.js",
            "scripts/lib/lily.editorTrigger.js",
            "scripts/lib/lily.todo.js",
            "scripts/lib/lily.html5fileuploader.js",
            "scripts/lib/lily.imageView.js",
            "scripts/lib/lily.autoAdd.js",
            "scripts/lib/lily.timeago.js",
            "scripts/lib/lily.stacker.js",
            "scripts/myCalendar.js",
            "scripts/application.js",
            "scripts/" + scriptName +".js"
        ]

