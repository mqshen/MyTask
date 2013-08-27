'''
Created on Feb 4, 2013

@author: GoldRatio
'''
from core.database import db
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Table, Text
from sqlalchemy.orm import relationship


__all__ = ['Message', 'Comment']

attachment_message_rel = Table('attachment_message_rel', db.Model.metadata,
    Column('attachment_id', Integer, ForeignKey('attachment.id')),
    Column('message_id', Integer, ForeignKey('message.id'))
)

class Message(db.Model):
    eagerRelation = ['attachments']
    id = Column(Integer, primary_key=True)
    title = Column(String(60))
    content = Column(Text)
    own_id = Column(Integer, ForeignKey('user.id'))
    project_id = Column(Integer, ForeignKey('project.id'))
    team_id = Column(Integer, ForeignKey('team.id'))
    createTime = Column(DateTime)

    comment_num = Column(Integer, default=0)
    comment_digest = Column(String(300))
    attachments = relationship("Attachment", secondary=attachment_message_rel , backref="message")
    comments = relationship("Comment", backref="message")


attachment_comment_rel = Table('attachment_comment_rel', db.Model.metadata,
    Column('attachment_id', Integer, ForeignKey('attachment.id')),
    Column('comment_id', Integer, ForeignKey('comment.id'))
)

class Comment(db.Model):
    eagerRelation = ['attachments', 'own']
    id = Column(Integer, primary_key=True)
    content = Column(Text)
    own_id = Column(Integer, ForeignKey('user.id'))
    project_id = Column(Integer, ForeignKey('project.id'))
    message_id = Column(Integer, ForeignKey('message.id'))
    team_id = Column(Integer, ForeignKey('team.id'))
    createTime = Column(DateTime)

    attachments = relationship("Attachment", secondary=attachment_comment_rel , backref="comment")
