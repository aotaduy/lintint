##intlint

This program integrates several lint tools for the javascript stack and allows the user to get an line by line ordered list of lints for each file

###Integrated Tools

+ jscs
+ jslint
+ eslint
+ jshint
+ htmllint
+ lintspelljs

It has integrated a RegExpChecker that allow you to define rules based on a regexp for any kind of file.

And in the future
````
lessc
csslint
````

##Installation
````
git clone https://github.com/aotaduy/lintint.git
npm install -g ./lintint
````

##Usage
````
lint-integrator [options] <directories> <files>
````
If called without parameters check recursively the cwd
Available options:
--help  : Print this help
--version       : Print version information

Git-Repo (https://github.com/aotaduy/lintint.git)

##Configuration
lintint uses the configuration files located at:
<package-root>/config/
For each tool integrated. 