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

# install root dependencies (locally installs tools like typescript and lerna)
npm install 

# bootstrap the packages (installs dependencies and links the inter-dependencies)
# Note: This step is automatically done on building or testing
npm run bootstrap

# use tsc to transcompile TS code to JS in dist directory for each package
npm run build

# run test suites of all packets
npm run test 

# (OPTIONAL!) 
# make all packages availiable on your local machine (as symlinks)
# you can then use each paket in its local version via "npm link" instead of "npm install"
# see also https://docs.npmjs.com/cli/link
sudo npm run link

```