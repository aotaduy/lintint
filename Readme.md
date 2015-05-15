
## lintint

This program integrates several lint tools for the javascript stack and allows the user to get an ordered list of lints for each file.

### Integrated Tools

+ jscs
+ eslint
+ jshint
+ htmllint
+ lintspelljs
+ lessc
+ csslint

It has integrated a RegExpChecker that allow you to define rules based on a regexp for any kind of file.


## Installation
````
npm install -g lintint
````

## Usage
````
lint-integrator [options] <directories> <files>
````
If called without parameters check recursively the cwd
Available options:
--config =<local|global>
    local: uses local project configuration files (.eslintrc, .jscsrc, csslintrc, etc).
    global: uses global lintint configuration files.
--help    : Print this help
--version : Print version information

Git-Repo (https://github.com/aotaduy/lintint.git)

## Configuration
By default lintint uses the configuration files located at:
<package-root>/config/

But if you use the --config=local flag it will use .jscsrc .eslintrc .htmllintrc files local to your project.
