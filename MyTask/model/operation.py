'''
Created on Feb 4, 2013

    operation_type = Column(Enum('创建', '发起', '回复', '删除', '编辑', '查询', '回复', '开始', '暂停', '完成', '取消完成', '上传'))
    target_type = Column(Enum('项目', '讨论', '评论', '任务列表', '任务', '用户', '文件'))
@author: GoldRatio
'''
from core.database import db
from sqlalchemy import Column, SmallInteger, BigInteger, String, DateTime, Boolean, Table, ForeignKey, Enum
from sqlalchemy.orm import relationship

__all__ = ['Operation']

class Operation(db.Model):
    eagerRelation = ["own", "project"]
    operation_type_array = ['创建', '发起', '回复', '删除', '编辑', '查询', '回复', '开始', '暂停', '完成', '取消完成', '上传']
    target_type_array = ['项目', '讨论', '评论', '任务列表', '任务', '用户', '文件']

    id = Column(BigInteger, primary_key=True)
    own_id = Column(BigInteger, ForeignKey('user.id'))
    createTime = Column(DateTime)
    operation_type = Column(SmallInteger)
    target_type = Column(SmallInteger)
    target_id = Column(BigInteger)
    title = Column(String(100))
    url = Column(String(100))
    digest = Column(String(200))
    team_id = Column(BigInteger)
    project_id = Column(BigInteger, ForeignKey('project.id'))

    @property
    def operation_type_name(self):
        return self.operation_type_array[self.operation_type]


    @property
    def target_type_name(self):
        return self.target_type_array[self.target_type]


