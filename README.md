# [meezanapi](https://github.com/tjaffri/meezanapi)

[![Build Status](http://img.shields.io/travis/tjaffri/meezanapi/master.svg?style=flat-square)](https://travis-ci.org/tjaffri/meezanapi)
[![Coverage Status](https://img.shields.io/coveralls/tjaffri/meezanapi.svg?style=flat-square)](https://coveralls.io/github/tjaffri/meezanapi)
[![Dependency Status](http://img.shields.io/david/tjaffri/meezanapi.svg?style=flat-square)](https://david-dm.org/tjaffri/meezanapi)

> Simple API that powers the Meezan app, website and modern agents

## Using this Module

For detailed documentation, and code samples for how to use this API in your app or service please visit: http://meezanapi.azurewebsites.net/docs.

## Developing this Module

The rest of this `README` describes how you can clone this repo to get the source to develop/test locally. Contributions are very welcome!

### Environment Setup

First, set up your dev tools and node.js:

1. Set up your favourite IDE. We use VSCode: https://code.visualstudio.com/ and you can configure this IDE as follows:
  1. Follow this useful article about JavaScript development in VSCode [here](https://code.visualstudio.com/docs/languages/javascript), including how to debug.
  2. Set up linting in VSCode. You can install eslint globally via `npm install -g eslint` and then install the VSCode `eslint` extension. See [here](http://stackoverflow.com/questions/36327096/vscode-linter-es6-es7-babel-linter) for more info.
  3. Set up the `EditorConfig` extension for VSCode, so that tabs, spacing, etc are consistent with other contributor. See [here](https://github.com/editorconfig/editorconfig-vscode) for more info.
2. Install Node.js (version 6.x or higher)
3. Install Git: https://git-scm.com/download

Next, clone the repo and install dependencies.

```sh
$ git clone https://github.com/tjaffri/meezanapi
$ cd meezanapi
$ npm install
```

### Testing, Running and Publishing

Run one, or a combination of the following commands to lint and test your code:

```sh
$ npm run lint          # Lint the source code with ESLint (runs as part of CI build)
$ npm run lint:fix      # Lint the source code with ESLint, using the --fix option to auto-fix some issues
$ npm test              # Run unit tests with Mocha
$ npm run test:watch    # Run unit tests with Mocha, and watch files for changes
$ npm run test:cover    # Run unit tests with code coverage by Istanbul (runs as part of CI build)
$ npm run coveralls     # Report code coverage to coveralls.io (runs as part of CI build)
$ dredd                 # Run tests to ensure implementation matches swagger doc (runs as part of CI build)
```

During development, you can run your code as follows:

```sh
$ source tools/env-development.sh   # Sets the development environment variables
$ npm run build:dev                 # Run the server locally, watching for changes (and reloading when needed)
$ npm run build:debug               # Builds debug files, allowing you to debug via the vscode debugger
```

You can also build and run the production site as follows:

```sh
$ source tools/env-production.sh   # Sets the production environment variables
$ npm start                        # Builds and starts the production site
$ npm run build:release            # Alternatively, you can only run the build by itself (runs as part of CI build)
```

## Documentation

The documentation site at http://meezanapi.azurewebsites.net/docs is updated automatically, based on
the `swagger/swagger.json` spec checked into this repo.

This file has to be kept in sync with the implementation, otherwise you will get build failures in the CI build (which
verifies that the implementation matches the spec.

## Architecture

This codebase uses ES7 async/await JavaScript (transpiled via Babel), and http://expressjs.com as the web server.

Here are some resources to get up to speed with all the different technologies used:

1. [ES6 Training Course](https://es6.io/friend/konstantin) by Wes Bos
2. [You Don't Know JS: ES6 & Beyond](http://amzn.to/2bzvV51) by Kyle Simpson (Dec, 2015)
3. [Understand promises before you start using async/await](https://medium.com/@bluepnume/learn-about-promises-before-you-start-using-async-await-eb148164a9c8#.q2u0j68wd)

## Credits

With thanks, Meezan acknowledges and depends on the following resources:

1. Tanzil project: http://tanzil.net/
2. EveryAyah: http://everyayah.com/

The underlying ES2016 based `quran-promise` node module is also available at: https://www.npmjs.com/package/quran-promise.

### License

MIT © 2016 Axis, the Information Professionals.
