import * as fs from 'fs';
import * as path from 'path';
import { Command } from '@oclif/command';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';

import { rideExamples, testExamples } from '../services/library';
import Config from '../services/config';
import * as flags from '@oclif/command/lib/flags';

export default class Init extends Command {
    static description = 'Initialize new Ride project';

    static flags = {
        docker: flags.boolean({
            char: 'd',
            description: 'init with config for "https://hub.docker.com/r/msmolyakov/waves-private-node" docker node'
        })
    };

    private initWorkingDir = (config: 'default' | 'docker') => {
        cli.action.start('Project initialization');

        const configService = Config.getInstance();

        const workingDirPath = process.cwd();
        const rideDirPath = path.join(workingDirPath, configService.config.get('ride_directory'));
        const testDirPath = path.join(workingDirPath, configService.config.get('test_directory'));

        configService.createLocalConfigFile(config);

        fs.mkdirSync(rideDirPath, {recursive: true});
        fs.appendFileSync(`${rideDirPath}/fomo.ride`, rideExamples.fomo);

        fs.mkdirSync(testDirPath, {recursive: true});
        fs.appendFileSync(`${testDirPath}/basic.js`, testExamples.basic);

        cli.action.stop();
    };

    run = async () => {
        const {flags} = this.parse(Init);
        const workingDirPath = process.cwd();

        const workingDirContent: string[] = fs.readdirSync(workingDirPath);

        if (workingDirContent.length) {
            this.warn(`
        This directory is non-empty. 
        waves-dev-cli-config file and content of ride and test directory can be rewritten.
    `);

            let responses: any = await inquirer.prompt([{
                name: 'shouldInitialize',
                message: 'Continue project initialization anyway?',
                type: 'confirm',
                default: false
            }]);

            if (responses.shouldInitialize) {
                this.initWorkingDir(flags.docker ? 'docker' : 'default');
            } else {
                this.log('Project initialization is cancelled');
            }
        } else {
            this.initWorkingDir(flags.docker ? 'docker' : 'default');
        }
    };
}
