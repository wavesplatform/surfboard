import Command, { flags } from '@oclif/command';

import Config from '../../services/config';

export default class Change extends Command {
  static description = 'Change config';

  static flags = {
    global: flags.boolean({
      char: 'g',
      description: 'change global config'
    })
  };
  
  static args = [
    {
      name: 'key',
      description: 'config option key in dot notion',
      required: true
    },
    {
      name: 'value',
      description: 'config option value',
      required: true
    }
  ];

  async run() {
    const configService = Config.getInstance();

    const { args, flags } = this.parse(Change);

    if (args.key && args.value) {
      const configName = flags.global
        ? 'globalConfig'
        : 'localConfig';

      const key = args.key.replace(/\./g, ':'); // transform colon notion to dot notion. TODO move to service

      configService.updateConfig(configName, key, args.value)
        .then(res => this.log(res))
        .catch((error: Error) => this.log(error.message));
    }
  }
}
