import * as fs from 'fs';
import { Provider as Nconf } from 'nconf';
import { generateMnemonic } from 'bip39';
import { IConfig as IOclifConfig } from '@oclif/config';
import Mocha from 'mocha';

interface IEnv {
  API_BASE: string
  CHAIN_ID: string
  SEED?: string
  accounts?: string[]
}

interface IConfig {
  ride_directory: string
  test_directory: string
  env: IEnv,
  mocha: Mocha.MochaOptions
}

const systemConfig: IConfig = {
  ride_directory: 'ride',
  test_directory: 'test',
  env: {
    API_BASE: 'https://testnodes.wavesnodes.com/',
    CHAIN_ID: 'T',
  },
  mocha: {
    timeout: 20000
  }
};

class Config {
  private oclifConfig: IOclifConfig;
  
  private static instance: Config;

  private constructor(oclifConfig: IOclifConfig) {
    this.oclifConfig = oclifConfig;
    
    const globalConfigFilePath = this.getConfigPath('globalConfig');

    if (!fs.existsSync(globalConfigFilePath)) {      
      fs.writeFileSync(globalConfigFilePath, JSON.stringify(systemConfig));
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

  getConfigPath = (configName: 'globalConfig' | 'localConfig') => {
    const workingDirPath: string = process.cwd()!;

    const CONFIG_NAME_PATH_MAP: { [key: string]: string }  = {
      globalConfig: `${this.oclifConfig.root}/lib/waves-dev-cli-config.json`,
      localConfig: `${workingDirPath}/waves-dev-cli-config.json`
    };

    return CONFIG_NAME_PATH_MAP[configName];
  }

  updateConfig = async (
    configName: 'globalConfig' | 'localConfig',
    key: string,
    value: string
  ) => {
    const nconf = new Nconf();

    const configFilePath = this.getConfigPath(configName);

    nconf.file(configName, { file: configFilePath });

    if (nconf.get(key)) {
      nconf.set(key, value);

      nconf.save('');

      return `${configName} was updated successfully`;
    } else {
      throw new Error(`Option ${key} is not found in config file`);
    }
  }

  createLocalConfigFile = () => {
    const nconf = new Nconf();

    const localConfigFilePath = this.getConfigPath('localConfig');

    fs.writeFileSync(localConfigFilePath, JSON.stringify(systemConfig));

    nconf.file('localConfig', localConfigFilePath);

    const seeds = this.generateNSeeds(5);

    nconf.set('env:SEED', seeds[0]);
    // nconf.set('env:accounts', seeds);

    nconf.save('');
  };

  getConfig(configName: 'globalConfig' | 'localConfig') {
    const nconf = new Nconf();

    const configPath = this.getConfigPath(configName);

    if (fs.existsSync(configPath)) {
      nconf.defaults({ type: 'file', file: configPath });
    }

    return nconf;
  }

  get config() {
    const nconf = new Nconf();

    const globalConfigFilePath = this.getConfigPath('globalConfig');
    const localConfigFilePath = this.getConfigPath('localConfig');

    if (fs.existsSync(globalConfigFilePath)) {
      nconf.defaults({ type: 'file', file: globalConfigFilePath }); //global config
    } else {
      nconf.defaults({ type: 'literal', store: systemConfig }); //system config
    }

    if (fs.existsSync(localConfigFilePath)) {
      nconf.defaults({ type: 'file', file: localConfigFilePath }); //local config
    }

    return nconf;
  }
}

export default Config;

export {
  systemConfig
};

// private createLocalConfigFile = () => {
//   const workingDirPath = process.cwd();

//   const seeds = this.generateNSeeds(5);

//   const config = `
//     module.exports = {
//       ride_directory: 'ride',
//       test_directory: 'test',
//       env: {
//         API_BASE: 'https://testnodes.wavesnodes.com/',
//         CHAIN_ID: 'T',
//         SEED: '${seeds[0]}',
//         accounts: [
//           '${seeds[0]}',
//           '${seeds[1]}'
//         ]
//       }
//     };
//   `;

//   fs.appendFileSync(`${workingDirPath}/waves-dev-cli-config.js`, config);
// };
