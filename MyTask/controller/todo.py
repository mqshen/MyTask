'''
Created on Feb 4, 2013

@author: GoldRatio
'''
from model.user import User
from model.todo import TodoList, TodoItem, TodoComment, TodoListComment
from model.operation import Operation
from model.attachment import Attachment
from model.project import Project
import logging
import tornado
from tornado.options import options
from tornado.web import RequestHandler
from core.BaseHandler import BaseHandler 
from forms import Form, TextField, ListField, IntField, DateTimeField, DateField
from datetime import datetime
from core.database import db
from websocket.urls import send_message


class CommentForm(Form):
    content = TextField('content')
    attachment = ListField('attachment')
    attachmentDel = ListField('attachmentDel')

class TodoItemForm(Form):
    description = TextField('description')
    workerId = IntField('workerId')
    deadLine = DateField("deadLine")

class TodoListForm(Form):
    title = TextField('title')

class TodoListHandler(BaseHandler):
    _error_message = "email or password incorrect!"

    @tornado.web.authenticated
    def get(self, teamId, projectId):
        project = Project.query.filter_by(id=projectId).first()
        self.render("todo/todolists.html", project= project, teamId = teamId)

    @tornado.web.authenticated
    def post(self, teamId, projectId):
        form = TodoListForm(self.request.arguments, locale_code=self.locale.code)
        if form.validate():
            currentUser = self.current_user
            now = datetime.now()
            todoList = TodoList(title=form.title.data, 
                own_id=currentUser.id, project_id= projectId, team_id=teamId, createTime= now)
            try:
                db.session.add(todoList)

                db.session.flush()

                digest = self.render_string("logs/todolist.html", teamId = teamId, operation = 0, project_id = projectId, todolist = todoList)
                operation = Operation(own_id = currentUser.id, createTime= now, target_type=3,
                    target_id=todoList.id, title= todoList.title, team_id= teamId, project_id= projectId, digest = digest)
                db.session.add(operation)

                db.session.commit()

            except:
                db.session.rollback()
                raise
            self.writeSuccessResult(todoList)

class TodoListDetailHandler(BaseHandler):
    _error_message = "email or password incorrect!"

    @tornado.web.authenticated
    def get(self, teamId, projectId, todolistId):
        project = Project.query.filter_by(id=projectId).first()
        todolist = TodoList.query.filter_by(id=todolistId).first()
        self.render("todo/todolist.html", todolist= todolist, project= project, teamId = teamId)

    @tornado.web.authenticated
    def post(self, teamId,  projectId, todoListId):
        form = TodoListForm(self.request.arguments, locale_code=self.locale.code)
        if form.validate():
            currentUser = self.current_user
            todoList = TodoList.query.filter_by(id=todoListId).first()
            if todoList is not None:
                todoList.title = form.title.data
                try:
                    db.session.add(todoList)
                    db.session.commit()
                except:
                    db.session.rollback()
                    raise
                self.writeSuccessResult(todoList)

class TodoListCommentHandler(BaseHandler):
    _error_message = "email or password incorrect!"

    @tornado.web.authenticated
    def post(self, teamId, projectId, todolistId):
        form = CommentForm(self.request.arguments, locale_code=self.locale.code)
        if form.validate():
            currentUser = self.current_user
            now = datetime.now()
            todolist = TodoList.query.filter_by(id=todolistId).first()
            todoComment = TodoListComment(content=form.content.data, todolist_id=todolistId,
                own_id=currentUser.id, project_id= projectId, team_id=teamId, createTime= now, attachments=[])
            todCommentId = todoComment.id


            for attachment in form.attachment.data:
                attachment = Attachment.query.filter_by(url=attachment).first()
                if attachment is not None:
                    attachment.project_id = projectId
                    attachment.team_id = teamId
                    todoComment.attachments.append(attachment)

            try:
                db.session.add(todoComment)
                db.session.flush()

                digest = self.render_string("logs/todolistcomment.html", teamId = teamId, operation = 2, project_id = projectId, todolist = todolist, todoComment = todoComment)

                operation = Operation(own_id = currentUser.id, createTime= now, target_type=1,
                    target_id=todolistId, title= "", digest= digest, team_id= teamId, project_id= projectId)

                db.session.add(operation)

                db.session.commit()
            except:
                db.session.rollback()
                raise
            send_message(currentUser.id, teamId, 2, 3, todoComment)

            self.writeSuccessResult(todoComment)

class TodoItemHandler(BaseHandler):
    _error_message = ""

    @tornado.web.authenticated
    def post(self, teamId, projectId, todoListId):
        form = TodoItemForm(self.request.arguments, locale_code=self.locale.code)
        if form.validate():
            currentUser = self.current_user
            now = datetime.now()
            todoItem = TodoItem(description=form.description.data, 
                own_id=currentUser.id, todolist_id= todoListId, project_id= projectId, worker_id= form.workerId.data,
                deadline= form.deadLine.data, team_id=teamId, createTime= now)
            db.session.add(todoItem)
            db.session.flush()

            digest = self.render_string("logs/todoitem.html", teamId = teamId, operation = 0, project_id = projectId, todoItem = todoItem , todolist_id = todoListId)
            operation = Operation(own_id = currentUser.id, createTime= now, target_type=4,
                target_id=todoItem.id, team_id= teamId, project_id= projectId, digest = digest )
            db.session.add(operation)

            project = Project.query.filter_by(id=projectId).with_lockmode("update").first()
            project.todoNum = project.todoNum + 1
            
            try:
                db.session.add(project)

                db.session.commit()
            except:
                db.session.rollback()
                raise
            worker = None
            if todoItem.worker_id is not None:
                worker = User.query.filter_by(id=todoItem.worker_id).first()
            self.writeSuccessResult(todoItem, worker=worker, teamId = teamId)

class TodoItemDetailHandler(BaseHandler):
    _error_message = ""

    @tornado.web.authenticated
    def get(self, teamId, projectId, todoListId, todoItemId):
        project = Project.query.filter_by(id=projectId).first()
        todoItem = TodoItem.query.filter_by(id=todoItemId).first()
        self.render("todo/todoItem.html", project= project, todoItem= todoItem, todolist= todoItem.todolist, teamId= teamId)



    @tornado.web.authenticated
    def post(self, teamId,  projectId, todoListId, todoItemId):
        form = TodoItemForm(self.request.arguments, locale_code=self.locale.code)
        if form.validate():
            currentUser = self.current_user
            teamId = currentUser.teamId
            todoItem = TodoItem.query.filter_by(id=todoItemId).first()
            if todoItem is not None:
                todoItem.worker_id = form.workerId.data
                if todoItem.worker_id is not None:
                    worker = User.query.filter_by(id=todoItem.worker_id).first()
                else:
                    worker = None
                todoItem.deadline = form.deadLine.data
                if len(form.description.data) > 0 :
                    todoItem.description = form.description.data
                now = datetime.now()
                try:
                    db.session.add(todoItem)

                    digest = self.render_string("logs/todoitemassign.html", teamId = teamId, operation = 12, 
                            project_id = projectId, todolist_id = todoListId, todoItem = todoItem, worker = worker)

                    operation = Operation(own_id = currentUser.id, createTime= now, target_type=4,
                        target_id=todoItemId, digest= digest, team_id= teamId, project_id= projectId )

                    db.session.add(operation)

                    db.session.commit()
                except:
                    db.session.rollback()
                    raise
                self.writeSuccessResult(todoItem, worker=worker)
        else:
            self.writeSuccessResult()

class TodoItemModifyHandler(BaseHandler):
    _error_message = ""

    @tornado.web.authenticated
    def post(self, teamId, projectId, todoListId, todoItemId, operation):
        todoItem = TodoItem.query.filter_by(id=todoItemId).first()
        currentUser = self.current_user
        now = datetime.now()
        if operation == "trash" :
            db.session.delete(todoItem)

            digest = self.render_string("logs/todoitem.html", teamId = teamId, operation = 3, project_id = projectId, todolist_id = todoListId, todoItem = todoItem)
            myOperation = Operation(own_id = currentUser.id, createTime= now, operation_type=3, target_type=4,
                target_id=todoItem.id, title= todoItem.description, team_id= teamId, project_id= projectId, digest = digest)
            try:
                db.session.add(myOperation)
                db.session.commit()
            except:
                db.session.rollback()
                raise
            self.writeSuccessResult()
            return

        elif operation == "undone" :
            digest = self.render_string("logs/todoitem.html", teamId = teamId, operation = 10, project_id = projectId, todolist_id = todoListId, todoItem = todoItem)
            myOperation = Operation(own_id = currentUser.id, createTime= now, operation_type=10, target_type=4,
                target_id=todoItem.id, title= todoItem.description, team_id= teamId, project_id= projectId, digest = digest)
            db.session.add(myOperation)
            todoItem.done = 0
            try:
                db.session.add(todoItem)
                db.session.commit()
            except:
                db.session.rollback()
                raise

            self.writeSuccessResult(todoItem)
            return
        elif operation == "done" :
            digest = self.render_string("logs/todoitem.html", teamId = teamId, operation = 9, project_id = projectId, todolist_id = todoListId, todoItem = todoItem)
            myOperation = Operation(own_id = currentUser.id, createTime= now, operation_type=9, target_type=4,
                target_id=todoItem.id, title= todoItem.description, team_id= teamId, project_id= projectId, digest = digest)
            db.session.add(myOperation)

            todoItem.worker_id = currentUser.id
            todoItem.deadline = now.date()
            todoItem.done = 1
            try:
                db.session.add(todoItem)
                db.session.commit()
            except:
                db.session.rollback()
                raise
            self.writeSuccessResult(todoItem)


class TodoItemCommentHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self, teamId, projectId, todolistId, todoitemId):
        form = CommentForm(self.request.arguments, locale_code=self.locale.code)
        if form.validate():
            currentUser = self.current_user
            now = datetime.now()
            todoItem = TodoItem.query.filter_by(id=todoitemId).first()
            todoComment = TodoComment(content=form.content.data, todoitem_id=todoitemId,
                own_id=currentUser.id, project_id= projectId, team_id=teamId, createTime= now, attachments=[])
            todCommentId = todoComment.id

            for attachment in form.attachment.data:
                attachment = Attachment.query.filter_by(url=attachment).first()
                if attachment is not None:
                    attachment.project_id = projectId
                    attachment.team_id = teamId
                    todoComment.attachments.append(attachment)

            try:
                db.session.add(todoComment)
                db.session.flush()

                digest = self.render_string("logs/todoitemcomment.html", teamId = teamId, operation = 2, project_id = projectId, todolist_id = todolistId, todoComment = todoComment, todoItem = todoItem)
                operation = Operation(own_id = currentUser.id, createTime= now, operation_type=2, target_type=1,
                    target_id=todoitemId, digest= digest, team_id= teamId, project_id= projectId )

                db.session.add(operation)

                db.session.commit()
            except:
                db.session.rollback()
                raise
            send_message(currentUser.id, teamId, 2, 4, todoComment)

            self.writeSuccessResult(todoComment)

class TodoListModifyHandler(BaseHandler):
    _error_message = ""

    @tornado.web.authenticated
    def post(self, teamId, projectId, todoListId ):
        todoList = TodoList.query.filter_by(id=todoListId).first()
        currentUser = self.current_user
        now = datetime.now()
        try:
            db.session.delete(todoList)

            url = '/%s/project/todolist/%s'%(teamId, todoListId )
            myOperation = Operation(own_id = currentUser.id, createTime= now, operation_type=2, target_type=4,
                target_id=todoList.id, title= todoList.description, team_id= teamId, project_id= projectId, url= url)
            db.session.add(myOperation)
            db.session.commit()
        except:
            db.session.rollback()
            raise
        self.writeSuccessResult()

        
