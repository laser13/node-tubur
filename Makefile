MOCHA = ./node_modules/.bin/mocha
TESTS = $(shell find test -name "*.test.js")

test:
	@NODE_ENV=test $(MOCHA) \
		--timeout 0 \
		--require should \
		--reporter spec \
		$(TESTS)

test-cov: app-cov
	@COVERAGE=1 $(MOCHA) \
        --require should \
        --reporter html-cov > coverage.html \
        $(TESTS)

app-cov: clear
	@jscoverage --encoding=utf8 --no-highlight app app-cov

clear:
	@rm -rf app-cov coverage.html

.PHONY: test test-cov clear