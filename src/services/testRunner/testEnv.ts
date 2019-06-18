import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as envFuncs from '@waves/js-test-env';

chai.use(chaiAsPromised);

const injectTestEnvironment = (context: any) => {
    context.env = {};

    context.expect = chai.expect;

    context.compileTest = (test: string) => {
        try {
            context.eval(test);
        } catch (e) {
            console.error(e);
        }

        return context.mocha;
    };

    // add all env functions
    Object.entries(envFuncs).forEach(([name, val]) => context[name] = val);
    (envFuncs as any).context = context;
};

export {
    injectTestEnvironment
};
