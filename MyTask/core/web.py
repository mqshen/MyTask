'''
Created on May 12, 2013

@author: GoldRatio
'''
    
import functools
from tornado.web import HTTPError
from model.topic import Message
from model.todo import TodoList, TodoItem

def authenticatedTeam(method):
    """Decorate methods with this to require that the user be logged in.

    If the user is not logged in, they will be redirected to the configured
    `login url <RequestHandler.get_login_url>`.
    """
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        currentTeamId = int(args[0])
        teamIdArray = [team.id for team in self.current_user.teams]
        if currentTeamId not in teamIdArray:
            raise HTTPError(404)
        return method(self, *args, **kwargs)
    return wrapper

def authenticatedProject(method):
    """Decorate methods with this to require that the user be logged in.

    If the user is not logged in, they will be redirected to the configured
    `login url <RequestHandler.get_login_url>`.
    """
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        currentProjectId = int(args[1])
        if currentProjectId not in self.current_user.projects:
            raise HTTPError(404)
        return method(self, *args, **kwargs)
    return wrapper

def authenticatedMessage(method):
    """Decorate methods with this to require that the user be logged in.

    If the user is not logged in, they will be redirected to the configured
    `login url <RequestHandler.get_login_url>`.
    """
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        currentProjectId = int(args[0])
        if currentProjectId not in self.current_user.projects:
            raise HTTPError(404)
        
        currentMessageId = int(args[1])
        message = Message.query.filter_by(id= currentMessageId).first()
        if message.project_id != currentProjectId:
            raise HTTPError(404)
        
        return method(self, *args, **kwargs)
    return wrapper

def authenticatedTodoList(method):
    """Decorate methods with this to require that the user be logged in.

    If the user is not logged in, they will be redirected to the configured
    `login url <RequestHandler.get_login_url>`.
    """
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        currentProjectId = int(args[0])
        if currentProjectId not in self.current_user.projects:
            raise HTTPError(404)
        
        currentTodoListId = int(args[1])
        todoList = TodoList.query.filter_by(id= currentTodoListId).first()
        if todoList.project_id != currentProjectId:
            raise HTTPError(404)
        
        return method(self, *args, **kwargs)
    return wrapper

def authenticatedTodoItem(method):
    """Decorate methods with this to require that the user be logged in.

    If the user is not logged in, they will be redirected to the configured
    `login url <RequestHandler.get_login_url>`.
    """
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        currentProjectId = int(args[0])
        if currentProjectId not in self.current_user.projects:
            raise HTTPError(403)
        
        currentTodoItemId = int(args[2])
        todoItem = TodoItem.query.filter_by(id= currentTodoItemId).first()
        if todoItem.project_id != currentProjectId:
            raise HTTPError(404)
        return method(self, *args, **kwargs)
    return wrapper
