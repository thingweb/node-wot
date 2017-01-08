# node-wot
Web of Things implementation on Node.js

Build:
[![Build Status](https://travis-ci.org/thingweb/node-wot.svg?branch=master)](https://travis-ci.org/thingweb/node-wot)

## License

MIT License

## How to get ready for coding

```
# Clone the repository
$ git clone https://github.com/thingweb/node-wot

# Go into the repository
$ cd node-wot

# install typescript (globally)
npm install -g typescript

# install node-wot and dependent modules (installs TS locally)
npm install

# start tsc to transcompile TS code to JS in dist directory
# Note: This step is automatically done on starting
tsc
# alternatively
npm run build

# start node-wot
npm test # runs test suites
npm start # very basic example
```