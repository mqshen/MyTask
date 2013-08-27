'''
Created on Feb 4, 2013

@author: GoldRatio
'''
import logging
from core.session import Session
import tornado.websocket
from core.util import serialize
from core.escape import json_encode

def send_message(userId, teamId, modelType, operationType, model):
    '''
        modelType: 
        operationType: 
    '''
    '''
    for handler in [ handler for handler in UpdatesHandler.waiters.get(teamId) if handler.current_user.id != userId] :
        try:
            result = None
            if model is not None:
                if isinstance(model, list):
                    result = {"content": [serialize(item) for item in model]}
                else:
                    result = serialize(model)
                result.update({"modelType": modelType, "operationType": operationType})
                handler.write_message(json_encode(result))
        except:
            logging.error('Error sending message', exc_info=True)
    '''
    logging.info('this is a info message')

class UpdatesHandler(tornado.websocket.WebSocketHandler):
    waiters = {}
    cache = []
    cache_size = 200

    @property
    def session(self):
        sessionid = self.get_secure_cookie('sid')
        return Session(self.application.session_store, sessionid)
    
    def get_current_user(self):
        return self.session['user'] if self.session and 'user' in self.session else None

    def allow_draft76(self):
        # for iOS 5.0 Safari
        return True

    def open(self):
        currentUser = self.current_user
        if currentUser:
            teamId = currentUser.teamId 
            if teamId in UpdatesHandler.waiters:
                handlerArray = UpdatesHandler.waiters.get(teamId)
                handlerArray.add(self)
            else:
                handlerArray = set()
                handlerArray.add(self)
                UpdatesHandler.waiters.update({teamId: handlerArray})

    def on_close(self):
        currentUser = self.current_user
        if currentUser:
            teamId = currentUser.teamId 
            if teamId in UpdatesHandler.waiters:
                handlerArray = UpdatesHandler.waiters.get(teamId)
                handlerArray.remove(self)


    @classmethod
    def update_cache(cls, chat):
        cls.cache.append(chat)
        if len(cls.cache) > cls.cache_size:
            cls.cache = cls.cache[-cls.cache_size:]

    @classmethod
    def send_updates(cls, chat):
        logging.info("sending message to %d waiters", len(cls.waiters))
        for waiter in cls.waiters:
            try:
                waiter.write_message(chat)
            except:
                logging.error("Error sending message", exc_info=True)

    def on_message(self, message):
        logging.info("got message %r", message)
        parsed = tornado.escape.json_decode(message)
        chat = {
            "id": str(uuid.uuid4()),
            "body": parsed["body"],
            }
        chat["html"] = tornado.escape.to_basestring(
            self.render_string("message.html", message=chat))

        UpdatesHandler.update_cache(chat)
        UpdatesHandler.send_updates(chat)


handlers = [
    ('/updates', UpdatesHandler),
]
