import latestVersion from 'latest-version';
import chalk from 'chalk';
import { prompt } from '../../commands/repl';
import boxen from 'boxen';

export default async function checkVersion(name: string, version: string, id?: string) {
    // const config = configService.getConfig('globalConfig');
    // if (!('error' in config)) {
    // const lastUpdate = config.stores.defaults.store.last_update;
    // const now = new Date().getTime()
    // if ((now - lastUpdate) / (36 * 1e5) > 24) {
    latestVersion(name, {version: version.includes('beta') ? 'beta' : undefined}).then(currentVersion => {
        if (currentVersion !== version) {
            console.log(`${id === 'repl' ? '\n' : ''}\n`);
            console.log(
                boxen(`Update available ${chalk.red(version)} → ${chalk.green(currentVersion)}\n` +
                    `Run ${chalk.blue('npm i -g @waves/surfboard@beta')} to update`,
                    {borderColor: 'red', padding: 2, margin: 1})
            );
            console.log(id === 'repl' ? `\n${prompt}` : '');
        }
    }).catch(() => {
    });

    // await configService.updateConfig('globalConfig', 'last_update', now.toString());

    // }
    // }
}

    `



`;
