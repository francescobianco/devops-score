
push: encrypt
	@git add .
	@git commit -am update
	@git push

pull:
	@git pull
	@make -s decrypt

encrypt:
	@while read s; do [ -n "$$s" ] && \
		node assets/js/crypt encrypt "assets/data/secrets/$${s:1:2}.json" "$$s" \
		|| true; done < secrets.txt

decrypt:
	@while read line; do [ -n "$$line" ] && echo node assets/js/crypt "$$line" || true; done < secrets.txt
