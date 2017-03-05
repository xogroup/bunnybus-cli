# Examples

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [`bunnybus`](#bunnybus)
  - [Help pages](#help-pages)
  - [Piping data from a file and publishing to a queue](#piping-data-from-a-file-and-publishing-to-a-queue)
  - [Subscribing data from a queue and redirecting output to a file](#subscribing-data-from-a-queue-and-redirecting-output-to-a-file)
  - [Subscribing data from a queue with a set expiration to close](#subscribing-data-from-a-queue-with-a-set-expiration-to-close)
  - [Fetch all data from a queue and redirect to a file.](#fetch-all-data-from-a-queue-and-redirect-to-a-file)
  - [Pipe all data from one RabbitMQ server to another.](#pipe-all-data-from-one-rabbitmq-server-to-another)
- [`bb-json-streamer`](#bb-json-streamer)
  - [Filter all contents from a file for JSON strings.](#filter-all-contents-from-a-file-for-json-strings)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## `bunnybus`

### Help pages

There is a help page which can be pulled up via the `-h` flag.

```
bunnybus -h
```

Will bring up

```
  Usage: bunnybus [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -P, --publish        publish a message to an exchange
    -S, --subscribe      subscribe message(s) from a queue
    -G, --get            get all message(s) from queue until empty
    -c, --config <path>  path to the configuration file
    -t, --tee            tee to stdout
    -d, --duration <n>   set a runtime duration for subscribe to close within <n> milliseconds. defaults to 0 for infinite
```

### Piping data from a file and publishing to a queue

Piping a file named `users.json` with many user JSON blobs to `bunnybus` for publishing.  Configuration provided through the `-c` switch.  

```
cat users.json | bunnybus -P -c /path/to/config.json
```

### Subscribing data from a queue and redirecting output to a file

Subscribe data from `bunnybus` and all of it will be redirected to `users.json`.  The `config.json` needs to define the values for `queue.name` and `queue.routeKey` for the subscription to work.  **Beaware** that the definition of the route key here means that any messages subscribed not matching the route key and lands in the subscribed queue will be disgarded.  This command will also hold the process open because subscriptions are long living operations.

```
bunnybus -S -c /path/to/config.json > users.json
```

### Subscribing data from a queue with a set expiration to close

This mimics the behavior from the above [example](#subscribing-data-from-a-queue-and-redirecting-output-to-a-file).  The major difference is that this process will close after 5 seconds of operation regardless if there are any more data on the subscribed queue.

```
bunnybus -S  -d 5000 -c /path/to/config.json > users.json
```

### Fetch all data from a queue and redirect to a file.

Fetches all data currently on the queue until empty and then the process will close.  The `config.json` needs to define the values for `queue.name` for the fetch to work.

```
bunnybus -G -c /path/to/config.json > users.json
```

### Pipe all data from one RabbitMQ server to another.

Fetches all data from a queue on server one.  This data will be published to server two.  All data that was streamed will be piped to a file for auditing.

```
bunnybus -G -c /path/to/server1.json | bunnybus --P -c /path/to/server2.json > logs.json
```

## `bb-json-streamer`

### Filter all contents from a file for JSON strings.

Given a file with unknown input data, `bb-json-stream` will filter out the content and only push into `output.json` valid json strings delimited by newline character (`\n`).

```
cat input.txt | bb-json-stream > output.json
```