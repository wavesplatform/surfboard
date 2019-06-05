import { Hook } from '@oclif/config';

import Config from '../services/config';
import TestRunner from '../services/testRunner';

const hook: Hook<'init'> = async function (options) {  
  Config.getInstance(options.config);

  TestRunner.getInstance();
};

export default hook;
