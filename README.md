Surfboard
=========

Surfboard is a command line interface for working with RIDE programming language. Surfboard allows to compile RIDE scripts, deploy and run tests. 

Surfboard requires `nodejs`. 

The full manual how to use different tools for Waves dApps you can find [here](https://blog.wavesplatform.com/how-to-build-deploy-and-test-a-waves-ride-dapp-785311f58c2)

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@waves/ride-cli.svg)](https://npmjs.org/package/@waves/ride-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@waves/ride-cli.svg)](https://npmjs.org/package/@waves/ride-cli)
[![License](https://img.shields.io/npm/l/@waves/ride-cli.svg)](https://github.com/wavesplatform/ride-cli/blob/master/package.json)

<!-- toc -->
* [Installation](#installation)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Installation
Surfboard is distributed as npm package. To install run `npm i -g @waves/surfboard`

# Usage
For all commands surboard tries to use `surfboard.config.json`. If it is not present, surfboard falls back to global config. You can change global config by using `config:change` with `-g` flag 
<!-- usage -->
```sh-session
$ npm install -g @waves/surfboard
$ surfboard COMMAND
running command...
$ surfboard (-v|--version|version)
@waves/surfboard/1.11.7 darwin-x64 node-v13.11.0
$ surfboard --help [COMMAND]
USAGE
  $ surfboard COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`surfboard compile FILE`](#surfboard-compile-file)
* [`surfboard config:change KEY VALUE`](#surfboard-configchange-key-value)
* [`surfboard config:show [KEY]`](#surfboard-configshow-key)
* [`surfboard help [COMMAND]`](#surfboard-help-command)
* [`surfboard init`](#surfboard-init)
* [`surfboard repl`](#surfboard-repl)
* [`surfboard run FILE`](#surfboard-run-file)
* [`surfboard test [FILE]`](#surfboard-test-file)

## `surfboard compile FILE`

compile ride file

```
USAGE
  $ surfboard compile FILE

ARGUMENTS
  FILE  path to ride file

OPTIONS
  --fullInfo  outputs JSON with additional info. Such as complexity, size etc.
```

_See code: [src/commands/compile.ts](https://github.com/wavesplatform/surfboard/blob/v1.11.7/src/commands/compile.ts)_

## `surfboard config:change KEY VALUE`

change config

```
USAGE
  $ surfboard config:change KEY VALUE

ARGUMENTS
  KEY    config option key in dot notion
  VALUE  config option value

OPTIONS
  -g, --global  change global config
```

_See code: [src/commands/config/change.ts](https://github.com/wavesplatform/surfboard/blob/v1.11.7/src/commands/config/change.ts)_

## `surfboard config:show [KEY]`

show config

```
USAGE
  $ surfboard config:show [KEY]

ARGUMENTS
  KEY  Config option key in dot notation

OPTIONS
  -g, --global  Show global config
```

_See code: [src/commands/config/show.ts](https://github.com/wavesplatform/surfboard/blob/v1.11.7/src/commands/config/show.ts)_

## `surfboard help [COMMAND]`

display help for surfboard

```
USAGE
  $ surfboard help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `surfboard init`

initialize new Ride project

```
USAGE
  $ surfboard init
```

_See code: [src/commands/init.ts](https://github.com/wavesplatform/surfboard/blob/v1.11.7/src/commands/init.ts)_

## `surfboard repl`

run ride repl

```
USAGE
  $ surfboard repl

OPTIONS
  --env=env  which environment should be used for test
```

_See code: [src/commands/repl.ts](https://github.com/wavesplatform/surfboard/blob/v1.11.7/src/commands/repl.ts)_

## `surfboard run FILE`

run js script with with blockchain context

```
USAGE
  $ surfboard run FILE

ARGUMENTS
  FILE  path to script

OPTIONS
  --env=env              which environment should be used

  --variables=variables  env variables can be set for usage in script via env.{variable_name}. E.g.: MY_SEED="seed
                         phraze",DAPP_ADDRESS="xyz"
```

_See code: [src/commands/run.ts](https://github.com/wavesplatform/surfboard/blob/v1.11.7/src/commands/run.ts)_

## `surfboard test [FILE]`

run test

```
USAGE
  $ surfboard test [FILE]

ARGUMENTS
  FILE  path to test file

OPTIONS
  -v, --verbose          logs all transactions and node responses
  --env=env              which environment should be used for test

  --variables=variables  env variables can be set for usage in tests via env.{variable_name}. E.g.: MY_SEED="seed
                         phraze",DAPP_ADDRESS=xyz, AMOUNT=1000
```

_See code: [src/commands/test.ts](https://github.com/wavesplatform/surfboard/blob/v1.11.7/src/commands/test.ts)_
<!-- commandsstop -->
