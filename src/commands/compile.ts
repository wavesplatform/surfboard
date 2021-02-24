import { Command } from '@oclif/command';
import cli from 'cli-ux';
import { compile, ICompilationResult, scriptInfo } from '@waves/ride-js';
import * as flags from '@oclif/command/lib/flags';

import { getFileContent, getLibContent } from '../utils';

export default class Compile extends Command {
    static description = 'compile ride file';

    static args = [
        {
            name: 'file',
            description: 'path to ride file',
            required: true
        }
    ];

    static flags = {
        fullInfo: flags.boolean({
            description: 'outputs JSON with additional info. Such as complexity, size etc.'
        })
    };

    private compile = async (filePath: string): Promise<ICompilationResult> => {
        let file = '';
        try {
            file = getFileContent(filePath);
        } catch (error) {
            this.error(error.message);
        }

        // if (file) {
        const info = scriptInfo(file);
        if ('error' in info) throw 'invalid scriptInfo';
        const {imports} = info;
        let libs = {} as Record<string, string>;
        imports.forEach(path => libs[path] = getLibContent(filePath, path))

        const resultOrError = compile(file, 3, libs);

        if ('error' in resultOrError) {
            throw new Error(resultOrError.error);
        }

        return resultOrError;
        // }
    };

    async run() {
        const {args} = this.parse(Compile);
        const {flags} = this.parse(Compile);

        if (args.file) {
            this.compile(args.file)
                .then((result: ICompilationResult) => {
                    if (flags.fullInfo) {
                        cli.styledJSON({
                            base64: result.result.base64,
                            size: result.result.size,
                            complexity: result.result.complexity
                        });
                    } else {
                        cli.log(result.result.base64);
                    }
                })
                .catch((error: Error) => {
                    cli.styledHeader(`${args.file} was not compiled`);

                    console.error('Error message:', error.message);
                });
        }
    }
}
