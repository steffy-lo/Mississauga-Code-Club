local: buildreact build start

dev: buildreact build shipdev clean

devlight: cleanreact build shipdev clean

deploy: buildreact build shipprod clean

prodlight: cleanreact build shipprod clean

prod: deploy

rebuild: clean build

rerebuild: clean buildreact build

build:
	docker build -t a1-301 .
	docker run -d --name a1-301-container -p 80:80 a1-301:latest

start:
	docker start a1-301-container
	docker run a1-301

shipprod:
	heroku container:login
	heroku container:push web --app mcc-prod-301
	heroku container:release web --app mcc-prod-301

shipdev:
	heroku container:login
	heroku container:push web --app mcc-dev-301
	heroku container:release web --app mcc-dev-301

buildreact:
	./buildreact.sh

cleanreact:
	rm -rf app/client/build
	rm -rf app/client/node_modules

clean:
	docker stop a1-301-container
	docker rm a1-301-container

setupheroku: getheroku login

getheroku:
	npm install -g heroku

login:
	heroku login

