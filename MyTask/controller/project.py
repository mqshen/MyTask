'''
Created on Feb 4, 2013

@author: GoldRatio
'''
import os
from model.project import Project
from model.operation import Operation
from model.attachment import Attachment
from model.topic import Message 
from model.todo import TodoList
from model.user import Team, User
import logging
import tornado
from tornado.options import options
from core.BaseHandler import BaseHandler 
import core.web 
from forms import Form, TextField, ListField, IntField, BooleanField
from datetime import datetime
from core.database import db
import json
import pinyin


class ProjectForm(Form):
    name = TextField('name')
    description = TextField('description')
    member = ListField('member')

class ProjectAccessForm(Form):
    userId = IntField('userId')
    operation = TextField('operation')

class ProjectFilesForm(Form):
    attachment = ListField('attachment')

class ProjectHandler(BaseHandler):
    _error_message = "项目已存在"

    @tornado.web.authenticated
    def get(self, teamId):
        currentUser = self.current_user
        projects = Project.query.join(Project.users).filter(User.id==currentUser.id, Project.team_id==teamId).all()
        self.render("project/project.html", projects= projects, teamId = teamId)

    @tornado.web.authenticated
    def post(self, teamId):
        currentUser = self.current_user
        form = ProjectForm(self.request.arguments, locale_code=self.locale.code)
        
        project = Project.query.filter_by(title=form.name.data, team_id=teamId).first()
        if project :
            self.writeFailedResult()
            self.finish()
            return

        users = []

        user = User.query.filter_by(id=currentUser.id).first()
        users.append(user)

        for userId in form.member.data:
            users.append(User.query.filter_by(id=userId).first())

        now = datetime.now()
        project = Project(title=form.name.data, description=form.description.data, 
                own_id=currentUser.id, team_id=teamId, createTime= now, users = users)
        try:
            db.session.add(project)
            db.session.flush()
            needRepository = 0


            url = "/project/%d"%project.id
            operation = Operation(own_id = currentUser.id, createTime= now, operation_type=0, target_type=0, 
                    target_id=project.id, title= project.title, team_id= teamId, project_id= project.id, url= url)

            db.session.add(operation)


            db.session.commit()
        except:
            db.session.rollback()
            raise
        
        currentUser.projects.append(project.id)
        self.session["user"] = currentUser
        self.writeSuccessResult(project, successUrl='/%s'%teamId)


class NewProjectHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self, teamId):
        currentUser = self.current_user
        team = Team.query.filter_by(id=teamId).first()
        self.render("project/newProject.html", team= team, teamId = teamId)

    @tornado.web.authenticated
    def post(self):
        self.redirect("/")

class ProjectDetailHandler(BaseHandler):
    @tornado.web.authenticated
    @core.web.authenticatedProject
    def get(self, teamId, projectId):
        project = Project.query.filter_by(id=projectId).first()
        messages = Message.query.filter_by(project_id=projectId).order_by(Message.createTime).limit(5).all()
        todolists = TodoList.query.filter_by(project_id=projectId).all()
        from model.attachment import Attachment
        files = Attachment.query.filter_by(project_id=projectId).order_by(Attachment.createTime.desc()).limit(5).all()

        self.render("project/projectDetail.html", project= project, messages= messages, todolists= todolists, files= files, teamId=teamId)


class ProjectAccessHandler(BaseHandler):
    @tornado.web.authenticated
    @core.web.authenticatedProject
    def get(self, teamId, projectId):
        project = Project.query.filter_by(id=projectId).first()
        currentUser = self.current_user
        team = Team.query.filter_by(id=teamId).first()
        currentUser = self.current_user
        self.render("project/projectAccess.html", project= project, team= team, teamId = teamId)

    @tornado.web.authenticated
    @core.web.authenticatedProject
    def post(self, projectId):
        form = ProjectAccessForm(self.request.arguments, locale_code=self.locale.code)
        try:
            if(form.operation.data == "add"):
                db.session.execute("insert into project_user_rel values(:project_id, :user_id)", {"project_id":projectId, "user_id":form.userId.data})
            else:
                db.session.execute("delete from project_user_rel where project_id= :project_id and user_id = :user_id", 
                        {"project_id":projectId, "user_id":form.userId.data})

            db.session.commit()
        except:
            db.session.rollback()
            raise

        self.writeSuccessResult(successUrl='/')

class ProjectFilesHandler(BaseHandler):
    @tornado.web.authenticated
    @core.web.authenticatedProject
    def get(self, teamId, projectId):
        project = Project.query.filter_by(id=projectId).first()
        files = Attachment.query.filter_by(project_id=projectId).order_by(Attachment.createTime.desc()).all()
        self.render("files/files.html", project= project, files= files, teamId = teamId)

    @tornado.web.authenticated
    @core.web.authenticatedProject
    def post(self, teamId, projectId):
        form = ProjectFilesForm(self.request.arguments, locale_code=self.locale.code)
        project = Project.query.filter_by(id= projectId).with_lockmode("update").first()
        files = []
        fileNames = []
        try:
            for fileUrl in form.attachment.data:
                attachment = Attachment.query.filter_by(url = fileUrl).first()
                attachment.project_id = projectId
                files.append(attachment)
                fileNames.append(attachment.name)
                db.session.add(attachment)

            project.fileNum = project.fileNum + len(files)

            now = datetime.now()

            url = "/project/%s/files"%(project.id)
            title = ','.join(fileNames)
            title = title[:30]
            currentUser = self.current_user
            operation = Operation(own_id = currentUser.id, createTime= now, operation_type=11, target_type=6,
                target_id= project.id, title= title, team_id= teamId, project_id= project.id, url= url)
            db.session.add(operation)

            db.session.add(project)
            db.session.commit()
        except:
            db.session.rollback()
            raise

        self.writeSuccessResult(files= files)
        
class ColorForm(Form):
    color = TextField('color')

class ProjectColorHandler(BaseHandler):
    @tornado.web.authenticated
    @core.web.authenticatedProject
    def get(self, teamId, projectId):
        self.post(projectId)

    @tornado.web.authenticated
    @core.web.authenticatedProject
    def post(self, teamId, projectId):
        project = Project.query.filter_by(id=projectId).first()
        form = ColorForm(self.request.arguments, locale_code=self.locale.code)

        project.color = form.color.data

        try:
            db.session.add(project)
            db.session.commit()
        except:
            db.session.rollback()
            raise

        self.writeSuccessResult(project)
