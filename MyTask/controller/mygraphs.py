from model.mycalendar import Calendar, Event
from model.operation import Operation
from model.project import Project 
from model.mygraphs import ProjectData, ProjectWeekData, TodoData, ProjectUserData
from model.todo import TodoList, TodoItem
from model.user import Team, User
import logging
import tornado
import core.web 
from tornado.options import options
from core.BaseHandler import BaseHandler 
from datetime import datetime
from core.database import db
import json

class ProjectGraphsHandler(BaseHandler):
    @tornado.web.authenticated
    @core.web.authenticatedProject
    def get(self, teamId, projectId):
        project = Project.query.filter_by(id=projectId).first()
        self.render("graphs/project.html", teamId = teamId, project = project)


class ProjectDataHandler(BaseHandler):
    @tornado.web.authenticated
    @core.web.authenticatedProject
    def get(self, teamId, projectId, dataType):
        if dataType == 'messagedata':
            projectData = ProjectData.query.filter(ProjectData.project_id == projectId).all()
        elif dataType == 'messageuserdata':
            projectData = ProjectUserData.query.filter_by(project_id = projectId).order_by(ProjectUserData.user_id).all()
        elif dataType == 'messageweekdata':
            projectData = ProjectWeekData.query.filter(ProjectData.project_id == projectId).all()
        elif dataType == 'tododata':
            projectData = TodoData.query.filter_by(project_id = projectId, done = 0).all()
        else:
            projectData = TodoData.query.filter_by(project_id = projectId, done = 1).all()

        self.writeSuccessResult(projectData = projectData )
