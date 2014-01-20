import tornado.web
from tornado import escape
from tornado.escape import utf8
from tornado.util import bytes_type, unicode_type
from core.session import Session

from core.escape import json_encode
from core.util import serialize
from core.UIModule import UIModule
from model.user import User
from core.database import db



successJson = {"returnCode": "000000"}

class FeedHandler(tornado.web.RequestHandler):
    
    def __init__(self, application, request, **kwargs):
        super(FeedHandler, self).__init__(application, request, **kwargs)

    def write_error(self, status_code, **kwargs):
        super().render("error/error_default.html")

    @property
    def session(self):
        if hasattr(self, "_session"):
            return self._session
        
        sessionid = self.get_secure_cookie('sid')
        if sessionid:
            sessionid = sessionid.decode("utf-8")
        self._session = Session(self.application.session_store, sessionid)
        return self._session

    def get_current_user(self):
        return self.session['user'] if self.session and 'user' in self.session else None
    
    def rawRender(self, templateName, **kwargs):
        super().render(templateName, **kwargs)

class BaseHandler(tornado.web.RequestHandler):
    
    def __init__(self, application, request, **kwargs):
        super(BaseHandler, self).__init__(application, request, **kwargs)
        self._active_modules = {
            'uimodle' : UIModule(self),
        }

    def write_error(self, status_code, **kwargs):
        super().render("error/error_default.html")

    @property
    def session(self):
        if hasattr(self, "_session"):
            return self._session
        
        sessionid = self.get_secure_cookie('sid')
        if sessionid:
            sessionid = sessionid.decode("utf-8")
        self._session = Session(self.application.session_store, sessionid)
        return self._session

    def get_current_user(self):
        return self.session['user'] if self.session and 'user' in self.session else None
    
    def rawRender(self, templateName, **kwargs):
        super().render(templateName, **kwargs)

    def render(self, template_name, **kwargs):
        """Renders the template with the given arguments as the response."""
        currentUser = self.current_user
        from_workspace_str = self.get_argument("from_workspace", default="0", strip=False)
        from_workspace = from_workspace_str == "1"
        html = self.render_string(template_name, currentUser=currentUser, from_workspace = from_workspace, **kwargs)
        if from_workspace :
            scriptName = self.__class__.__name__

            if scriptName.endswith('Handler') :
                scriptName = scriptName[:-7] 

            path = self.static_url('scripts/' + scriptName + '.js')

            js = '<script src="' + escape.xhtml_escape(path) + '" type="text/javascript"></script>'
            html = html + utf8(js)
            self.finish(html)
            return

        # Insert the additional JS and CSS added by the modules on the page
        js_embed = []
        js_files = []
        css_embed = []
        css_files = []
        html_heads = []
        html_bodies = []
        for module in getattr(self, "_active_modules", {}).values():
            embed_part = module.embedded_javascript()
            if embed_part:
                js_embed.append(utf8(embed_part))
            file_part = module.javascript_files()
            if file_part:
                if isinstance(file_part, (unicode_type, bytes_type)):
                    js_files.append(file_part)
                else:
                    js_files.extend(file_part)
            embed_part = module.embedded_css()
            if embed_part:
                css_embed.append(utf8(embed_part))
            file_part = module.css_files()
            if file_part:
                if isinstance(file_part, (unicode_type, bytes_type)):
                    css_files.append(file_part)
                else:
                    css_files.extend(file_part)
            head_part = module.html_head()
            if head_part:
                html_heads.append(utf8(head_part))
            body_part = module.html_body()
            if body_part:
                html_bodies.append(utf8(body_part))

        def is_absolute(path):
            return any(path.startswith(x) for x in ["/", "http:", "https:"])
        if js_files:
            # Maintain order of JavaScript files given by modules
            paths = []
            unique_paths = set()
            for path in js_files:
                if not is_absolute(path):
                    path = self.static_url(path)
                if path not in unique_paths:
                    paths.append(path)
                    unique_paths.add(path)
            js = ''.join('<script src="' + escape.xhtml_escape(p) +
                         '" type="text/javascript"></script>'
                         for p in paths)
            sloc = html.rindex(b'</body>')
            html = html[:sloc] + utf8(js) + b'\n' + html[sloc:]
        if js_embed:
            js = b'<script type="text/javascript">\n//<![CDATA[\n' + \
                b'\n'.join(js_embed) + b'\n//]]>\n</script>'
            sloc = html.rindex(b'</body>')
            html = html[:sloc] + js + b'\n' + html[sloc:]
        if css_files:
            paths = []
            unique_paths = set()
            for path in css_files:
                if not is_absolute(path):
                    path = self.static_url(path)
                if path not in unique_paths:
                    paths.append(path)
                    unique_paths.add(path)
            css = ''.join('<link href="' + escape.xhtml_escape(p) + '" '
                          'type="text/css" rel="stylesheet"/>'
                          for p in paths)
            hloc = html.index(b'</head>')
            html = html[:hloc] + utf8(css) + b'\n' + html[hloc:]
        if css_embed:
            css = b'<style type="text/css">\n' + b'\n'.join(css_embed) + \
                b'\n</style>'
            hloc = html.index(b'</head>')
            html = html[:hloc] + css + b'\n' + html[hloc:]
        if html_heads:
            hloc = html.index(b'</head>')
            html = html[:hloc] + b''.join(html_heads) + b'\n' + html[hloc:]
        if html_bodies:
            hloc = html.index(b'</body>')
            html = html[:hloc] + b''.join(html_bodies) + b'\n' + html[hloc:]
        self.finish(html)

    
    def writeSuccessResult(self, model=None, **kwargs):
        result = None
        if model is not None:
            if isinstance(model, list):
                result = {"content": [serialize(item) for item in model]}
            else:
                result = serialize(model)
        else:
            result = {}
        result.update(successJson)
        for key in kwargs:
            item = kwargs[key]
            if item is not None:
                if isinstance(item, db.Model):
                    result.update({key : serialize(item)})
                elif isinstance(item, list):
                    result.update({key: [serialize(element) for element in item]})
                else:
                    result.update({key : item})
        self.write(json_encode(result))
    
    def writeFailedResult(self):
        self.write(json_encode({"returnCode": "999999", "errorMessage": self._error_message}))

