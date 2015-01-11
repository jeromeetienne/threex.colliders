 # makefile to automatize simple operations

server:
	python -m SimpleHTTPServer

deploy:
	# assume there is something to commit
	# use "git diff --exit-code HEAD" to know if there is something to commit
	# so two lines: one if no commit, one if something to commit 
	git commit -a -m "New deploy" && git push -f origin HEAD:gh-pages && git reset HEAD~


###################################################
# Support betterjs cache dir - http://betterjs.org
buildBetterjs:
	jsdoc2betterjs -s -p -d .betterjs *.js

watchBetterjs: buildBetterjs
	# fswatch is available at https://github.com/emcrisostomo/fswatch
	fswatch *.js | xargs -n1 jsdoc2betterjs -s -p -d .betterjs

cleanBetterjs:
	rm -rf .betterjs

serverBetterjs: buildBetterjs
	jsdoc2betterjs servecachedir .betterjs

###################################################
