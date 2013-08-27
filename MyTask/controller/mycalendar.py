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
import json

class EventQueryForm(Form):
    start_date = TextField('start_date')
    end_date = TextField('end_date')

class CalendarForm(Form):
    id = TextField('id')
    title = TextField('title')
    color = TextField('color')
    member = ListField('member')

class EventForm(Form):
    id = TextField('id')
    title = TextField('title')
    startTime = TimeField('startTime')
    description = TextField('description')
    startDate = DateField('startDate')
    endDate = DateField('endDate')
    bucket = TextField('bucket')

class CalendarHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        currentUser = self.current_user
        teamId = currentUser.teamId 
        projects = Project.query.join(Project.users).filter(User.id==currentUser.id, Project.team_id==teamId).all()
        calendars = Calendar.query.join(Calendar.users).filter(User.id==currentUser.id, Calendar.team_id==teamId).all()
        team = Team.query.filter_by(id=teamId).first()
        self.render("calendar/calendar.html", projects= projects, calendars= calendars , team = team)

    @tornado.web.authenticated
    def post(self):
        currentUser = self.current_user
        teamId = currentUser.teamId 
        form = CalendarForm(self.request.arguments, locale_code=self.locale.code)
        if form.id.data :
            calendar = Calendar.query.filter_by(id=form.id.data).first()
            if calendar :
                calendar.color = form.color.data
                calendar.title = form.title.data
        else:
            calendar = Calendar.query.filter_by(title=form.title.data, team_id=teamId).first()
            if calendar:
                self.writeFailedResult()
                self.finish()
                return

            users = []

            user = User.query.filter_by(id=currentUser.id).first()
            users.append(user)

            for userId in form.member.data:
                users.append(User.query.filter_by(id=userId).first())

            now = datetime.now()
            calendar = Calendar(title=form.title.data, color=form.color.data, own_id=currentUser.id, team_id=teamId, createTime= now, users = users)
        db.session.add(calendar)

        db.session.commit()
        
        self.writeSuccessResult(calendar)


class CalendarEventHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        form = EventQueryForm(self.request.arguments, locale_code=self.locale.code)
        currentUser = self.current_user
        teamId = currentUser.teamId 
        todoItems = TodoItem.query.filter(TodoItem.team_id==teamId, TodoItem.worker_id == currentUser.id, 
            TodoItem.deadline >= form.start_date.data, TodoItem.deadline <= form.end_date.data).all()
        
        project_events = Event.query.join(Event.project).\
                join(Project.users).\
                filter(User.id == currentUser.id, Project.team_id == teamId,
                    or_(and_(Event.startDate >= form.start_date.data, Event.startDate <= form.end_date.data),
                        and_(Event.endDate >= form.start_date.data, Event.endDate <= form.end_date.data))
                ).all()
        print(project_events)
        calendar_events = Event.query.join(Event.calendar).\
                join(Project.users).\
                filter(User.id == currentUser.id, Calendar.team_id == teamId,
                    or_(and_(Event.startDate >= form.start_date.data, Event.startDate <= form.end_date.data),
                        and_(Event.endDate >= form.start_date.data, Event.endDate <= form.end_date.data))
                ).order_by(Event.startDate).all()

        '''
        all_events = []
        for project in projects:
            events = Event.query.filter(Event.project_id == project.id, 
                or_(and_(Event.startDate >= form.start_date.data, Event.startDate <= form.end_date.data),
                    and_(Event.endDate >= form.start_date.data, Event.endDate <= form.end_date.data))
                ).all()
            if events:
                all_events.append(events)

        for calendar in calendars:
            events = Event.query.filter(Event.calendar_id == calendar.id, 
                or_(and_(Event.startDate >= form.start_date.data, Event.startDate <= form.end_date.data),
                    and_(Event.endDate >= form.start_date.data, Event.endDate <= form.end_date.data))
                ).all()
            if events:
                all_events.append(events)
            '''

        self.writeSuccessResult(todoItems = todoItems ,calendar_events= calendar_events, project_events= project_events)

    @tornado.web.authenticated
    def post(self):
        form = EventForm(self.request.arguments, locale_code=self.locale.code)
        currentUser = self.current_user
        teamId = currentUser.teamId 
        now = datetime.now()

        if(form.bucket.data.startswith('Calendar:')):
            calendar_id = form.bucket.data[9:]
            project_id = None
        else:
            project_id = form.bucket.data[8:]
            calendar_id = None

        print(form.startTime.data)
        if form.id.data:
            event = Event.query.filter_by(id= form.id.data).first()
            if event:
                event.title = form.title.data
                event.description = form.description.data
                event.startTime = form.startTime.data
                event.startDate = form.startDate.data
                event.endDate = form.endDate.data
                event.project_id = project_id
                event.calendar_id = calendar_id
        else :
            event = Event(title=form.title.data, description=form.description.data, startTime=form.startTime.data, 
                startDate=form.startDate.data, endDate = form.endDate.data, project_id = project_id, calendar_id = calendar_id,
                own_id=currentUser.id, team_id=teamId, createTime= now)
        db.session.add(event)

        db.session.commit()
        
        self.writeSuccessResult(event)
