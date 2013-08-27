'''
Created on Feb 4, 2013

@author: GoldRatio
'''
from core.database import db
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from model.operation import Operation


__all__ = ['Project'] 

project_user_rel = Table('project_user_rel', db.Model.metadata,
    Column('project_id', Integer, ForeignKey('project.id')),
    Column('user_id', Integer, ForeignKey('user.id'))
)

class Project(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(60))
    description = Column(String(60))
    own_id = Column(Integer, ForeignKey('user.id'))    
    team_id = Column(Integer, ForeignKey('team.id'))
    createTime = Column(DateTime)
    repositoryName = Column(String(180))
    discussionNum = Column(Integer, default=0)
    todoNum = Column(Integer, default=0)
    fileNum = Column(Integer, default=0)
    documentNum = Column(Integer, default=0)
    repository = Column(Integer, default=0)
    color = Column(String(10))

    users = relationship("User", secondary=project_user_rel, backref="projects")
    todoItems = relationship("TodoItem", backref="project")
    operations = relationship("Operation", backref="project")
    messages = relationship("Message", backref="project")

    todolists = relationship("TodoList", backref="project")


    @property
    def recentlyOperation(self):
        operations = Operation.query.filter_by(project_id= self.id).order_by(Operation.createTime.desc()).limit(3).all()
        return operations 
