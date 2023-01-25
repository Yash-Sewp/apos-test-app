# Kiichiro Toyota CMS for Toyota and Lexus

## Overview
This CMS is used for both Toyota and Lexus. It works off this component listing:
(https://docs.google.com/spreadsheets/d/1vsXuAZma0XEaU2TIUWEulFilD3OYucDtIlLEmzQbLkI/edit?usp=sharing)

## Index
* Local set up
* During development
* Production build
* Testing environment

## @ Local Develop Set Up @

### Local setup steps: Run the following commands

1. npm i
2. mongod --dbpath "c:\data" - run in new terminal window (cmd for windows, not sure what mac cmd to start mongodb is)
3. *** NB::: if your using windows: copy the code from here (https://bit.ly/2HNowje) and replace in this file: node_modules\gulp-sass-main\index.js ***
4. gulp build (builds out the scss-build.less file, for apostrophe styling)
5. node app.js apostrophe-groups:add admin admin
6. node app.js apostrophe-users:add admin admin
	a. if first instance of the repo on your local, run gulp build to generate the main less stylesheet of website
7. gulp watch (run nodemon and sass together) OR npm run watch (run site without gulp) 
8. Visit http://localhost:3000

### During development

1. mongod --dbpath "c:\data"
2. gulp watch (Usng gulp to build SCSS style sheets for bootstrap, gives access to all bootstrap variables)

	* main style sheet - site.scss in /src/site.scss (Sits outside apostrophe modules for gulp ordering on watch build of import file - scss-build.scss)
	* scss-build.scss - auto generates on gulp watch - turns all scss files (site.scss and any added in apos modules to imports)
		1. -> Note: after building - all files are output to one .less file in apostrophe assets (scss-build.less)
	* bootstrap files - loaded in from /src/bootstrap/scss
		1. -> Note: Some bootstrap styling that isn't relevant at present has been commented out: /src/bootstrap/scss/bootstrap.scss
	* Overrides of variables for bootstrap - /src/bootstrap/overrides/variables.scss
	* Any custom scss - /src/bootstrap/custom
	* Additonal Plugin scss files can be included (Mostly jquery plugins at present) - /src/bootstrap/plugins

3. node app.js (Must restart to compile public css (less) and js changes) OR "npm run watch" / "glup watch" (Auto-restarts on .js, .json and .scss changes)
4. Visit http://localhost:3000

### ;)
