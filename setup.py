#!/usr/bin/env python
#

import distutils.core
import sys
# Importing setuptools adds some features like "setup.py develop", but
# it's optional so swallow the error if it's not there.
try:
    import setuptools
except ImportError:
    pass

kwargs = {}

version = "0.0.1"

with open('README.md') as f:
    long_description = f.read()

distutils.core.setup(
    name="MyTask",
    version=version,
    packages = ["MyTask", "MyTask.conf" ,"MyTask.controller" ,"MyTask.core" ,"MyTask.fileupload" ,
        "MyTask.forms" ,"MyTask.model" ,"MyTask.setup" ,"MyTask.static" ,"MyTask.templates" ,"MyTask.websocket"],

    author="myShen",
    author_email="mqshen@126.com",
    url="http://github.com/mqshen/MyTask",
    license="http://www.apache.org/licenses/LICENSE-2.0",
    description="MyTask is a small todolist manage system.",
    classifiers=[
        'License :: OSI Approved :: Apache Software License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.2',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: Implementation :: CPython',
        'Programming Language :: Python :: Implementation :: PyPy',
        ],
    install_requires=[                                                                                                                                                           
        'tornado>=3.1',
        'SQLAlchemy>=0.8',
        'redis>=2.7',
        'mysql-connector-python>=1.0',
        'Pillow>=2.0',
        'pysolr>=3.1',
        'pinyin>=0.1',
        'markdown>=2.3'
        ],
    long_description=long_description,
    **kwargs
)
