import hashlib
from tornado.options import options

def generateToken(handler, calendarName, user):
    m = hashlib.md5()
    m.update(('%s-%s-%s'%(options.salt,
                       calendarName,
                       user.password)).encode('utf-8'))
    userToken = m.hexdigest()
    m.update(('%s-%s-%s'%(options.salt,
                       user.email,
                       calendarName)).encode('utf-8'))
    token = '%s--%s'%(userToken, m.hexdigest())
    return token
