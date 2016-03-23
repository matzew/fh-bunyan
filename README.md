# fh-bunyan

This module behaves as a log factory for any apps we run on the RHMAP that
would like to use bunyan.

## Install

### Git URL
You can add the following to your *package.json*, where version is a valid
semver tag.

```
"fh-bunyan": git+https://github.com/evanshortiss/fh-bunyan#{VERSION}
```

### npm

```
npm fh-bunyan --save
```

## Defaults

### Levels
The logger is configured with some sensible defaults and applies them based on
the value of FH_ENV. For example, in _dev_ "trace" will be used. This also
applies if your environments are prefixed, e.g _ps-dev_ will also use "trace".

The list below describes the default levels:

* dev - trace
* test - debug
* preprod - info
* prod - info

### Streams
By default, loggers write to _stdout_ and _stderr_ as follows:

* trace - stdout
* debug - stdout
* info - stdout
* warn - stdout
* error - stderr
* fatal - stderr

## Local Development
During local development _trace_ level logging is always enabled.

## Testing
Log output can be disabled when testing by setting the environment variable
*NODE_ENV* to "test".

## API

### getLogger(opts)
Returns a Bunyan logger instance that uses preconfigured streams and log levels
that are appropriate for our generic environments. _opts.name_ is required, and
passing the *__filename* variable from node.js is often a good idea.

Supported options:
* name <String> - The name for the logger.
* streams <Array> - An array of bunyan streams.

Examples:

```js
var bunyan = require('fh-bunyan');

// Passing an options Object
var logger = bunyan.getLogger({
  name: 'my-logger'
});

// Passing a name string, no Object
var otherLogger = bunyan.getLogger('my-other-logger');

// Options with name and custom streams
var loggerWithMongoStream = bunyan.getLogger({
  name: 'mongo-logger',
  streams: [require('fh-bunyan-mongo-stream')()]
});
```

### setLogMappings(map)
By default the logger uses the following mappings to determine the logging
levels for the given deployment environments:

* dev - trace
* test - debug
* preprod - info
* prod - info

Use this function if you'd like to change these defaults.

Remember to call this before making calls to _getLogger_!

Here's an example:

```js
var bunyan = require('fh-bunyan');

bunyan.setLogMappings({
  ps-dev: 'trace',
  ps-test: 'info'
  ps-preprod: 'info'
  ps-prod: 'warn'
});
```
