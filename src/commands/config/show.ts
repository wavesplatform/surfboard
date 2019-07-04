import Command, { flags } from '@oclif/command';
import cli from 'cli-ux';
import configService from '../../services/config';

export default class Show extends Command {
    static description = 'show config';

    static flags = {
        global: flags.boolean({
            char: 'g',
            description: 'Show global config'
        })
    };

    static args = [
        {
            name: 'key',
            description: 'Config option key in dot notation'
        }
    ];

    async run() {
        const {args, flags} = this.parse(Show);

        const configName = flags.global
            ? 'globalConfig'
            : 'localConfig';

        const config = configService.getConfig(configName);

        if ('error' in config) {
            cli.error(config.error);
            return;
        }
        cli.styledHeader(configName);


        let result;
        if (args.key) {
            const key = args.key.replace(/\./g, ':');
            result = config.get(key);
        } else {
            result = config.get();
        }

        if (result === undefined) {
            cli.error(`Failed to get key:"${args.key}" from config`);
        }

        cli.styledJSON(result);
    }
}
