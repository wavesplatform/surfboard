import * as path from 'path';
import { Command } from '@oclif/command';
import * as flags from '@oclif/command/lib/flags';
import configService from '../services/config';

import { getFileContent, parseVariables } from '../utils';
import { injectTestEnvironment } from '../services/testRunner/testEnv';

export default class Run extends Command {
    static description = 'run js script with with blockchain context';

    static args = [
        {
            name: 'file',
            description: 'path to script',
            required: true
        }
    ];

    static flags = {
        variables: flags.string({
            description: 'env variables can be set for usage in script via env.{variable_name}. ' +
                'E.g.: MY_SEED="seed phraze",DAPP_ADDRESS="xyz"',
        }),
        env: flags.string({
            description: 'which environment should be used'
        }),
    };

    async run() {
        const {args, flags} = this.parse(Run);
        const scriptPath = path.resolve(process.cwd(), args.file);
        const config = configService.config;
        const variables = flags.variables == null ? {} : parseVariables(flags.variables);
        let configEnv = config.get('envs:' + (flags.env ||  config.get('defaultEnv')));

        // setup environment

        let env = Object.assign({
            file: getFileContent
        }, configEnv, variables);
        injectTestEnvironment(global, {env});

        // Run script via requiring it
        require(scriptPath);
    }
}
