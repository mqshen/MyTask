'''
Created on Feb 4, 2013

@author: GoldRatio
'''
from model.operation import Operation 
from model.todo import TodoList, TodoItem, TodoComment, TodoListComment
from model.project import Project
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
    def get(self, teamId):
        self.render("operation/operation.html", teamId = teamId)

    @tornado.web.authenticated
    def post(self, teamId):
        currentUser = self.current_user
        form = PageForm(self.request.arguments, locale_code=self.locale.code)
        operations = Operation.query.options(eagerload('own')).filter_by(team_id= teamId).order_by(Operation.createTime.desc()).limit(self.PAGE_SIZE).offset(form.begin.data * self.PAGE_SIZE).all()

        self.writeSuccessResult(operations)

class TodoItemLogHandler(BaseHandler):
    
    @tornado.web.authenticated
    def get(self, teamId, projectId, todolistId, todoitemId):
        project = Project.query.filter_by(id=projectId).first()
        todolist = TodoList.query.filter_by(id=todolistId).first()
        todoItem = TodoItem.query.filter_by(id=todoitemId).first()
        operations = Operation.query.options(eagerload('own')).filter_by(team_id= teamId, target_type = 4, 
            target_id = todoitemId).order_by(Operation.createTime).all()
        self.render("operation/todoitem.html", teamId = teamId, todolist = todolist, project = project, todoItem = todoItem, operations = operations )
