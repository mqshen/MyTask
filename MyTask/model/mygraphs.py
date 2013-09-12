'''
Created on Feb 4, 2013

@author: GoldRatio
'''
from core.database import db
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Table, Date
from sqlalchemy.orm import relationship
from model.operation import Operation


__all__ = ['MessageData'] 

class ProjectData(db.Model):
    __tablename__ = 'message_data'
    project_id = Column(Integer, primary_key=True)
    add_date = Column(Date, primary_key=True)
    total_number = Column(Integer)

class ProjectUserData(db.Model):
    eagerRelation = ['own']
    __tablename__ = 'message_user_data'
    project_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True) 
    add_date = Column(Date, primary_key=True)
    total_number = Column(Integer)

class ProjectWeekData(db.Model):
    __tablename__ = 'message_week_data'
    project_id = Column(Integer, primary_key=True)
    add_weekday = Column(Integer, primary_key=True)
    total_number = Column(Integer)


class TodoData(db.Model):
    __tablename__ = 'todo_data'
    project_id = Column(Integer, primary_key=True)
    add_date = Column(Date, primary_key=True)
    total_number = Column(Integer)

class TodoUserData(db.Model):
    eagerRelation = ['own']
    __tablename__ = 'todo_user_data'
    project_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True) 
    add_date = Column(Date, primary_key=True)
    total_number = Column(Integer)
