import Command, { flags } from '@oclif/command';
import cli from 'cli-ux';

import Config from '../../services/config';

export default class Show extends Command {
  static description = 'show config';

  static flags = {
    global: flags.boolean({
      char: 'g',
      description: 'show global config'
    })
  };

  static args = [
    {
      name: 'key',
      description: 'config option key in dot notion'
    }
  ];
  
  async run() {
    const { args, flags } = this.parse(Show);

    const configService = Config.getInstance();

    const configName = flags.global
      ? 'globalConfig'
      : 'localConfig';

    const config = configService.getConfig(configName);

    cli.styledHeader(configName);

    if (args.key) {
      const key = args.key.replace(/\./g, ':');
      cli.styledJSON(config.get(key));
    } else {
      cli.styledJSON(config.get());
    }
  }
}
