import repl, { REPLServer } from 'repl';
import { getFunctionsDoc, getTypes, repl as compiler, version } from '@waves/ride-js';
import { Command } from '@oclif/command';
import { libs } from '@waves/waves-transactions';
import chalk from 'chalk';
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

function print(repl: REPLServer, str: string) {
    console.log(str);
    repl.displayPrompt();
}

function completer(line: string) {
    let match = null;
    if ((match = line.match(/^\?[ \t]*([a-zA-Z0-9_-]*)$/m)) != null) line = match[1];
    const completions: string[] = [
        ...getTypes(3).map(({name}) => name.split('|')).reduce((acc, val) => acc.concat(val), []),
        ...getFunctionsDoc(3).map(({name}) => name)
    ].filter((item, i, arr) => arr.indexOf(item) === i);

    const hits = completions.filter((c) => c.startsWith(line));
    return [hits.length ? hits : completions, line];
}

export default class extends Command {
    static description = 'run ride repl';

    async run() {
        process.stdout.write(chalk.bold(`Welcome to RIDE repl\nCompiler version ${version}\n`));
        const localConfig = configService.getConfig('localConfig');
        let settings;
        if ('stores' in localConfig) {
            const {defaultEnv, envs} = localConfig.stores.defaults.store;
            const {API_BASE: nodeUrl, CHAIN_ID: chainId, SEED: seed} = envs[defaultEnv];
            const address = libs.crypto.address(seed, chainId);
            settings = {nodeUrl, chainId, address};
        }
        const {evaluate, info, totalInfo} = settings ? compiler(settings) : compiler();
        repl.start({
            prompt, completer,
            eval: async function (input, context, filename, cb) {
                input = input.trim();
                let match = null;
                if (input === '') {
                    this.displayPrompt();
                    return;
                } else if ((match = input.match(/^\?[ \t]*([a-zA-Z0-9_-]*)$/m)) != null) {
                    print(this, info(match[1]));
                } else if (input.match(/^\?\?$/m) != null) {
                    print(this, totalInfo());
                } else {
                    evaluate(input)
                        .then(res => {
                            if ('result' in res) {
                                if (typeof res.result === 'string') {
                                    print(this, res.result);
                                } else {
                                    cb(null, res.result);
                                }
                            } else if ('error' in res) print(this, chalk.red(res.error));
                        }).catch(e => print(this, chalk.red(e.toString())));
                }
            }
        });
    }
}
