import Mocha from 'mocha';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import cli from 'cli-ux';
import url from 'url';
import { libs } from '@waves/waves-transactions';
import configService from '../config';
import { injectTestEnvironment } from './testEnv';

export class TestRunner {
    private mocha: Mocha;

    private static instance: TestRunner;

    constructor(mochaOptions: Mocha.MochaOptions) {
        this.mocha = new Mocha(mochaOptions);
    }

    public static getInstance(): TestRunner { // singleton
        if (!TestRunner.instance) {

            const mochaOptions = configService.config.get('mocha') as Mocha.MochaOptions;

            TestRunner.instance = new TestRunner(mochaOptions);
        }

        return TestRunner.instance;
    }

    getContractFile = (fileNameOrPath: string) => {
        const pathIfFileName = path.join(process.cwd(), configService.config.get('ride_directory'), fileNameOrPath);
        const pathIfPath = path.resolve(process.cwd(), fileNameOrPath);

        if (fs.existsSync(pathIfPath)) {
            return fs.readFileSync(pathIfPath, 'utf-8');
        }
        else if (fs.existsSync(pathIfFileName)) {
            return fs.readFileSync(pathIfFileName, 'utf8');
        }

        throw new Error(`File "${fileNameOrPath}" not found`);
    };

    getLibrariesSync = () => {
        const libsPath = path.join(process.cwd(), configService.config.get('libs_directory'));
        if (fs.existsSync(libsPath)) {
            return fs.readdirSync(libsPath, 'utf8')
                .filter(name => name !== '.DS_Store')
                .map((name) => {
                    return ({name, content: fs.readFileSync(path.join(libsPath, name), 'utf8')});
                });
        }
        return [];
    };


    public addFile(path: string) {
        this.mocha.addFile(path);
    }

    public async run({envName, verbose}: { envName?: string, verbose: boolean }) {
        const config = configService.config;


        if (envName == null) {
            envName = config.get('defaultEnv');
        }

        let env = config.get('envs:' + envName);
        if (env == null) cli.error(`Failed to get environment "${envName}"\n Check your if your config contains it`);
        await this.checkNode(url.parse(env.API_BASE).href);

        const envAddress = libs.crypto.address(env.SEED, env.CHAIN_ID);

        cli.log(`Starting test with "${envName}" environment\nRoot address: ${envAddress}`);
        env = {
            file: this.getContractFile,
            ...env
        };

        injectTestEnvironment(global, {verbose, env});

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
