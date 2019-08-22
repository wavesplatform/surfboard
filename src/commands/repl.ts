import repl, { REPLServer } from 'repl'
import { repl as compiler, version, getTypes, getVarsDoc, getFunctionsDoc } from '@waves/ride-js';
import { Command } from '@oclif/command';
import chalk from 'chalk';

let prompt: string;
switch (process.platform) {
    case 'darwin':
    case 'linux':
        prompt = `${chalk.blue('RIDE')} \x1b[0m\uD83D\uDD37 ${chalk.gray('>')}${chalk.blueBright('>')}${chalk.blue('>')} `;
        break;
    case 'win32':
        prompt = chalk.blue('RIDE > ');
        break;
    default:
        prompt = chalk.blue('RIDE > ');
        break;
}

function print(repl: REPLServer, str: string) {
    console.log(str);
    repl.displayPrompt();
}

function completer(line: string) {
    const completions: string[] = [
        ...getTypes(3).map(({name}) => name.split('|')).reduce((acc, val) => acc.concat(val), []),
        ...getFunctionsDoc(3).map(({name}) => name)
    ];

    const hits = completions.filter((c) => c.startsWith(line));
    return [hits.length ? hits : completions, line];
}

export default class extends Command {
    static description = 'run ride repl';

    async run() {
        process.stdout.write(chalk.bold(`Welcome to RIDE repl\nCompiler version ${version}\n`));
        const {evaluate} = compiler();
        repl.start({
            prompt, completer,
            eval: function (input, context, filename, cb) {
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
