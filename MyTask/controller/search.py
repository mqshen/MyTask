'''
Created on Feb 4, 2013

@author: GoldRatio
'''

from tornado.options import options
from forms import Form, TextField, ListField, IntField, BooleanField
from core.BaseHandler import BaseHandler 
import pysolr
import tornado

class AutoCompleteForm(Form):
    token = TextField('token')

class AutoCompleteHandler(BaseHandler):
    _error_message = "项目已存在"
    @tornado.web.authenticated
    def get(self):
        form = AutoCompleteForm(self.request.arguments, locale_code=self.locale.code)
        solr = pysolr.Solr(options.solr_url, timeout=10)
        token = form.token.data
        response = solr.search('title:%s'%token, **{
            'fl':'id, title, type',
            'hl': 'true'
        })
        
        self.writeSuccessResult(documents= response.docs, highlighting= response.highlighting, token=token)

