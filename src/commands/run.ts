import * as fs from 'fs';
import * as path from 'path';
import { Command } from '@oclif/command';
import * as flags from '@oclif/command/lib/flags';
import { addEnvFunctionsToGlobal } from '@waves/js-test-env';
import configService from '../services/config';

import { parseVariables } from '../utils';

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
        const scriptContent = fs.readFileSync(scriptPath, 'utf8');
        const config = configService.config;
        console.log(flags);
        const variables = flags.variables == null ? {} : parseVariables(flags.variables);
        let configEnv = config.get('envs:' + config.get( flags.env || 'defaultEnv'));

        // setup environment
        addEnvFunctionsToGlobal(global);
        (global as any).env = {};
        Object.assign(global.env, configEnv, variables);

        eval(scriptContent);
    }
}
