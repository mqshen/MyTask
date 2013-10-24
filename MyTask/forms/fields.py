import datetime
import decimal
import itertools
import sys
import time

from forms.validators import StopValidation, u, unicode, next
from forms import widgets
from datetime import datetime

__all__ = (
    'TextField', 'ListField', 'FileField', 'IntField', 'DateField', 'BooleanField', 'DateTimeField', 'TimeField', 'EmailField', 'PasswordField'
)

_unset_value = object()

class UnboundField(object):
    _formfield = True
    creation_counter = 0

    def __init__(self, field_class, *args, **kwargs):
        UnboundField.creation_counter += 1
        self.field_class = field_class
        self.args = args
        self.kwargs = kwargs
        self.creation_counter = UnboundField.creation_counter

    def bind(self, form, name, translations=None, **kwargs):
        return self.field_class(_form=form, _name=name, _translations=translations, *self.args, **dict(self.kwargs, **kwargs))

    def __repr__(self):
        return '<UnboundField(%s, %r, %r)>' % (self.field_class.__name__, self.args, self.kwargs)


class Field(object):
    """
    Field base class
    """
    errors = tuple()
    _formfield = True

    def __new__(cls, *args, **kwargs):
        if '_form' in kwargs and '_name' in kwargs:
            return super(Field, cls).__new__(cls)
        else:
            return UnboundField(cls, *args, **kwargs)


    def __init__(self, label=u(''), validators=None, filters=tuple(),
                 description=u(''), id=None, default=None, widget=None, 
                 _form=None, _name=None, _translations=None):
        """
        Construct a new field.

        :param label:
            The label of the field. Available after construction through the
            `label` property.
        :param validators:
            A sequence of validators to call when `validate` is called.
        :param filters:
            A sequence of filters which are run on input data by `process`.
        :param description:
            A description for the field, typically used for help text.
        :param id:
            An id to use for the field. A reasonable default is set by the form,
            and you shouldn't need to set this manually.
        :param default:
            The default value to assign to the field, if no form or object
            input is provided. May be a callable.
        :param _form:
            The form holding this field. It is passed by the form itself during
            construction. You should never pass this value yourself.
        :param _name:
            The name of this field, passed by the enclosing form during its
            construction. You should never pass this value yourself.

        If `_form` and `_name` isn't provided, an :class:`UnboundField` will be
        returned instead. Call its :func:`bind` method with a form instance and
        a name to construct the field.
        """
        self.name = _name
        if _translations is not None:
            self._translations = _translations
        self.id = id or self.name
        if validators is None:
            validators = []
        self.validators = validators
        self.filters = filters
        if widget is not None:
            self.widget = widget
        self.description = description
        self.type = type(self).__name__
        self.default = default
        self.raw_data = None
        

    def gettext(self, string):
        return self._translations.gettext(string)

    def __call__(self, **kwargs):
        """
        Render this field as HTML, using keyword args as additional attributes.

        Any HTML attribute passed to the method will be added to the tag
        and entity-escaped properly.
        """
        return self.widget(self, **kwargs)

    def ngettext(self, singular, plural, n):
        return self._translations.ngettext(singular, plural, n)

    def validate(self, form, extra_validators=tuple()):
        """
        Validates the field and returns True or False. `self.errors` will
        contain any errors raised during validation. This is usually only
        called by `Form.validate`.

        Subfields shouldn't override this, but rather override either
        `pre_validate`, `post_validate` or both, depending on needs.

        :param form: The form the field belongs to.
        :param extra_validators: A list of extra validators to run.
        """
        self.errors = list(self.process_errors)
        stop_validation = False

        # Call pre_validate
        try:
            self.pre_validate(form)
        except StopValidation:
            e = sys.exc_info()[1]
            if e.args and e.args[0]:
                self.errors.append(e.args[0])
            stop_validation = True
        except ValueError:
            e = sys.exc_info()[1]
            self.errors.append(e.args[0])

        # Run validators
        if not stop_validation:
            for validator in itertools.chain(self.validators, extra_validators):
                try:
                    validator(form, self)
                except StopValidation:
                    e = sys.exc_info()[1]
                    if e.args and e.args[0]:
                        self.errors.append(e.args[0])
                    stop_validation = True
                    break
                except ValueError:
                    e = sys.exc_info()[1]
                    self.errors.append(e.args[0])

        # Call post_validate
        try:
            self.post_validate(form, stop_validation)
        except ValueError:
            e = sys.exc_info()[1]
            self.errors.append(e.args[0])

        return len(self.errors) == 0

    @property
    def validate_html(self):
        validate_str = '{'
        for validator in self.validators:
            validate_str += validator.get_validate_str() + ' ,'
        return validate_str[:-1] + '}'



    def pre_validate(self, form):
        """
        Override if you need field-level validation. Runs before any other
        validators.

        :param form: The form the field belongs to.
        """
        pass

    def post_validate(self, form, validation_stopped):
        """
        Override if you need to run any field-level validation tasks after
        normal validation. This shouldn't be needed in most cases.

        :param form: The form the field belongs to.
        :param validation_stopped:
            `True` if any validator raised StopValidation.
        """
        pass

    def process(self, formdata, data=_unset_value):
        """
        Process incoming data, calling process_data, process_formdata as needed,
        and run filters.

        If `data` is not provided, process_data will be called on the field's
        default.

        Field subclasses usually won't override this, instead overriding the
        process_formdata and process_data methods. Only override this for
        special advanced processing, such as when a field encapsulates many
        inputs.
        """
        self.process_errors = []
        if data is _unset_value:
            try:
                data = self.default()
            except TypeError:
                data = self.default
        try:
            self.process_data(data)
        except ValueError:
            e = sys.exc_info()[1]
            self.process_errors.append(e.args[0])

        if formdata:
            try:
                if self.name in formdata:
                    self.raw_data = formdata.getlist(self.name)
                else:
                    self.raw_data = []
                self.process_formdata(self.raw_data)
            except ValueError:
                e = sys.exc_info()[1]
                self.process_errors.append(e.args[0])

        for filter in self.filters:
            try:
                self.data = filter(self.data)
            except ValueError:
                e = sys.exc_info()[1]
                self.process_errors.append(e.args[0])

    def process_data(self, value):
        """
        Process the Python data applied to this field and store the result.

        This will be called during form construction by the form's `kwargs` or
        `obj` argument.

        :param value: The python object containing the value to process.
        """
        self.data = value

    def process_formdata(self, valuelist):
        """
        Process data received over the wire from a form.

        This will be called during form construction with data supplied
        through the `formdata` argument.

        :param valuelist: A list of strings to process.
        """
        if valuelist:
            self.data = valuelist[0]

    def populate_obj(self, obj, name):
        """
        Populates `obj.<name>` with the field's data.

        :note: This is a destructive operation. If `obj.<name>` already exists,
               it will be overridden. Use with caution.
        """
        setattr(obj, name, self.data)

      

class TextField(Field):
    """
    This field is the base for most of the more complicated fields, and
    represents an ``<input type="text">``.
    """
    widget = widgets.TextInput()

    def process_formdata(self, valuelist):
        if valuelist:
            self.data = valuelist[0]
        else:
            self.data = u('')
                                                                                                                                                                                 
    def _value(self):
        return self.data is not None and unicode(self.data) or u('')
    
class EmailField(TextField):
    """
    Represents an ``<input type="email">``.
    """
    widget = widgets.EmailInput()

class PasswordField(TextField):
    """
    Represents an ``<input type="email">``.
    """
    widget = widgets.PasswordInput()

class ListField(Field):
    """
    this field is the ba
    """
    def process_formdata(self, valuelist):
        if valuelist:
            self.data = valuelist
        else:
            self.data = u('')
                                                                                                                                                                                 
    def _value(self):
        return self.data is not None and unicode(self.data) or u('')

class FileField(Field):
    """
    this field is the file update
    """
    def process_formdata(self, valuelist):
        if valuelist:
            self.data = valuelist[0]['body']
        else:
            self.data = None                                                                                                                                                                                 
    def _value(self):
        return self.data is not None or u('')

class IntField(Field):
    """
    this field is the file update
    """
    def process_formdata(self, valuelist):
        if valuelist and len(valuelist[0]) > 0:
            self.data = int(valuelist[0])
        else:
            self.data = None                                                                                                                                                                                 
    def _value(self):
        return self.data is not None or None


class DateField(Field):
    #������������������datetime  
    def string_toDatetime(self, string):  
        return datetime.strptime(string, "%Y-%m-%d")
    """
    this field is the file update
    """
    def process_formdata(self, valuelist):
        if valuelist and len(valuelist[0]) > 0:
            self.data = self.string_toDatetime(valuelist[0])
        else:
            self.data = None                                                                                                                                                                                 
    def _value(self):
        return self.data is not None or u('')

class TimeField(Field):
    #������������������datetime  
    def string_toTime(self, string):  
        return datetime.strptime(string, "%H:%M:%S%p")
    """
    this field is the file update
    """
    def process_formdata(self, valuelist):
        if valuelist and len(valuelist[0]) > 0:
            time = valuelist[0]
            ampm = time[-2:]
            time = time[:-2]
            count = time.count(':')
            if count == 0:
                time = time + ':00:00' + ampm
            elif count == 1:
                time = time + ':00' + ampm
            temp = self.string_toTime(time)
            print(temp)
            self.data = self.string_toTime(time).time()
        else:
            self.data = None 
    def _value(self):
        return self.data is not None or u('')

class DateTimeField(Field):
    #������������������datetime  
    def string_toDatetime(self, string):  
        return datetime.strptime(string, "%Y-%m-%d %H:%M:%S")
    """
    this field is the file update
    """
    def process_formdata(self, valuelist):
        if valuelist and len(valuelist[0]) > 0:
            self.data = self.string_toDatetime(valuelist[0])
        else:
            self.data = None 
    def _value(self):
        return self.data is not None or u('')

class BooleanField(Field):
    """
    this field is the file update
    """
    def process_formdata(self, valuelist):
        if valuelist :
            self.data = True
        else:
            self.data = False
    def _value(self):
        return self.data is not None or False
