import repl, { REPLServer } from 'repl';
import { repl as compiler, version } from '@waves/ride-js';
import { Command } from '@oclif/command';

let diamond: string;
switch (process.platform) {
    case 'darwin':
    case 'linux':
        diamond = '\x1b[34mRIDE \x1b[0m\uD83D\uDD37 \x1b[90m>\x1b[94m>\x1b[0m\x1b[34m>\x1b[0m ';
        break;
    case  'win32':
        diamond = '\x1b[34mRIDE >\x1b[0m ';
        break;
    default:
        diamond = '\x1b[34mRIDE >\x1b[0m ';
        break;
}

function print(repl: REPLServer, str: string) {
    console.log(str);
    repl.displayPrompt();
}


export default class extends Command {
    async run() {
        process.stdout.write(`\x1b[1m${'Welcome to \x1b[34mRIDE\x1b[0m repl\nCompiler version ' + version}\x1b[0m\n\n`);
        repl.start({
            prompt: diamond,
            eval: function (input, context, filename, cb) {
                const res = compiler(input);
                if ('result' in res) {
                    if (typeof res.result === 'string') {
                        print(this, res.result);
                    } else {
                        cb(null, res.result);
                    }
                } else if ('error' in res) print(this, `\x1b[31m${res.error}\x1b[0m`);
            }
        });
    }
}
