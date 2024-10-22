
SHELL := /bin/bash

push: encrypt
	@git add .
	@git commit -am update
	@git push

pull:
	@git pull
	@make -s decrypt

manage:
	@echo "Open manage page: <https://docs.google.com/spreadsheets/d/1T2rr_RUggcaVfvdS2pdKAq0A1kkwLsHrD1b9HLuoWog/edit?gid=0#gid=0>"

server:
	@sleep 1 && echo -e -n "--- \r\nOpen this page: <http://localhost:8080>\r\n---\r\n" &
	@docker stop $$(docker ps -q --filter "publish=8080") || true
	@docker run --rm -it -v $${PWD}:/usr/share/nginx/html:ro -p 8080:80 nginx:alpine

encrypt:
	@while read s; do [ -n "$$s" ] && \
		node assets/js/crypt encrypt "assets/data/secrets/$${s:1:2}/$${s:1:2}.json" "$$s" \
			> "assets/data/secrets/$${s:1:2}/$${s:1:2}.enc" || true; done < secrets.txt

decrypt:
	@while read s; do [ -n "$$s" ] && \
		node assets/js/crypt decrypt "assets/data/secrets/$${s:1:2}/$${s:1:2}.enc" "$$s" \
			> "assets/data/secrets/$${s:1:2}/$${s:1:2}.json" || true; done < secrets.txt
