import * as fs from 'fs';
import { Provider as Nconf } from 'nconf';
import { generateMnemonic } from 'bip39';
import { IConfig as IOclifConfig } from '@oclif/config';
import Mocha from 'mocha';
import { libs } from '@waves/waves-transactions';

export interface IEnv {
    API_BASE: string
    CHAIN_ID: string
    SEED: string
    timeout: number
}

export interface IConfig {
    ride_directory: string
    test_directory: string
    envs: {
        testnet: IEnv,
        custom: IEnv
    }
    defaultEnv: string
    mocha: Mocha.MochaOptions
}

export const systemConfig: IConfig = {
    ride_directory: 'ride',
    test_directory: 'test',
    envs: {
        custom: {
            API_BASE: 'http://localhost:6869/',
            CHAIN_ID: 'R',
            SEED: 'waves private node seed with waves tokens',
            timeout: 60000
        },
        testnet: {
            API_BASE: 'https://nodes-testnet.wavesnodes.com/',
            CHAIN_ID: 'T',
            SEED: 'testnet seed placeholder',
            timeout: 60000
        }
    },
    defaultEnv: 'custom',
    mocha: {
        timeout: 60000
    }
};


class ConfigService {
    oclifConfig?: IOclifConfig;

    initialize(oclifConfig: IOclifConfig) {
        this.oclifConfig = oclifConfig;
        const globalConfPath = this.getConfigPath('globalConfig');

        if (!fs.existsSync(globalConfPath)) {
            fs.writeFileSync(globalConfPath, JSON.stringify(this.generateConfig(), null, 4));
        }
    }

    getConfigPath = (configName: 'globalConfig' | 'localConfig') => {

        const workingDirPath: string = process.cwd()!;

        const CONFIG_NAME_PATH_MAP: { [key: string]: string } = {
            globalConfig: `${this.oclifConfig && this.oclifConfig.root}/lib/surfboard.config.json`,
            localConfig: `${workingDirPath}/surfboard.config.json`
        };

        return CONFIG_NAME_PATH_MAP[configName];
    };

    updateConfig = async (
        configName: 'globalConfig' | 'localConfig',
        key: string,
        value: string
    ) => {
        const nconf = new Nconf();

        const configFilePath = this.getConfigPath(configName);

        if (!fs.existsSync(configFilePath)){
            throw new Error(`Failed to get ${configName} at ${configFilePath}`);
        }

        nconf.file(configName, {file: configFilePath});

        if (nconf.get(key)) {
            nconf.set(key, value);

            nconf.save('');

            return `${configName} was updated successfully`;
        } else {
            throw new Error(`Option ${key} is not found in config file`);
        }
    };

    private generateConfig(): IConfig {
        const testnetSeed = generateMnemonic();
        const config = JSON.parse(JSON.stringify(systemConfig));
        config.envs.testnet.SEED = testnetSeed;
        return config;
    }

    createLocalConfigFile = () => {
        const localConfigFilePath = this.getConfigPath('localConfig');
        const config = this.generateConfig();
        const seed = config.envs.testnet.SEED;
        const addr = libs.crypto.address(seed, 'T');
        console.log(`❗️Generated new local config\nTestnet seed="${seed}"\nTestnet address="${addr}"❗`);
        fs.writeFileSync(localConfigFilePath, JSON.stringify(config, null, 4));
    };

    getConfig(configName: 'globalConfig' | 'localConfig') {
        const nconf = new Nconf();

        const configPath = this.getConfigPath(configName);

        if (fs.existsSync(configPath)) {
            nconf.defaults({type: 'file', file: configPath});
            return nconf;
        } else {
            return {error: `Failed to get ${configName} at ${configPath}`};
        }

    }

    get config() {
        const nconf = new Nconf();

        const globalConfPath = this.getConfigPath('globalConfig');
        const localConfPath = this.getConfigPath('localConfig');

        if (fs.existsSync(globalConfPath)) {
            nconf.defaults({type: 'file', file: globalConfPath}); //global config
        } else {
            nconf.defaults({type: 'literal', store: systemConfig}); //system config
        }

        if (fs.existsSync(localConfPath)) {
            nconf.defaults({type: 'file', file: localConfPath}); //local config
        }

        return nconf;
    }
}

const configService = new Proxy(new ConfigService(), {
    get: (target, p) => {
        if (p !== 'initialize' && !target.oclifConfig) {
            throw new Error('Config service has not been initialized');
        }
        return (target as any)[p];
    }
});

export default configService;
