'''
Created on Feb 4, 2013

@author: GoldRatio
'''
from core.database import db
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Table, Date, Time
from sqlalchemy.orm import relationship


__all__ = ['Calendar'] 

calendar_user_rel = Table('calendar_user_rel', db.Model.metadata,
    Column('calendar_id', Integer, ForeignKey('calendar.id')),
    Column('user_id', Integer, ForeignKey('user.id'))
)

class Calendar(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(60))
    description = Column(String(60))
    color = Column(String(10))
    team_id = Column(Integer, ForeignKey('team.id'))
    own_id = Column(Integer, ForeignKey('user.id'))    
    createTime = Column(DateTime)

    users = relationship("User", secondary=calendar_user_rel, backref="calendars")

class Event(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(60))
    description = Column(String(60))
    startTime = Column(Time)
    startDate = Column(Date)
    endDate = Column(Date)

    team_id = Column(Integer, ForeignKey('team.id'))
    own_id = Column(Integer, ForeignKey('user.id'))    
    calendar_id = Column(Integer, ForeignKey('calendar.id'))
    project_id = Column(Integer, ForeignKey('project.id'))
    createTime = Column(DateTime)

    project = relationship("Project", backref="events")
    calendar = relationship("Calendar", backref="events")

