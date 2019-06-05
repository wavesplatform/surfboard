import { Command } from '@oclif/command';
import cli from 'cli-ux';
import { compile } from '@waves/ride-js';

import TestRunner from '../services/testRunner';

export default class Test extends Command {
  static description = 'copile ride file';

  static args = [
    {
      name: 'file',
      description: 'path to ride file',
      required: true
    }
  ];

  private compile = async (file: string) => {
    const resultOrError = compile(file);

    if ('error' in resultOrError) {
      throw new Error(resultOrError.error);
    }

    return resultOrError.result.base64;
  }

  async run() {
    const { args } = this.parse(Test);

    const testRunnerService = TestRunner.getInstance();
  
    if (args.file) {
      let file;

      try {
        file = testRunnerService.getContractFile(args.file);
      } catch (error) {
        this.error(error.message);
      }

      if (file) {
        this.compile(file)
          .then((base64: string) => { 
            cli.styledHeader(`${args.file} compiled succesfully`);

            cli.styledJSON(base64);
          })
          .catch((error: Error) => {
            cli.styledHeader(`${args.file} was not compiled`);

            console.error('Error message:', error.message);
          });
      }
    }
  }
}
