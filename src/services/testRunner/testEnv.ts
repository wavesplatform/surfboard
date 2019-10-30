import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cli from 'cli-ux';
import axios from 'axios';
import { libs } from '@waves/waves-transactions';
import augment, { TSetupAccountsFunc } from '@waves/js-test-env/augment';
import { NETWORKS } from '../../constants';

chai.use(chaiAsPromised);

const injectTestEnvironment = (context: any, {verbose, env}: any) => {

    context.env = env;

    context.expect = chai.expect;

    context.compileTest = (test: string) => {
        try {
            context.eval(test);
        } catch (e) {
            console.error(e);
        }

        return context.mocha;
    };

    augment(context, {broadcastWrapper: verbose && broadcastWrapper, setupAccountsWrapper});
};

const checkOnlineUrl = async (url: string) => {
    try {
        await axios.get(url);
        return true;
    } catch (e) {
        return false;
    }
};

const setupAccountsWrapper: (x: TSetupAccountsFunc) => TSetupAccountsFunc = f => async (...args) => {
    const accs = await f(...args);
    const network = Object.values(NETWORKS).find(n => n.chainId === global.env.CHAIN_ID);
    if (network) {
        if ((network === NETWORKS.PRIVATE && !(await checkOnlineUrl(network.explorer)))) {
            cli.log('\nFailed to get local explorer\nExecute this:\n' +
                'docker run -d -e API_NODE_URL=http://localhost:6869 -e NODE_LIST=http://localhost:6869 -p 3000:8080 wavesplatform/explorer\n');
        } else {
            cli.log('\nExplorer links');
            Object.entries(accs).forEach(([name, seed]) =>
                cli.log(`${name}: ${network.explorer}/address/${libs.crypto.address(seed, network.chainId)}`));
            cli.log('\n');

        }
    }
    return accs;
};
const broadcastWrapper = (f: any) => async (tx: any, ...args: any) => {
    cli.log('\nSending transaction to node:');
    cli.styledJSON(tx);
    try {
        const resp = await f(tx, ...args);
        cli.log('Node responded with:');
        cli.styledJSON(resp);
        return resp;
    } catch (e) {
        cli.log('\nNode responded with:');
        cli.styledJSON(e);
        throw e;
    }
};

export {
    injectTestEnvironment
};
