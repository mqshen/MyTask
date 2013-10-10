static: less copyimages
less:
	lessc -nc MyTask/assets/less/public.less > MyTask/static/css/public.css
	lessc -nc MyTask/assets/less/signin.less > MyTask/static/css/signin.css
	lessc -nc MyTask/assets/less/application.less > MyTask/static/css/application.css
copyimages:
	cp -r MyTask/assets/images/* MyTask/static/images/
