from __future__ import unicode_literals
from cgi import escape

def html_params(**kwargs):
    """
    Generate HTML parameters from inputted keyword arguments.

    The output value is sorted by the passed keys, to provide consistent output
    each time this function is called with the same parameters.  Because of the
    frequent use of the normally reserved keywords `class` and `for`, suffixing
    these with an underscore will allow them to be used.

    >>> html_params(name='text1', id='f', class_='text') == 'class="text" id="f" name="text1"'
    True
    """
    params = []
    for k, v in sorted(kwargs.items()):
        if k in ('class_', 'class__', 'for_'):
            k = k[:-1]
        if v is True:
            params.append(k)
        else:
            params.append('%s="%s"' % (str(k), escape(v, quote=True)))
    return ' '.join(params)


class Input(object):
    """
    Render a basic ``<input>`` field.

    This is used as the basis for most of the other input fields.

    By default, the `_value()` method will be called upon the associated field
    to provide the ``value=`` HTML attribute.
    """
    html_params = staticmethod(html_params)

    def __init__(self, input_type=None):
        if input_type is not None:
            self.input_type = input_type

    def __call__(self, field, **kwargs):
        kwargs.setdefault('id', field.id)
        kwargs.setdefault('placeholder', field.gettext(field.label))
        print(kwargs.get('placeholder'))
        kwargs.setdefault('data-validate', field.validate_html)
        kwargs.setdefault('type', self.input_type)

        if 'value' not in kwargs:
            kwargs['value'] = field._value()
        return '<input %s>' % self.html_params(name=field.name, **kwargs)


class TextInput(Input):
    """
    Render a single-line text input.
    """
    input_type = 'text'

class EmailInput(Input):
    """
    Render a single-line text input.
    """
    input_type = 'email'

class PasswordInput(Input):
    """
    Render a single-line text input.
    """
    input_type = 'password'
