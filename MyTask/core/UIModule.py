import tornado.web
from tornado.options import options

class UIModule(tornado.web.UIModule):
    def css_files(self):
        environment = options.environment
        if environment == 'development':
            origin_path = options.assets_css_prefix + 'application.less'
            
            origin_abs_path = os.path.abspath(os.path.join(options.assets_path, origin_path))

            abs_path = os.path.abspath(os.path.join(options.static_path, 'css/application.css'))

            command_opt = ['lessc']
            command_opt.append(origin_abs_path)
            command_opt.append(abs_path)
            subprocess.call(command_opt, shell=False)

        return "css/application.css"

    def javascript_files(self): 
        scriptName = self.handler.__class__.__name__

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
            "scripts/lib/lily.time.js",
            "scripts/lib/lily.timeago.js",
            "scripts/lib/lily.validator.js",
            "scripts/lib/lily.stacker.js",
            "scripts/myCalendar.js",
            "scripts/application.js",
            "scripts/Calendar.js",
            "scripts/CalendarEditor.js",
            "scripts/" + scriptName +".js"
        ]

