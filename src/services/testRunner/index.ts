import Mocha from 'mocha';
import * as fs from 'fs';
import * as path from 'path';

import Config from '../config';
import dockerNode from '../dockerNode';
import { injectTestEnvironment } from './testEnv';

export class TestRunner {
    private mocha: Mocha;

    private static instance: TestRunner;

    constructor(mochaOptions: Mocha.MochaOptions) {
        const configService = Config.getInstance();

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
            const configService = Config.getInstance();

            const mochaOptions = configService.config.get('mocha') as Mocha.MochaOptions;

            TestRunner.instance = new TestRunner(mochaOptions);
        }

        return TestRunner.instance;
    }

    getContractFile = (fileName: string) => {
        const configService = Config.getInstance();

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

    public async run(network: 'testnet' | 'mainnet' | 'docker') {
        const configService = Config.getInstance();
        const config = configService.config;


        global.env = {
            file: this.getContractFile,
            ...config.get(network).env
        };


        let failed = true;
        try {
            if (network === 'docker') {
                console.log('Starting docker container');
                await dockerNode.startContainer();
                console.log('Container started');
            }

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
            console.error(e)
        } finally {
            console.log('Stopping docker container');
            await dockerNode.stopContainer();
            console.log('Container stopped');
            if (failed) process.exit(2);
        }
    }
}

export default TestRunner;
