import repl, { REPLServer } from 'repl';
import { repl as compiler, version } from '@waves/ride-js';
import { Command } from '@oclif/command';
import chalk from 'chalk';

let diamond: string;
switch (process.platform) {
    case 'darwin':
    case 'linux':
        diamond = `${chalk.blue('RIDE')} \x1b[0m\uD83D\uDD37 ${chalk.gray('>')}${chalk.blueBright('>')}${chalk.blue('>')} `;
        break;
    case 'win32':
        diamond = chalk.blue('RIDE > ');
        break;
    default:
        diamond = chalk.blue('RIDE > ');
        break;
}

function print(repl: REPLServer, str: string) {
    console.log(str);
    repl.displayPrompt();
}

export default class extends Command {
    async run() {
        process.stdout.write(chalk.bold(`Welcome to RIDE repl\nCompiler version ${version}\n`));
        const {evaluate} = compiler();
        repl.start({
            prompt: diamond, eval: function (input, context, filename, cb) {
                if (input === '\n') {
                    this.displayPrompt();
                    return;
                }
                const res = evaluate(input);
                if ('result' in res) {
                    if (typeof res.result === 'string') {
                        print(this, res.result);
                    } else {
                        cb(null, res.result);
                    }
                } else if ('error' in res) print(this, chalk.red(res.error));
            }
        });
    }
}
