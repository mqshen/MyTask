'''
Created on Feb 4, 2013

@author: GoldRatio
'''
from core.database import db
from .project import Project
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Table, ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.associationproxy import association_proxy

__all__ = ['User', 'Team', 'InviteUser', 'InviteProject', 'UserObj', 'TeamUserRel']

'''
team_user_rel = Table('team_user_rel', db.Model.metadata,
    Column('team_id', Integer, ForeignKey('team.id')),
    Column('user_id', Integer, ForeignKey('user.id'))
)
'''

class Team(db.Model):
    '''relationship("User", secondary=team_user_rel, backref="teams")'''
    id = Column(Integer, primary_key=True)
    title = Column(String(30))
    createTime = Column(DateTime)

    members = association_proxy('team_user_rel', 'member')
    projects = relationship("Project", backref="team")
    invitedUser = relationship("InviteUser", primaryjoin="InviteUser.team_id == Team.id", backref="team")


class User(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(30))
    nickName = Column(String(30))
    email = Column(String(60), index=True)
    password = Column(String(60))
    description = Column(String(100))
    avatar = Column(String(60))

    teams = association_proxy('team_user_rel', 'team')

    ownedProjects = relationship("Project", backref="own")
    ownedMessages = relationship("Message", backref="own")
    ownedOperations = relationship("Operation", backref="own")
    ownedComments = relationship("Comment", backref="own")
    ownedTodoComments = relationship("TodoComment", backref="own")
    ownedTodoListComments = relationship("TodoListComment", backref="own")
    todoItems = relationship("TodoItem", primaryjoin="User.id == TodoItem.worker_id", backref="worker")
    ownedAttachment = relationship("Attachment", backref="own")
    ownedMessageData = relationship("ProjectUserData", backref="own")
    ownedTodoData = relationship("TodoUserData", backref="own")

class Cookie(db.Model):
    __tablename__ = 'user_cookie'
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    sid = Column(String(40))

    user = relationship("User", backref="cookie")


class TeamUserRel(db.Model):
    __tablename__ = 'team_user_rel'
    team_id = Column(Integer, ForeignKey('team.id'), primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    privilege = Column(Integer)

    member = relationship(User,
        backref=backref("team_user_rel",
            cascade="all, delete-orphan"))
    team = relationship(Team,
        backref=backref("team_user_rel",
            cascade="all, delete-orphan"))

class InviteUser(db.Model):
    id = Column(String(60), primary_key=True)
    email = Column(String(60))
    invite_id = Column(Integer)
    team_id = Column(Integer, ForeignKey('team.id'))
    privilege = Column(Integer)

class InviteProject(db.Model):
    invite_id = Column(Integer, primary_key=True)
    project_id = Column(Integer, primary_key=True)
    
class TeamObj(object):
    def __init__(self, team):
        self.id = team.id
        self.title = team.title

class UserObj(object):
    def __init__(self, user, teamId = None):
        self.id = user.id
        self.name = user.name
        self.nickName = user.nickName
        self.email = user.email
        self.description = user.description
        self.avatar = user.avatar
        self.teams = []
        for team in user.teams:
            self.teams.append(TeamObj(team))
        if teamId:
            self._teamId = teamId
            teamUserRel = TeamUserRel.query.filter_by(team_id= teamId, user_id=User.id).first()
            self._privilege = teamUserRel.privilege
            self._projects = [project.id for project in Project.query.join(Project.users).filter(User.id==user.id, Project.team_id==teamId).all()]

    @property
    def projects(self):
        return self._projects

    @property
    def privilege(self):
        return self._privilege
    
    @property
    def teamId(self):
        return self._teamId
    
    @teamId.setter
    def teamId(self, value):
        self._teamId = value
        teamUserRel = TeamUserRel.query.filter_by(team_id= value, user_id=User.id).first()
        self._privilege = teamUserRel.privilege
        self._projects = [project.id for project in Project.query.join(Project.users).filter(User.id==self.id, Project.team_id==value).all()]
        print(self._projects)
