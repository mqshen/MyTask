'''
Created on Feb 4, 2013

@author: GoldRatio
'''
from model.operation import Operation 
import logging
import tornado
from tornado.options import options
from tornado.web import RequestHandler
import hashlib
from core.BaseHandler import BaseHandler 
from forms import Form, TextField, IntField
from core.database import db
from sqlalchemy.orm import eagerload

class PageForm(Form):
    begin = IntField("begin")

class OperationHandler(BaseHandler):
    PAGE_SIZE = 20
    _error_message = "email or password incorrect!"
    @tornado.web.authenticated
    def get(self):
        self.render("operation/operation.html")

    @tornado.web.authenticated
    def post(self):
        currentUser = self.current_user
        teamId = currentUser.teamId
        form = PageForm(self.request.arguments, locale_code=self.locale.code)
        operations = Operation.query.options(eagerload('own')).filter_by(team_id= teamId).order_by(Operation.createTime.desc()).limit(self.PAGE_SIZE).offset(form.begin.data * self.PAGE_SIZE).all()

        self.writeSuccessResult(operations)

