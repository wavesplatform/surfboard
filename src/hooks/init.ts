import { Hook } from '@oclif/config';

import configService from '../services/config';

const hook: Hook<'init'> = async function (options) {
    configService.initialize(options.config);
};

export default hook;
