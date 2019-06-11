import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as envFuncs from './envFuncs';

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

    context = {...context, ...envFuncs};
};

export {
    injectTestEnvironment
};
