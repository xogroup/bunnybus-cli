# bunnybus-cli
Command line tool for [BunnyBus](https://github.com/xogroup/bunnybus).

[![npm version](https://badge.fury.io/js/bunnybus-cli.svg)](https://badge.fury.io/js/bunnybus-cli)
[![Build Status](https://travis-ci.org/xogroup/bunnybus-cli.svg?branch=master)](https://travis-ci.org/xogroup/bunnybus-cli)
[![Known Vulnerabilities](https://snyk.io/test/github/xogroup/bunnybus-cli/badge.svg)](https://snyk.io/test/github/xogroup/bunnybus-cli)
[![NSP Status](https://nodesecurity.io/orgs/xo-group/projects/ff88f05a-3310-411c-a9c7-5abde736c4fc/badge)](https://nodesecurity.io/orgs/xo-group/projects/ff88f05a-3310-411c-a9c7-5abde736c4fc)

Lead Maintainer: [Lam Chan](https://github.com/lamchakchan)

## Introduction
This is a command line tool for supporting the BunnyBus ecosystem.  Support comes in the form of providing a piping utility to bus data via Linux/Unix pipes.  The implementation of this tool embodies the ideology around building small specialized components to compose better whole.

## Installation
```
npm i -g bunnybus-cli
```

##Usage
```Bash
# Subscribe a live stream of data from a queue to a file.
bunnybus -S -c /path/to/config.json > output.json

# Publish Json formatted string from a file  and push to Rabbit MQ
cat input.json | bunnyBus -P -c /path/to/config.json

# Subscribe a live stream of data and pipe it back to RabbitMQ live stream it to a file
bunnybus -S -c /path/to/config.json | bunnyBus -P -c /path/to/config.json > output.json
```

## Documentation

### API


### Examples



### Diagrams



## Contributing

We love community and contributions! Please check out our [guidelines](http://github.com/xogroup/bunnybus-cli/blob/master/.github/CONTRIBUTING.md) before making any PRs.

## Setting up for development

1. Install [Docker](https://docs.docker.com/engine/installation/)
2. Clone this project and `cd` into the project directory
3. Run the commands below

```
npm install
npm run start-docker
npm test
npm run stop-docker
```

For normal development/test iterations, there is no need to stop the docker container.  When the docker container is already running, just run `npm test`.
