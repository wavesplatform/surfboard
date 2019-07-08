import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cli from 'cli-ux';
import { addEnvFunctionsToGlobal } from '@waves/js-test-env';

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

    addEnvFunctionsToGlobal(context, {broadcastWrapper: verbose && broadcastWrapper});
};


const broadcastWrapper = (f: any) => async (tx: any, ...args: any) => {
    cli.log('\nSending transaction to node:')
    cli.styledJSON(tx)
    try {
        const resp = await f(tx, ...args);
        cli.log('Node responded with:');
        cli.styledJSON(resp);
        return resp;
    }catch (e) {
        cli.log('\nNode responded with:');
        cli.styledJSON(e);
        throw e;
    }
};

export {
    injectTestEnvironment
};
