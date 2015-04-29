intlint -> Integral Lint
This program integrates several lint tools for the javascript stack and allows the user to obtain an ordered list of lints on his project file by file.

It uses his own configuration files located on:
config/

It integrates the following linting tools:
````
jscs
jslint
eslint
jshint
htmllint
spellcheckvars
````

It has integrated a RegExpChecker that allow you to define rules based on a regexp for any kind of file.

And in the future
lessc
csslint


Installation
````
npm install lint-integrator.tgz
````

Usage
lint-integrator [options] <directories> <files>
If called without parameters check recursively the cwd
Available options:
--help  : Print this help
--version       : Print version information

Git-Repo
