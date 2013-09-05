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
from core.BaseHandler import BaseHandler 
from sqlalchemy import or_, and_
from sqlalchemy.orm import aliased
from forms import Form, TextField, ListField, IntField, DateField, TimeField
from datetime import datetime
from core.database import db

class CalendarFeedPortalHandler(BaseHandler):

    def get(self, teamId):
        team = Team.query.filter_by(id=teamId).first()

        self.render("feed/calendarfeedportal.html", team = team, teamId = teamId)

class CalendarFeedHandler(BaseHandler):

    def get(self, teamId):
        userId = 20

        team = Team.query.filter_by(id=teamId).first()

        todoItems = TodoItem.query.filter(TodoItem.team_id==teamId, TodoItem.worker_id == userId).all() 
        
        project_events = Event.query.join(Event.project).\
                join(Project.users).\
                filter(User.id == userId, Project.team_id == teamId).all()

        calendar_events = Event.query.join(Event.calendar).\
                join(Project.users).\
                filter(User.id == userId, Calendar.team_id == teamId).all()

        self.render("feed/calendarfeed.html", team = team, todoItems = todoItems, 
            project_events = project_events , calendar_events = calendar_events )

