import Mocha from 'mocha';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import cli from 'cli-ux';
import url from 'url';

import configService from '../config';
import dockerNode from '../dockerNode';
import { injectTestEnvironment } from './testEnv';

export class TestRunner {
    private mocha: Mocha;

    private static instance: TestRunner;

    constructor(mochaOptions: Mocha.MochaOptions) {

        const config = configService.config;

        this.mocha = new Mocha(mochaOptions);

        const env = {
            file: this.getContractFile,
            ...config.get('env')
        };

        injectTestEnvironment(global);

        global.env = env;
    }

    public static getInstance(): TestRunner { // singleton
        if (!TestRunner.instance) {

            const mochaOptions = configService.config.get('mocha') as Mocha.MochaOptions;

            TestRunner.instance = new TestRunner(mochaOptions);
        }

        return TestRunner.instance;
    }

    getContractFile = (fileName: string) => {
        let workingDirPath: string = process.cwd()!;

        const rideDirPath = path.join(workingDirPath, configService.config.get('ride_directory'));
        const filePath = `${rideDirPath}/${fileName}`;

        if (fs.existsSync(rideDirPath)) {
            if (fs.existsSync(filePath)) {
                return fs.readFileSync(filePath, 'utf8');
            } else {
                throw(new Error(`File with name ${fileName} was not found`));
            }
        } else {
            throw(new Error('There is no "ride" directory in working directory'));
        }
    };

    public addFile(path: string) {
        this.mocha.addFile(path);
    }

    public async run() {
        const config = configService.config;

        await this.checkNode(url.parse(configService.config.get('env:API_BASE')).href);

        global.env = {
            file: this.getContractFile,
            ...config.get('env')
        };


        let failed = true;
        try {
            const result = this.mocha.run();

            // wait for test to finish running
            await new Promise(resolve => {
                if (result.stats && result.stats.end !== undefined) resolve();
                result.once('end', resolve);
            });
            if (result.stats && result.stats.failures === 0) {
                failed = false;
            }
        } catch (e) {
            console.error(e);
        } finally {

            if (failed) process.exit(2);
        }
    }

    async checkNode(nodeUrl?: string) {
        try {
            await axios.get('node/version', {baseURL: nodeUrl});
        } catch (e) {
            cli.error(`Failed to access node on "${nodeUrl}"\n` +
                'Make sure env.API_BASE is correct\n' +
                'In case of using local node, make sure it is up and running!');
        }
    }
}

export default TestRunner;
