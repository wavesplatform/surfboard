import { Command } from '@oclif/command';
import cli from 'cli-ux';
import { compile, ICompilationResult } from '@waves/ride-js';
import * as flags from '@oclif/command/lib/flags';

import { getFileContent } from '../utils';

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

    private compile = async (file: string): Promise<ICompilationResult> => {
        const resultOrError = compile(file, 3);

        if ('error' in resultOrError) {
            throw new Error(resultOrError.error);
        }

        return resultOrError;
    };

    async run() {
        const {args} = this.parse(Compile);
        const {flags} = this.parse(Compile);

        if (args.file) {
            let file;
            try {
                file = getFileContent(args.file);
            } catch (error) {
                this.error(error.message);
            }
            if (file) {
                this.compile(file)
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
}
