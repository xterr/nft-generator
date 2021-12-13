@xterr/nft-generator
====================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@xterr/nft-generator.svg)](https://npmjs.org/package/@xterr/nft-generator)
[![Downloads/week](https://img.shields.io/npm/dw/@xterr/nft-generator.svg)](https://npmjs.org/package/@xterr/nft-generator)
[![License](https://img.shields.io/npm/l/@xterr/nft-generator.svg)](https://github.com/xterr/nft-generator/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @xterr/nft-generator
$ nft-generator COMMAND
running command...
$ nft-generator (-v|--version|version)
@xterr/nft-generator/1.0.0 darwin-x64 node-v16.13.0
$ nft-generator --help [COMMAND]
USAGE
  $ nft-generator COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nft-generator generate COLLECTIONDIR`](#nft-generator-generate-collectiondir)
* [`nft-generator help [COMMAND]`](#nft-generator-help-command)

## `nft-generator generate COLLECTIONDIR`

Generate NFTs

```
USAGE
  $ nft-generator generate COLLECTIONDIR

ARGUMENTS
  COLLECTIONDIR  Directory where the collection metadata is stored

OPTIONS
  -f, --force
  -h, --help            show CLI help
  -n, --network=(egld)  [default: egld]
  -v, --verbose

EXAMPLE
  $ nft-generator generate <collection_dir>
```

_See code: [src/commands/generate.ts](https://github.com/xterr/nft-generator/blob/v1.0.0/src/commands/generate.ts)_

## `nft-generator help [COMMAND]`

display help for nft-generator

```
USAGE
  $ nft-generator help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.17/src/commands/help.ts)_
<!-- commandsstop -->
