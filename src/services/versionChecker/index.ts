import latestVersion from 'latest-version';
import chalk from 'chalk';
import { prompt } from '../../commands/repl';
import boxen from 'boxen';

export default async function checkVersion(name: string, version: string, id?: string) {
    const options = version.includes('beta') ? {version: 'beta'} : undefined;
    const {red, green, blue} = chalk;
    latestVersion(name, options).then(currentVersion => {
        if (currentVersion !== version && id !== 'readme') {
            console.log(`${id === 'repl' ? '\n' : ''}\n`);
            console.log(
                boxen(`Update available ${red(version)} → ${green(currentVersion)}\n` +
                    `Run ${blue(`npm i -g @waves/surfboard${version.includes('beta') ? '@beta' : ''}`)} to update`,
                    {borderColor: 'red', padding: 2, margin: 1})
            );
            console.log(id === 'repl' ? `\n${prompt}` : '');
        }
    }).catch(() => {
    });
}
