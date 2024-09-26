

encrypt:
	@find assets/data/companies -type f -name '*.dec.json' -exec node assets/js/jsoncrypt.js encrypt {} \;
