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
# make all packages available on your local machine (as symlinks)
# you can then use each paket in its local version via "npm link" instead of "npm install"
# see also https://docs.npmjs.com/cli/link
sudo npm run link

```

## No time for explanations - I want to start from something running!
Run all the steps above and then run this:

```
cd examples/scripts
wot-servient
```

* go to http://localhost:8080/counter and you'll find a thing description.
* you can query the count by http://localhost:8080/counter/properties/count
* you can modify the count via POST on http://localhost:8080/counter/actions/increment and http://localhost:8080/counter/actions/decrement
* application logic is in ``examples/scripts/counter.js``

## How to use the library

This library implements the Scripting API defined in the [WoT Current Practices](https://w3c.github.io/wot/current-practices/wot-practices.html#scripting-api) document. 

You can also see _examples/scripts_ to have a feeling of how to script a Thing.

Not everything has been succesfully implemented.
