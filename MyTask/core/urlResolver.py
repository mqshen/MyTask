'''
Created on Feb 4, 2013

@author: GoldRatio
'''
from tornado.options import options
from importlib import import_module
import os

class urlResolver(object):
    def __init__(self):
        self.handlers = []
        
    def import_handlers(self, urls_file):
        urlconf_module = import_module(urls_file)
        urlhandlers = getattr(urlconf_module, "handlers", urlconf_module)
        self.handlers.extend(urlhandlers)
                
        
    def resolverUrls(self):
        '''
            method for resolve the projects urls
        '''
        current_dir = os.path.dirname(__file__)
        install_apps = options.install_apps
        for app in install_apps:
            appUrlFile = os.path.join(current_dir, '../', app, 'urls.py') 
            if  os.path.isfile(appUrlFile):
                self.import_handlers('%s.urls'%app )
        return self.handlers
                
        
    
