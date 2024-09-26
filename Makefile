

encrypt:
	@find assets/data -type f -name '*.dec.json' -exec node assets/js/jsoncrypt.js encrypt {} \;
