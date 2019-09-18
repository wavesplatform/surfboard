import { Hook } from '@oclif/config';
import checkVersion from '../../services/versionChecker';

const hook: Hook<'init'> = async function (opts) {
    const {name, version} = opts.config;
    checkVersion(name, version, opts.id);
};

export default hook;
