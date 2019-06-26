import * as fs from 'fs';
import { Provider as Nconf } from 'nconf';
import { generateMnemonic } from 'bip39';
import { IConfig as IOclifConfig } from '@oclif/config';
import Mocha from 'mocha';

interface IEnv {
    API_BASE: string
    CHAIN_ID: string
    SEED: string
    timeout: number
}

interface IConfig {
    ride_directory: string
    test_directory: string
    testnet: {
        env: IEnv
    },
    mainnet: {
        env: IEnv
    },
    docker: {
        env: IEnv,
        image: string
        blockTime: number,
    },
    mocha: Mocha.MochaOptions
}

const systemConfig: IConfig = {
    ride_directory: 'ride',
    test_directory: 'test',
    testnet: {
        env: {
            API_BASE: 'https://testnodes.wavesnodes.com/',
            CHAIN_ID: 'T',
            SEED: 'testnet seed placeholder',
            timeout: 60000
        }
    },
    mainnet: {
        env: {
            API_BASE: 'https://nodes.wavesplatform.com/',
            CHAIN_ID: 'W',
            SEED: 'mainnet seed placeholder',
            timeout: 60000
        }
    },
    docker: {
        env: {
            API_BASE: 'http://localhost:6869/',
            CHAIN_ID: 'R',
            SEED: 'rich',
            timeout: 60000
        },
        blockTime: 10000,
        image: 'msmolyakov/waves-private-node'
    },
    mocha: {
        timeout: 60000
    }
};

class Config {
    private oclifConfig: IOclifConfig;

    private static instance: Config;

    private constructor(oclifConfig: IOclifConfig) {
        this.oclifConfig = oclifConfig;

        const globalConfigFilePath = this.getConfigPath('globalConfig');

        if (!fs.existsSync(globalConfigFilePath)) {

            const newGlobalConfig = this.generateConfig();
            console.log(`❗️Generated new global config
Testnet seed="${newGlobalConfig.testnet.env.SEED}"
Mainnet seed="${newGlobalConfig.mainnet.env.SEED}"❗`);
            fs.writeFileSync(globalConfigFilePath, JSON.stringify(newGlobalConfig, null, 4));
        }
    }

    public static getInstance(oclifConfig?: IOclifConfig): Config {// singleton
        if (oclifConfig && !Config.instance) {
            Config.instance = new Config(oclifConfig);
        }

        return Config.instance;
    }

    private generateNSeeds = (N: number) => {
        return Array(N).fill(N).map(() => {
            return generateMnemonic();
        });
    };

    private generateConfig(): IConfig {
        const [mainnetSeed, testnetSeed] = this.generateNSeeds(2);
        const config = JSON.parse(JSON.stringify(systemConfig));
        config.testnet.env.SEED = testnetSeed;
        config.mainnet.env.SEED = mainnetSeed;
        return config;
    }

    getConfigPath = (configName: 'globalConfig' | 'localConfig') => {
        const workingDirPath: string = process.cwd()!;

        const CONFIG_NAME_PATH_MAP: { [key: string]: string } = {
            globalConfig: `${this.oclifConfig.root}/lib/surfboard.config.json`,
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

        nconf.file(configName, {file: configFilePath});

        if (nconf.get(key)) {
            nconf.set(key, value);

            nconf.save('');

            return `${configName} was updated successfully`;
        } else {
            throw new Error(`Option ${key} is not found in config file`);
        }
    };

    createLocalConfigFile = () => {
        const localConfigFilePath = this.getConfigPath('localConfig');
        const config = this.generateConfig();
        console.log(`❗️Generated new local config
Testnet seed="${config.testnet.env.SEED}"
Mainnet seed="${config.mainnet.env.SEED}"❗`);
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

        const globalConfigFilePath = this.getConfigPath('globalConfig');
        const localConfigFilePath = this.getConfigPath('localConfig');

        if (fs.existsSync(globalConfigFilePath)) {
            nconf.defaults({type: 'file', file: globalConfigFilePath}); //global config
        } else {
            nconf.defaults({type: 'literal', store: systemConfig}); //system config
        }

        if (fs.existsSync(localConfigFilePath)) {
            nconf.defaults({type: 'file', file: localConfigFilePath}); //local config
        }

        return nconf;
    }
}

export default Config;

export {
    systemConfig
};
