import * as fs from 'fs';
import recursive from 'recursive-readdir';
import * as path from 'path';

import { Command } from '@oclif/command';
import * as flags from '@oclif/command/lib/flags';

import configService, { systemConfig } from '../services/config';
import TestRunner from '../services/testRunner';
import { parseVariables } from '../utils';
import { cli } from 'cli-ux';

const varsFlag = flags.build({});
export default class Test extends Command {
    static description = 'run test';

    static args = [
        {
            name: 'file',
            description: 'path to test file'
        }
    ];

    static flags = {
        variables: flags.string({
            description: 'env variables can be set for usage in tests via env.{variable_name}. ' +
                'E.g.: MY_SEED="seed phraze",DAPP_ADDRESS=xyz, AMOUNT=1000',
        }),
        env: flags.string({
            description: 'which environment should be used for test'
        }),
        verbose: flags.boolean({
            char: 'v',
            description: 'logs all transactions and node responses'
        }),

    };

    async run() {
        const {args} = this.parse(Test);

        const {flags} = this.parse(Test);

        const variables = flags.variables == null ? {} : parseVariables(flags.variables);

        const testRunnerService = TestRunner.getInstance();

        const workingDirPath: string = process.cwd();
        const testDirPath = path.join(workingDirPath, configService.config.get('test_directory'));

        if (args.file) {
            const filePath = path.join(testDirPath, args.file);

            if (fs.existsSync(filePath)) {
                testRunnerService.addFile(filePath);
            } else {
                this.error('Test file was not found');
            }
        } else {
            if (fs.existsSync(testDirPath)) {
                const files = await recursive(testDirPath);

                files
                    .filter((file: string) => path.extname(file) === '.js')
                    .forEach((file: string) => testRunnerService.addFile(file));
            } else {
                this.error('directory with test files does not exists');
            }
        }

        await testRunnerService.run({envName: flags.env, verbose: flags.verbose, variables});

    }
}
