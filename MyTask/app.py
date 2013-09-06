import tornado.ioloop
import tornado.web
import os.path
import redis
from core.session import RedisSessionStore
from core import ui_methods
from tornado.options import options
from core.quemail import QueMail

class Application(tornado.web.Application):
    def __init__(self, settings):
        from controller.attachment import AttachmentHandler, AvatarHandler
        from controller.search import AutoCompleteHandler
        from controller.mycalendar import  CalendarHandler, CalendarEventHandler, CalendarEventModifyHandler
        from controller.operation import OperationHandler, TodoItemLogHandler
        from controller.project import ProjectHandler, ProjectFilesHandler, ProjectColorHandler, ProjectDetailHandler, \
                ProjectAccessHandler, NewProjectHandler
        from controller.todo import TodoListHandler, TodoListDetailHandler, TodoItemHandler, TodoItemDetailHandler, \
                TodoItemModifyHandler, TodoItemCommentHandler, TodoListModifyHandler, TodoListCommentHandler
        from controller.topic import MessageHandler, MessageDetailHandler, NewMessageHandler, CommentHandler, CommentDetailHandler
        from controller.user import RegisterHandler, LoginHandler, SignOutHandler, TeamNewHandler, TeamHandler, SettingHandler, \
                PeopleHandler, NewPeopleHandler, PeopleDetailHandler, JoinHandler
        from controller.calendarfeed import CalendarFeedHandler, CalendarFeedPortalHandler, CalendarItemFeedHandler

        handlers = [
            ('/([0-9]+)', ProjectHandler),
            ('/([0-9]+)/attachment/([0-9A-Za-z]+)', AttachmentHandler),
            ('/([0-9]+)/calendar', CalendarHandler),
            ('/([0-9]+)/event', CalendarEventHandler),
            ('/([0-9]+)/event/([0-9]+)/trash', CalendarEventModifyHandler),
            ('/([0-9]+)/operation', OperationHandler),
            ('/([0-9]+)/project', ProjectHandler),
            ('/([0-9]+)/project/([0-9]+)/files', ProjectFilesHandler),
            ('/([0-9]+)/project/([0-9]+)/color', ProjectColorHandler),
            ('/([0-9]+)/project/([0-9]+)', ProjectDetailHandler),
            ('/([0-9]+)/project/([0-9]+)/access', ProjectAccessHandler),
            ('/([0-9]+)/project/new', NewProjectHandler),
            ('/([0-9]+)/project/([0-9]+)/todolist', TodoListHandler),
            ('/([0-9]+)/project/([0-9]+)/todolist/([0-9]+)', TodoListDetailHandler),
            ('/([0-9]+)/project/([0-9]+)/todolist/([0-9]+)/trash', TodoListModifyHandler),
            ('/([0-9]+)/project/([0-9]+)/todolist/([0-9]+)/comment', TodoListCommentHandler),
            ('/([0-9]+)/project/([0-9]+)/todolist/([0-9]+)/todoitem', TodoItemHandler),
            ('/([0-9]+)/project/([0-9]+)/todolist/([0-9]+)/todoitem/([0-9]+)', TodoItemDetailHandler),
            ('/([0-9]+)/project/([0-9]+)/todolist/([0-9]+)/todoitem/([0-9]+)/log', TodoItemLogHandler),
            ('/([0-9]+)/project/([0-9]+)/todolist/([0-9]+)/todoitem/([0-9]+)/(done|undone|trash)', TodoItemModifyHandler),
            ('/([0-9]+)/project/([0-9]+)/todolist/([0-9]+)/todoitem/([0-9]+)/comment', TodoItemCommentHandler),
            ('/([0-9]+)/project/([0-9]+)/message', MessageHandler),
            ('/([0-9]+)/project/([0-9]+)/message/([0-9]+)', MessageDetailHandler),
            ('/([0-9]+)/project/([0-9]+)/message/new', NewMessageHandler),
            ('/([0-9]+)/project/([0-9]+)/message/([0-9]+)/comment', CommentHandler),
            ('/([0-9]+)/project/([0-9]+)/message/([0-9]+)/comment/([0-9]+)', CommentDetailHandler),
            ('/([0-9]+)/people', PeopleHandler),
            ('/([0-9]+)/people/([0-9]+)', PeopleDetailHandler),
            ('/([0-9]+)/people/new', NewPeopleHandler),
            ('/([0-9]+)/calendar_feeds', CalendarFeedPortalHandler),
            ('/([0-9]+)/calendar_feeds.ics', CalendarFeedHandler),
            ('/([0-9]+)/calendar_feeds/([cp][0-9]+).ics', CalendarItemFeedHandler),
            ('/avatar', AvatarHandler),
            ('/avatar/([0-9A-Za-z]+)', AvatarHandler),
            ('/attachment', AttachmentHandler),
            ('/register', RegisterHandler),
            ('/login', LoginHandler),
            ('/signOut', SignOutHandler),
            ('/team', TeamNewHandler),
            ('/', TeamNewHandler),
            ('/team/([0-9]+)', TeamHandler),
            ('/settings', SettingHandler),
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
        ui_methods = ui_methods,
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
