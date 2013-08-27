import tornado.ioloop
import tornado.web
import os.path
import redis
from core.session import RedisSessionStore
from tornado.options import options
from core.quemail import QueMail

class Application(tornado.web.Application):
    def __init__(self, settings):
        from controller.attachment import AttachmentHandler, AvatarHandler
        from controller.search import AutoCompleteHandler
        from controller.mycalendar import  CalendarHandler, CalendarEventHandler
        from controller.operation import OperationHandler 
        from controller.project import ProjectHandler, ProjectFilesHandler, ProjectColorHandler, ProjectDetailHandler, \
                ProjectAccessHandler, NewProjectHandler
        from controller.todo import TodoListHandler, TodoListDetailHandler, TodoItemHandler, TodoItemDetailHandler, TodoItemModifyHandler, TodoItemCommentHandler
        from controller.topic import MessageHandler, MessageDetailHandler, NewMessageHandler, CommentHandler, CommentDetailHandler
        from controller.user import RegisterHandler, LoginHandler, SignOutHandler, TeamNewHandler, TeamHandler, SettingHandler, \
                PeopleHandler, NewPeopleHandler, PeopleDetailHandler, JoinHandler
        handlers = [
            ('/', ProjectHandler),
            ('/attachment', AttachmentHandler),
            ('/attachment/([0-9A-Za-z]+)', AttachmentHandler),
            ('/avatar', AvatarHandler),
            ('/avatar/([0-9A-Za-z]+)', AvatarHandler),
            ('/calendar', CalendarHandler),
            ('/event', CalendarEventHandler),
            ('/operation', OperationHandler),
            ('/project', ProjectHandler),
            ('/project/([0-9]+)/files', ProjectFilesHandler),
            ('/project/([0-9]+)/color', ProjectColorHandler),
            ('/project/([0-9]+)', ProjectDetailHandler),
            ('/project/([0-9]+)/access', ProjectAccessHandler),
            ('/project/new', NewProjectHandler),
            ('/project/([0-9]+)/todolist', TodoListHandler),
            ('/project/([0-9]+)/todolist/([0-9]+)', TodoListDetailHandler),
            ('/project/([0-9]+)/todolist/([0-9]+)/comment', TodoListDetailHandler),
            ('/project/([0-9]+)/todolist/([0-9]+)/todoitem', TodoItemHandler),
            ('/project/([0-9]+)/todolist/([0-9]+)/todoitem/([0-9]+)', TodoItemDetailHandler),
            ('/project/([0-9]+)/todolist/([0-9]+)/todoitem/([0-9]+)/(done|undone|trash)', TodoItemModifyHandler),
            ('/project/([0-9]+)/todolist/([0-9]+)/todoitem/([0-9]+)/comment', TodoItemCommentHandler),
            ('/project/([0-9]+)/message', MessageHandler),
            ('/project/([0-9]+)/message/([0-9]+)', MessageDetailHandler),
            ('/project/([0-9]+)/message/new', NewMessageHandler),
            ('/project/([0-9]+)/message/([0-9]+)/comment', CommentHandler),
            ('/project/([0-9]+)/message/([0-9]+)/comment/([0-9]+)', CommentDetailHandler),
            ('/register', RegisterHandler),
            ('/login', LoginHandler),
            ('/signOut', SignOutHandler),
            ('/team', TeamNewHandler),
            ('/team/([0-9]+)', TeamHandler),
            ('/settings', SettingHandler),
            ('/people', PeopleHandler),
            ('/people/new', NewPeopleHandler),
            ('/people/([0-9]+)', PeopleDetailHandler),
            ('/join/([0-9a-z]+)', JoinHandler),
            ('/autocomplete', AutoCompleteHandler),
        ]
        pool = redis.ConnectionPool(host='localhost', port=6379, db=0)
        r = redis.Redis(connection_pool=pool)
        self.session_store = RedisSessionStore(r)
        tornado.web.Application.__init__(self, handlers, **settings)
        
        qm = QueMail.get_instance()
        qm.init(options.smtp.get("host"), options.smtp.get("user"), options.smtp.get("password"))
        qm.start()

    def __del__(self):
        qm = QueMail.get_instance()
        qm.end()

def main():
    options.define('templatesPath')
    options.define('staticPath')
    options.define('port', type=int)
    options.define('login_url')
    options.define('attachmentPath')
    options.define('avatarPath')
    options.define('repositoryPath')
    options.define('debug', type=bool)
    options.define('cache_enabled', type=bool)
    options.define('smtp', type=dict)
    options.define('sqlalchemy_engine')
    options.define('sqlalchemy_kwargs', type=dict)
    options.define('allowImageFileType', type=set)
    options.define('allowDocumentFileType', type=dict)
    options.define('salt')
    options.define('domain')
    options.define('jsonFilter', type=set)

    options.parse_config_file("conf/config.conf")

    settings = dict(
        cookie_secret = "__TODO:_Generate_your_own_random_value_here__",
        template_path = os.path.join(os.path.dirname(__file__), options.templatesPath),
        static_path = os.path.join(os.path.dirname(__file__), options.staticPath),
        xsrf_cookies = False,
        autoescape = None,
        debug = True,
        login_url = options.login_url,
    )
    app = Application(settings)
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
