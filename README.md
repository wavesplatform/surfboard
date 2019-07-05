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
$ npm install -g @waves/surfboard
$ surfboard COMMAND
running command...
$ surfboard (-v|--version|version)
@waves/surfboard/1.6.0-beta.1 darwin-x64 node-v10.15.1
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

_See code: [src/commands/compile.ts](https://github.com/wavesplatform/surfboard/blob/v1.6.0-beta.1/src/commands/compile.ts)_

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

_See code: [src/commands/config/change.ts](https://github.com/wavesplatform/surfboard/blob/v1.6.0-beta.1/src/commands/config/change.ts)_

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

_See code: [src/commands/config/show.ts](https://github.com/wavesplatform/surfboard/blob/v1.6.0-beta.1/src/commands/config/show.ts)_

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

_See code: [src/commands/init.ts](https://github.com/wavesplatform/surfboard/blob/v1.6.0-beta.1/src/commands/init.ts)_

## `surfboard test [FILE]`

run test

```
USAGE
  $ surfboard test [FILE]

ARGUMENTS
  FILE  path to test file

OPTIONS
  --env=env  which environment should be used for test
```

_See code: [src/commands/test.ts](https://github.com/wavesplatform/surfboard/blob/v1.6.0-beta.1/src/commands/test.ts)_
<!-- commandsstop -->
