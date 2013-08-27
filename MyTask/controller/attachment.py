'''
Created on Feb 4, 2013

@author: GoldRatio
'''
import os
from model.user import User
from model.attachment import Attachment
from model.project import Project
import logging
import tornado
from tornado.options import options
from tornado.web import RequestHandler
from core.BaseHandler import BaseHandler 
from forms import Form, TextField, FileField
from core.database import db
from uuid import uuid4
from tornado.options import options
import mimetypes
import email.utils
import stat
import datetime
import sys
import urllib
from PIL import Image
from io import BytesIO

def generateFileName():
    return uuid4().hex

class AttachmentForm(Form):
    attachment = FileField("attachment")

class AvatarHandler(BaseHandler):
    
    CACHE_MAX_AGE = 86400 * 365 * 10  # 10 years
    
    def get_cache_time(self, path, modified, mime_type):
        """Override to customize cache control behavior.

        Return a positive number of seconds to make the result
        cacheable for that amount of time or 0 to mark resource as
        cacheable for an unspecified amount of time (subject to
        browser heuristics).

        By default returns cache expiry of 10 years for resources requested
        with ``v`` argument.
        """
        return self.CACHE_MAX_AGE if "v" in self.request.arguments else 0
    
    def head(self, path):
        self.get(path, include_body=False)
    
    @tornado.web.authenticated
    def get(self, avatarUrl, include_body=True):
        attachmentPath = options.avatarPath
        filePath = '%s/%s'%(attachmentPath, avatarUrl)
        if os.path.exists(filePath):
            
            mime_type, encoding = mimetypes.guess_type(filePath)
            
            if mime_type is None:
                mime_type = "image/png"
            stat_result = os.stat(filePath)
            modified = datetime.datetime.utcfromtimestamp(stat_result[stat.ST_MTIME])
            
            if mime_type:
                self.set_header("Content-Type", mime_type)
                
            cache_time = self.get_cache_time(filePath, modified, mime_type)

            if cache_time > 0:
                self.set_header("Expires", datetime.datetime.utcnow() +
                                datetime.timedelta(seconds=cache_time))
                self.set_header("Cache-Control", "max-age=" + str(cache_time))
            
                
            ims_value = self.request.headers.get("If-Modified-Since")
            if ims_value is not None:
                date_tuple = email.utils.parsedate(ims_value)
                if_since = datetime.datetime(*date_tuple[:6])
                if if_since >= modified:
                    self.set_status(304)
                    return
            
            with open(filePath, "rb") as file:
                data = file.read()
                if include_body:
                    self.write(data)
                else:
                    assert self.request.method == "HEAD"
                    self.set_header("Content-Length", len(data))

    @tornado.web.authenticated
    def post(self):
        fileDescription = self.request.body
        if fileDescription is not None:
            currentUser = self.current_user
            teamId = currentUser.teamId

            contentType = self.request.headers.get("Content-Type")
            if contentType not in options.allowImageFileType:
                self.writeFailedResult()
                self.finish()
                return

            stream = BytesIO(fileDescription)
            image = Image.open(stream)
            
            maxSize = (100, 100)
            image.thumbnail(maxSize, Image.ANTIALIAS)
            # Turn back into file-like object

            fileName = generateFileName()
            attachmentPath = options.avatarPath
            if not os.path.exists(attachmentPath):
                os.mkdir(attachmentPath )
            filePath = '%s/%s'%(attachmentPath, fileName)
            image.save(filePath, 'PNG', optimize = True)
            
            user = User.query.filter_by(id=currentUser.id).first()
            user.avatar= fileName 
            db.session.add(user)
            db.session.commit()
            currentUser.avatar = user.avatar
            self.session["user"] = currentUser

            self.writeSuccessResult(user)
    
class AttachmentHandler(BaseHandler):
    _error_message = "email or password incorrect!"

    def get_cache_time(self, path, modified, mime_type):
        """Override to customize cache control behavior.

        Return a positive number of seconds to make the result
        cacheable for that amount of time or 0 to mark resource as
        cacheable for an unspecified amount of time (subject to
        browser heuristics).

        By default returns cache expiry of 10 years for resources requested
        with ``v`` argument.
        """
        return self.CACHE_MAX_AGE if "v" in self.request.arguments else 0
    
    def head(self, path):
        self.get(path, include_body=False)
    
    @tornado.web.authenticated
    def get(self, avatarUrl, include_body=True):
        url = avatarUrl
        if len(url) > 32 :
            url = url[:-6]
        attachment = Attachment.query.filter_by(url= url).first()
        attachmentPath = options.attachmentPath
        filePath = '%s/%s'%(attachmentPath, avatarUrl)
        if os.path.exists(filePath):
            
            mime_type = attachment.contentType 
            if mime_type is None:
                mime_type = "image/png"
            stat_result = os.stat(filePath)
            modified = datetime.datetime.utcfromtimestamp(stat_result[stat.ST_MTIME])
            
            if mime_type:
                self.set_header("Content-Type", mime_type)
                
            cache_time = self.get_cache_time(filePath, modified, mime_type)

            if cache_time > 0:
                self.set_header("Expires", datetime.datetime.utcnow() +
                                datetime.timedelta(seconds=cache_time))
                self.set_header("Cache-Control", "max-age=" + str(cache_time))
            
                
            ims_value = self.request.headers.get("If-Modified-Since")
            if ims_value is not None:
                date_tuple = email.utils.parsedate(ims_value)
                if_since = datetime.datetime(*date_tuple[:6])
                if if_since >= modified:
                    self.set_status(304)
                    return
            
            with open(filePath, "rb") as file:
                data = file.read()
                if include_body:
                    self.write(data)
                else:
                    assert self.request.method == "HEAD"
                    self.set_header("Content-Length", len(data))

    @tornado.web.authenticated
    def post(self):
        fileDescription = self.request.body
        if fileDescription is not None:
            currentUser = self.current_user
            teamId = currentUser.teamId

            contentType = self.request.headers.get("Content-Type")
            width = 0
            height = 0

            filename = self.request.headers.get("X_filename")
            if filename:
                filename = urllib.parse.unquote(filename)

            fileName = generateFileName()
            attachmentPath = options.attachmentPath
            filePath = '%s/%s'%(attachmentPath, fileName)

            print(contentType)

            if contentType in options.allowImageFileType:
                fileType = '0'
                stream = BytesIO(fileDescription)
                image = Image.open(stream)
                width, height = image.size
                maxSize = (260, 180)
                image.thumbnail(maxSize, Image.ANTIALIAS)
                image.save(filePath, 'PNG', optimize = True)
                filePath += 'origin'
            elif contentType in options.allowDocumentFileType.keys():
                fileType = '1'
            else:
                self.writeFailedResult()
                self.finish()
                return
            with open(filePath, 'wb') as out:
                out.write(fileDescription) 

            attachment = Attachment(url= fileName, name= filename, contentType= contentType, width= width, height= height,
                    fileType= fileType, own_id=currentUser.id, createTime=datetime.datetime.now())
            db.session.add(attachment)
            db.session.commit()

            self.writeSuccessResult(attachment)
