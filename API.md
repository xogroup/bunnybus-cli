# 2.0.0 API Reference

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Commands](#commands)
  - [`bunnybus`](#bunnybus)
    - [Required Flags](#required-flags)
    - [Optional Flags](#optional-flags)
    - [Configuration File](#configuration-file)
  - [`bb-json-streamer`](#bb-json-streamer)
- [Error Types](#error-types)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Commands

### `bunnybus`

This CLI tool is built for command line interfacing with the [`BunnyBus`](https://github.com/xogroup/bunnybus) module.  The purpose is to allow users to manipulate data on the bus without needing to write an application wrapper.  This tool embodies the ideology around other Linux/Unix command tools for providing a light weight component that is resuable within a terminal pipe (`|`) chain.

#### Required Flags

All required flags are upper cased.

- `-P, --publish` - publish a message on to the bus.
- `-S, --subscribe` - subcribe messages from a queue.  Process will not close unless duration is provided.
- `-G, --get` - get all existing messages from a queue.  Process will close once end of message is reached.

#### Optional Flags

All optional flags are lower cased.

- `-h, --help` - print help page.
- `-c, --config <path>` - file path input for configuration path.  Must be used in conjunction with the following flags (`-P`, `-S`, `-G`).  Refer to this file [specification](#configuration-file). *[string]*
- `-t, -tee` - for commands like `--publish` that writes to a device.  This will allow the stdio stream to continue for the next pipe to connect on.
- `-d, -duration <n>` - used with `--subscribe` to close the subscription after provded time in milliseconds.  *[integer]*
- `-m, --metadata` - used with `--publish`, `--subscribe` and `--get` actions.  When set, the meta data of the message payload will be included in all serialization and deserialization process.
- `-v, -verbose < path>` - output path to a file for logging.  The directory path needs to exist and write permission must be in place or errors will be thrown.

#### Configuration File

The configuration file is in JSON format.

```Javascript
{
    "server": {
        "ssl": false,
        "user": "guest",
        "password": "guest",
        "server": "127.0.0.1",
        "port": 5672,
        "vhost": "%2f",
        "heartbeat": 2000,
        "autoAcknowledgement": false,
        "globalExchange": "default-exchange",
        "prefetch": 5,
        "errorQueue": "error-bus",
        "silence": false,
        "maxRetryCount": 10
    },
    "queue": {
        "name": "bunnybus-cli-test",
        "routeKey": "system.event-created",
        "exclusive": false,
        "durable": true,
        "autoDelete": false,
        "arguments": []
    },
    "exchange": {
        "durable": true,
        "internal": false,
        "autoDelete": false,
        "alternateExchange": null,
        "arguments": []
    }
}
```

### `bb-json-streamer`

A single purpose string transform CLI tool.  Given a stream of type `utf8` characters for input, this utility will parse out identifying segments of JSON structure and output on the other end.  Any characters within the string not residing within the JSON defined structure will be disgarded.  This transform is destructive and does not provide a 1 to 1 input / output flow pipeline.  The output of all JSON will be newline `\n` delimited.

## Error Types

All BunnyBus CLI errors are extended from the native `Error` class.

- `JsonStringFormatError` - thrown when the JSON string transformer class can not reconcile input and stops in a bad state.
- `OperationError` - any operation error derived from executing `BunnyBus` API calls.
- `QueueConfigMissingError` - used when the loaded configuration is missing value for `queue`.
- `QueueNameMissingError` - used when the loaded configuration is missing value for `queue.name`.
- `RouteKeyMissingError` - used when the loaded configuration is missing value for `queue.routeKey`.
