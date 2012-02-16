NODE = node
TEST = ./node_modules/.bin/vows
TESTS ?= test/*-test.js

test:
	@NODE_ENV=test NODE_PATH=lib $(TEST) $(TEST_FLAGS) $(TESTS)

docs: docs/api.html

docs/api.html: lib/passport-instagram/*.js
	dox \
		--title Passport-Instagram \
		--desc "Instagram authentication strategy for Passport" \
		$(shell find lib/passport-instagram/* -type f) > $@

docclean:
	rm -f docs/*.{1,html}

.PHONY: test docs docclean
