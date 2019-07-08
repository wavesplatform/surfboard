import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
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
    console.log('Sending transactions to node');
    console.log(tx);
    const resp = await f(tx, ...args);
    console.log('Node responded with');
    console.log(resp);
    return resp;
};

export {
    injectTestEnvironment
};
