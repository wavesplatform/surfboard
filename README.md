Ride-cli
=========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@waves/ride-cli.svg)](https://npmjs.org/package/@waves/ride-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@waves/ride-cli.svg)](https://npmjs.org/package/@waves/ride-cli)
[![License](https://img.shields.io/npm/l/@waves/ride-cli.svg)](https://github.com/wavesplatform/ride-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @waves/ride-cli
$ ride-cli COMMAND
running command...
$ ride-cli (-v|--version|version)
@waves/ride-cli/1.0.1 darwin-x64 node-v10.15.1
$ ride-cli --help [COMMAND]
USAGE
  $ ride-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ride-cli compile FILE`](#ride-cli-compile-file)
* [`ride-cli config:change KEY VALUE`](#ride-cli-configchange-key-value)
* [`ride-cli config:show [KEY]`](#ride-cli-configshow-key)
* [`ride-cli help [COMMAND]`](#ride-cli-help-command)
* [`ride-cli init`](#ride-cli-init)
* [`ride-cli test [FILE]`](#ride-cli-test-file)

## `ride-cli compile FILE`

compile ride file

```
USAGE
  $ ride-cli compile FILE

ARGUMENTS
  FILE  path to ride file
```

_See code: [src/commands/compile.ts](https://github.com/wavesplatform/ride-cli/blob/v1.0.1/src/commands/compile.ts)_

## `ride-cli config:change KEY VALUE`

Change config

```
USAGE
  $ ride-cli config:change KEY VALUE

ARGUMENTS
  KEY    config option key in dot notion
  VALUE  config option value

OPTIONS
  -g, --global  change global config
```

_See code: [src/commands/config/change.ts](https://github.com/wavesplatform/ride-cli/blob/v1.0.1/src/commands/config/change.ts)_

## `ride-cli config:show [KEY]`

show config

```
USAGE
  $ ride-cli config:show [KEY]

ARGUMENTS
  KEY  config option key in dot notion

OPTIONS
  -g, --global  show global config
```

_See code: [src/commands/config/show.ts](https://github.com/wavesplatform/ride-cli/blob/v1.0.1/src/commands/config/show.ts)_

## `ride-cli help [COMMAND]`

display help for ride-cli

```
USAGE
  $ ride-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `ride-cli init`

Initialize new Ride project

```
USAGE
  $ ride-cli init
```

_See code: [src/commands/init.ts](https://github.com/wavesplatform/ride-cli/blob/v1.0.1/src/commands/init.ts)_

## `ride-cli test [FILE]`

run test

```
USAGE
  $ ride-cli test [FILE]

ARGUMENTS
  FILE  path to test file
```

_See code: [src/commands/test.ts](https://github.com/wavesplatform/ride-cli/blob/v1.0.1/src/commands/test.ts)_
<!-- commandsstop -->
