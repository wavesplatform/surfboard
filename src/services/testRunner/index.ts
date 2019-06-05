import Mocha from 'mocha';
import * as fs from 'fs';
import * as path from 'path';

import Config from '../config';
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
  }

  public addFile(path: string) {
    this.mocha.addFile(path);
  }

  public async run() {    
    this.mocha.run();
  }
}

export default TestRunner;
