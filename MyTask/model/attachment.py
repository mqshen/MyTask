'''
Created on Feb 4, 2013

@author: GoldRatio
'''
from core.database import db
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from tornado.options import options


__all__ = ['Attachment']

class Attachment(db.Model):
    eagerRelation = ['own', "icon"]
    id = Column(Integer, primary_key=True)
    url = Column(String(60))
    name = Column(String(100))
    own_id = Column(Integer, ForeignKey('user.id'))
    project_id = Column(Integer, ForeignKey('project.id'))
    team_id = Column(Integer, ForeignKey('team.id'))
    width = Column(Integer)
    height = Column(Integer)
    fileType = Column(String(1))
    contentType = Column(String(30))
    createTime = Column(DateTime)

    @hybrid_property
    def icon(self):
        if self.fileType == 0:
            return options.allowDocumentFileType[self.contentType]
