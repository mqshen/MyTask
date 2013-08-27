'''
Created on May 2, 2013

@author: GoldRatio
'''
from sqlalchemy.orm import class_mapper
from tornado.options import options
import json
from core.database import db

def serialize(model):
    """Transforms a model into a dictionary which can be dumped to JSON."""
    # first we get the names of all the columns on your model
    result = None
    if isinstance(model, db.Model):
        columns = [c.key for c in class_mapper(model.__class__).columns]
        result = dict((c, getattr(model, c)) for c in columns if c not in options.jsonFilter)
        if hasattr(model, 'eagerRelation'):
            for key in model.eagerRelation:
                value = getattr(model, key)
                if isinstance(value, list):
                    result.update({key: [serialize(item) for item in value]})
                elif isinstance(value, db.Model):
                    result.update({key: serialize(value)})
                else:
                    result.update({key: value})
    elif isinstance(model, list):
        result = []
        for item in model:
            result.append(serialize(item))
    elif model:
        result = json.dumps(model, default=lambda o: o.__dict__)
    # then we return their values in a dict
    
    return result

def getSequence(name):
    """get sequecne for mysql """
    db.session.execute("UPDATE counter SET value = LAST_INSERT_ID(value+1) WHERE name = :name", {"name": name})
    result = db.session.execute("SELECT LAST_INSERT_ID()").first()
    db.session.commit()
    return result[0]
