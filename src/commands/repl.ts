import repl from 'repl';
import { repl as compiler, version } from '@waves/ride-js';
import { Command } from '@oclif/command';

export default class extends Command {
    async run() {
        process.stdout.write(`\x1b[1m${'Welcome to \x1b[34mRIDE\x1b[0m repl\nCompiler version ' + version}\x1b[0m\n\n`);
        repl.start({
            prompt: '\x1b[34mRIDE \x1b[0m\uD83D\uDD37 \x1b[90m>\x1b[94m>\x1b[0m\x1b[34m>\x1b[0m ',
            eval: function (input, context, filename, cb) {
                const res = compiler(input);
                cb('error' in res ? res.error : null, 'result' in res ? res.result : null);
            }
        });
    }
}


