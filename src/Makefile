default_target: all

all:
	npx tsc
	npx javascript-obfuscator js
	npx uglifyjs js/*-obfuscated.js > retcon.min.js
	cp retcon.min.js ..

release:
	mkdir ../release
	cp ../index.html ../release
	cp ../main.css ../release
	cp retcon.min.js ../release

clean:
	rm -r js
	rm -r ../release
	rm *.js
