import tornado.web
from core.session import Session

from core.escape import json_encode
from core.util import serialize
from model.user import User
from core.database import db


successJson = {"returnCode": "000000"}

class BaseHandler(tornado.web.RequestHandler):
    
    def __init__(self, application, request, **kwargs):
        super(BaseHandler, self).__init__(application, request, **kwargs)

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

    def render(self, templateName, **kwargs):
        currentUser = self.current_user
        super().render(templateName, currentUser=currentUser, **kwargs)
    
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

