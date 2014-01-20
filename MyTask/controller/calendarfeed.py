'''
Created on Feb 4, 2013

@author: GoldRatio
'''
from model.mycalendar import Calendar, Event
from model.operation import Operation
from model.project import Project 
from model.todo import TodoList, TodoItem
from model.user import Team, User
import logging
import tornado
from tornado.options import options
from core.BaseHandler import FeedHandler, BaseHandler
from sqlalchemy import or_, and_
from sqlalchemy.orm import aliased
from forms import Form, TextField, ListField, IntField, DateField, TimeField, validators
from datetime import datetime
from core.database import db
from core.ui_methods import generateToken


class TokenForm(Form):
    token = TextField('token', [validators.required()])
    userId = TextField('userId', [validators.required()])
    
class CalendarFeedPortalHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, teamId):
        currentUser = self.current_user
        user = User.query.filter_by(id=currentUser.id).first()
        team = Team.query.filter_by(id=teamId).first()
        projects = Project.query.join(Project.users).filter(User.id==currentUser.id, Project.team_id==teamId).all()
        calendars = Calendar.query.join(Calendar.users).filter(User.id==currentUser.id, Calendar.team_id==teamId).all()

        self.render("feed/calendarfeedportal.html", projects= projects, calendars= calendars , team = team, teamId = teamId, user = user)

class CalendarFeedHandler(FeedHandler):

    def get(self, teamId):
        form = TokenForm(self.request.arguments, locale_code=self.locale.code)
        if form.validate():
            user = User.query.filter_by(id=form.userId.data).first()
            token = generateToken(None, 'all', user)
            if token == form.token.data :
                team = Team.query.filter_by(id=teamId).first()
        
                todoItems = TodoItem.query.filter(TodoItem.team_id==teamId, TodoItem.worker_id == user.id).all() 
                
                project_events = Event.query.join(Event.project).\
                        join(Project.users).\
                        filter(User.id == user.id, Project.team_id == teamId).all()
        
                calendar_events = Event.query.join(Event.calendar).\
                        join(Project.users).\
                        filter(User.id == user.id, Calendar.team_id == teamId).all()
        
                self.render("feed/calendarfeed.html", team = team, todoItems = todoItems, 
                    project_events = project_events , calendar_events = calendar_events )
                
                
class CalendarItemFeedHandler(FeedHandler):

    def get(self, teamId, targetId):
        form = TokenForm(self.request.arguments, locale_code=self.locale.code)
        if form.validate():
            user = User.query.filter_by(id=form.userId.data).first()
            
            if targetId[0] == 'c' :
                calendarId = targetId[1:]
                calendar = Calendar.query.filter_by(id = calendarId).first()
                if calendar:
                    token = generateToken(None,calendar.title, user)
                    if token and token == form.token.data :
                        self.render("feed/calendareventfeed.html", calendar = calendar )
            else:
                projectId = targetId[1:]
                project = Project.query.filter_by(id=projectId).first()
                if project:
                    token = generateToken(None,project.title, user)
                    if token and token == form.token.data :
                        self.render("feed/projecteventfeed.html", project = project )
                

