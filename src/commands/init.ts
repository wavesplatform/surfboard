import * as fs from 'fs';
import * as path from 'path';
import { Command } from '@oclif/command';
import * as inquirer from 'inquirer';
import cli from 'cli-ux';
import { downloadHttps } from '../utils';

import configService from '../services/config';
import { deployScriptSample } from '../examples';

export default class Init extends Command {
    static description = 'initialize new Ride project';

    private initWorkingDir = async () => {
        cli.action.start('Project initialization');

        const workingDirPath = process.cwd();
        const rideDirPath = path.join(workingDirPath, configService.config.get('ride_directory'));
        const testDirPath = path.join(workingDirPath, configService.config.get('test_directory'));
        const scriptsDirPath = path.join(workingDirPath, 'scripts');

        configService.createLocalConfigFile();

        fs.mkdirSync(rideDirPath, {recursive: true});
        const rideUrl = 'https://raw.githubusercontent.com/wavesplatform/ride-examples/master/ride4dapps/wallet/ride/wallet.ride';
        const rideFilePath = path.join(rideDirPath, 'wallet.ride');
        try {
            await downloadHttps(rideUrl, rideFilePath);
        } catch (e) {
            console.error('Failed to download ride example file');
        }

        fs.mkdirSync(testDirPath, {recursive: true});
        const testUrl = 'https://raw.githubusercontent.com/wavesplatform/ride-examples/master/ride4dapps/wallet/test/wallet.js';
        const testFilePath = path.join(testDirPath, 'wallet.ride-test.js');
        try {
            await downloadHttps(testUrl, testFilePath);
        } catch (e) {
            console.error('Failed to download test example file');
        }

        fs.mkdirSync(scriptsDirPath, {recursive: true});
        cli.action.stop();
        const deployFilePath = path.join(scriptsDirPath, 'wallet.deploy.js');
        fs.writeFileSync(deployFilePath, deployScriptSample)
    };

    run = async () => {
        const workingDirPath = process.cwd();

        const workingDirContent: string[] = fs.readdirSync(workingDirPath);

        if (workingDirContent.length) {
            this.warn(`
        This directory is non-empty. 
        Configuration file and content of ride or test directories could be overwritten.
    `);

            let responses: any = await inquirer.prompt([{
                name: 'shouldInitialize',
                message: 'Continue project initialization anyway?',
                type: 'confirm',
                default: false
            }]);

            if (responses.shouldInitialize) {
                await this.initWorkingDir();
            } else {
                this.log('Project initialization is cancelled');
            }
        } else {
            await this.initWorkingDir();
        }
    };
}

