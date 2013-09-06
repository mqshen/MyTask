import hashlib
from tornado.options import options


OPERATION_TYPE = [
    '创建', 
    '发起', 
    '回复', 
    '删除', 
    '编辑', 
    '查询', 
    '回复', 
    '开始', 
    '暂停', 
    '完成',
    '取消完成',
    '上传',
    '分配'
]

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

def getOperationDisplay(handler, operation):
    return OPERATION_TYPE[operation]
    
def hasError(handler, form, name) :
    if form and form.errors and name in form.errors :
        return "error shake"
    return ""

def formValue(handler, form, name) :
    if form and form.errors and name in form.errors :
        return ""
    if form and form[name].data:
        return form[name].data
    return ""
