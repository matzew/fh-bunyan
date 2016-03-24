# fh-bunyan

[![Circle CI](https://circleci.com/gh/evanshortiss/fh-bunyan/tree/master.svg?style=svg)](https://circleci.com/gh/evanshortiss/fh-bunyan/tree/master)

Log factory for applications that want sensible bunyan defaults on the Red
Hat Mobile Application Platform.

Example usage:

```js
var bunyan = require('fh-bunyan');

var log = bunyan.getLogger(__filename);

log.info('this is an "info" level log!');
```

## Install

### GitHub URL
You can add the following to your *package.json*, where version is a valid
semver tag.

```
"fh-bunyan": git+https://github.com/evanshortiss/fh-bunyan#{VERSION}
```

### npm

```
npm install fh-bunyan --save
```

## Configurations

### Levels
The logger is configured with some sensible defaults and applies them based on
the value of FH_ENV. For example, in _dev_ "trace" will be used. This also
applies if your environments are prefixed, e.g _ps-dev_ will also use "trace".

The list below describes the default levels:

* dev - trace
* test - debug
* preprod - info
* prod - info

### Environment Variables

* BUNYAN_FH_LEVEL - Can be set to control the log level. For example setting
this to "info" means "info" level will be used.
* FH_USE_LOCAL_DB - Not specific to this logger, but if set to a "truthy" value
it will cause "trace" logging to be enabled.

### Streams
By default, loggers write to _stdout_ and _stderr_ as follows:

* trace - stdout
* debug - stdout
* info - stdout
* warn - stdout
* error - stdout & stderr
* fatal - stdout & stderr

## Local Development
During local development _trace_ level logging is always enabled. We check if
local development is in effect by checking the *FH_USE_LOCAL_DB* environment
variable is defined and "truthy".

## Testing
Log output can be disabled when testing by setting the environment variable
*NODE_ENV* to "test".

## Reading Logs
By default, bunyan prints logs in a JSON format which can be difficult to read.
These can be made more leigble by piping your program output to bunyan.

For an example, try running the example in this repo:

```
npm install -g bunyan
node example/index.js | bunyan
```

This prints output like this:

```
[2016-03-23T02:54:32.537Z] TRACE: /example/index.js/75394 on eshortiss.local: test trace
[2016-03-23T02:54:32.538Z] DEBUG: /example/index.js/75394 on eshortiss.local: test debug
[2016-03-23T02:54:32.538Z]  INFO: /example/index.js/75394 on eshortiss.local: test info
[2016-03-23T02:54:32.538Z]  WARN: /example/index.js/75394 on eshortiss.local: test warn
[2016-03-23T02:54:32.539Z] ERROR: /example/index.js/75394 on eshortiss.local: error test error
    Error: test error
        at Object.<anonymous> (/Users/eshortiss/workspaces/fh/fh-bunyan/example/index.js:7:11)
        at Module._compile (module.js:456:26)
        at Object.Module._extensions..js (module.js:474:10)
        at Module.load (module.js:356:32)
        at Function.Module._load (module.js:312:12)
        at Function.Module.runMain (module.js:497:10)
        at startup (node.js:119:16)
        at node.js:906:3
```

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

Use this function if you'd like to change these defaults, but don't want to use
the *BUNYAN_FH_LEVEL* environment variable.

Remember to call this before making calls to _getLogger_!

Here's an example:

```js
var bunyan = require('fh-bunyan');

// Set our environment to log level map
bunyan.setLogMappings({
  'ps-dev': 'trace',
  'ps-test': 'info'
  'ps-preprod': 'info'
  'ps-prod': process.env.LOG_LEVEL // Example using an env var
});

var log = bunyan.getLogger(__filename);
```

## Contributors
Users below have contributed to this code, or with ideas.

* evanshortiss
* j-burlison
* MikeyBurkman
* billy-welch

Other folks, if you've been missed from this list open a PR adding yourself.
