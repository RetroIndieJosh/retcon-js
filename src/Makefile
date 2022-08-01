default_target: all

all:
	make clean
	npx tsc
	cp js/*.js ..

obfuscate:
	npx javascript-obfuscator js
	npx uglifyjs js/*-obfuscated.js > retcon.min.js
	cp retcon.min.js ..

release:
	make clean
	make obfuscate
	mkdir ../release
	cp ../index.html ../release
	cp ../main.css ../release
	cp retcon.min.js ../release

clean:
	rm -rf ./js
	rm -rf ../release
	rm -f ./*.js
	rm -f ../*.js
