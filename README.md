# bunnybus-cli
Command line tool for [BunnyBus]().

Currently supports the following queueing frameworks.

- [RabbitMQ](https://www.rabbitmq.com/)

[![npm version](https://badge.fury.io/js/bunnybus-cli.svg)](https://badge.fury.io/js/bunnybus-cli)
[![Build Status](https://travis-ci.org/xogroup/bunnybus-cli.svg?branch=master)](https://travis-ci.org/xogroup/bunnybus-cli)
[![Known Vulnerabilities](https://snyk.io/test/github/xogroup/bunnybus-cli/badge.svg)](https://snyk.io/test/github/xogroup/bunnybus-cli)
[![NSP Status](https://nodesecurity.io/orgs/xo-group/projects/ff88f05a-3310-411c-a9c7-5abde736c4fc/badge)](https://nodesecurity.io/orgs/xo-group/projects/ff88f05a-3310-411c-a9c7-5abde736c4fc)

Lead Maintainer: [Lam Chan](https://github.com/lamchakchan)

## Introduction
BunnyBus abstracts away low level queue driver details such as creating a connection, creating a channel, creating bindings, creating subscribing queues and etc.  BunnyBus provides safe defaults for many setups which can also be configured.  The core of BunnyBus implements native node callbacks providing maximum performance.  BunnyBus provides two flavors of API for callbacks and Promise alike.

## Installation
```
npm i -g bunnybus-cli
```

##Usage
```
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
