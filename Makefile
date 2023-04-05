SHELL=/bin/bash
CWD=$(shell pwd)

default:

.PHONY: prepare
prepare:
	npm install pm2 -g
	cd proto && npm link
	docker run -d --name redis -p 6379:6379 redis:latest
	cd ${CWD}/api-gateway-service && npm install && npm run proto:install
	cd ${CWD}/users-service && npm install && npm run proto:install
	cd ${CWD}/departments-service && npm install && npm run proto:install

.PHONY: start
start:
	pm2 start

.PHONY: status
status:
	pm2 status

.PHONY: stop
stop:
	pm2 stop all
	

