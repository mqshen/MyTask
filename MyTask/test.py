import subprocess
command_opt = ['lessc', 'test.less', 'test.css']
subprocess.call(command_opt, shell=False)
