import repl, { REPLServer } from 'repl';
import { getFunctionsDoc, getTypes, getVarsDoc, repl as compiler, version } from '@waves/ride-js';
import { Command } from '@oclif/command';
import { libs } from '@waves/waves-transactions';
import chalk from 'chalk';
import cli from 'cli-ux';
import * as flags from '@oclif/command/lib/flags';
import configService from '../services/config';

export let prompt: string;
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

const infoData: { [key: string]: string } = {
    'FOLD': 'list : List[A] - list of values\n' +
        'acc : B - accumulator\n' +
        'foldFunc: func(acc:B, value: A) : B - folding function, takes values from list one by one'
};

function completer(line: string) {
    let match;
    if ((match = line.match(/^\?[ \t]*([a-zA-Z0-9_-]*)$/m)) != null) line = match[1];
    const completions: string[] = [
        ...getTypes(3).map(({name}) => name.split('|')).reduce((acc, val) => acc.concat(val), []),
        ...getFunctionsDoc(3).map(({name}) => name),
        ...getVarsDoc(3).map(({name}) => name)
    ].filter((item, i, arr) => arr.indexOf(item) === i);

    const hits = completions.filter((c) => c.startsWith(line));
    return [hits, line];
}

export default class Repl extends Command {
    static description = 'run ride repl';

    static flags = {
        env: flags.string({
            description: 'which environment should be used for test'
        }),
    };

    static print(replRename: REPLServer, str: string) {
        console.log(str);
        replRename.displayPrompt();
    }

    static welcome() {
        process.stdout.write(chalk.bold(`Welcome to RIDE repl\nCompiler version ${version}\n`));
        process.stdout.write(chalk.gray('Use ?{term} to look up a specific definition, ?? to get the full context\n' +
            'Use :clear to clear console, :reset to restart repl, .editor to enter multiline\n'));
    }

    static clear() {
        process.stdout.write('\u001B[2J\u001B[0;0f');
    }

    async run() {
        const {flags} = this.parse(Repl);
        Repl.welcome();
        const conf = configService.config;
        const envs = conf.get('envs');
        const defaultEnv = flags.env || conf.get('defaultEnv');
        const env = envs[defaultEnv];
        if (env == null) {
            cli.error(`Failed to get environment for "${defaultEnv}"\nPlease check your config or --env value`);
        }
        const {API_BASE: nodeUrl, CHAIN_ID: chainId, SEED: seed} = env;
        const address = libs.crypto.address(seed, chainId);
        const settings = {nodeUrl, chainId, address};
        const {evaluate, info, totalInfo, clear: clearContext} = compiler(settings);
        repl.start({
            prompt, completer,
            eval: async function (this, input, context, filename, cb) {
                input = input.trim();
                let match = null;
                if (input === '') {
                    this.displayPrompt();
                    return;
                }
                // Info: "?{functionName}"
                else if ((match = input.match(/^\?[ \t]*([a-zA-Z0-9_-]*)$/m)) != null) {
                    Repl.print(this, infoData[match[1]] ? infoData[match[1]] : info(match[1]));
                }
                // FullInfo: "??"
                else if (input.match(/^\?\?$/m) != null) {
                    Repl.print(this, totalInfo());
                }
                // Custom command: ":{commandName}"
                else if ((match = input.match(/^:([a-zA-Z0-9_-]*)$/m)) != null) {
                    const cmd = match[1];
                    switch (cmd) {
                        case 'reset':
                            Repl.clear();
                            clearContext();
                            Repl.welcome();
                            this.displayPrompt();
                            break;
                        case 'clear':
                            Repl.clear();
                            this.displayPrompt();
                            break;
                        default:
                            Repl.print(this, `Unknown command "${cmd}"`);
                    }
                } else {
                    evaluate(input)
                        .then(res => {
                            if ('result' in res) {
                                if (typeof res.result === 'string') {
                                    Repl.print(this, res.result);
                                } else {
                                    cb(null, res.result);
                                }
                            } else if ('error' in res) Repl.print(this, chalk.red(res.error));
                        }).catch(e => Repl.print(this, chalk.red(e.toString())));
                }
            }
        });
    }
}
