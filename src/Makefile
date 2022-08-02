default_target: all

all:
	npx tsc
	cp js/*.js ..
	cp js/*.map ..
	cp -r game ..

obfuscate:
	rm js/*.map
	npx javascript-obfuscator js
	npx uglifyjs js/*-obfuscated.js > retcon.min.js
	cp retcon.min.js ..

release:
	make obfuscate
	mkdir ../release
	cp ../index.html ../release
	cp ../main.css ../release
	cp retcon.min.js ../release

clean:
	rm -rf ./js
	rm -rf ../release
	rm -f ../*.js
	rm -rf ../game
	rm -f ../*.map
