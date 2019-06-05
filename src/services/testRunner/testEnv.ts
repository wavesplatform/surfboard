import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as wt from '@waves/waves-transactions';
import { compile as cmpl } from '@waves/ride-js';

const { keyPair, address } = wt.libs.crypto;

const {
  currentHeight, waitForHeight,
  waitForTxWithNConfirmations,
  waitNBlocks, balance, balanceDetails,
  accountData, accountDataByKey,
  assetBalance, waitForTx
} = wt.nodeInteraction;

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

  const withDefaults = (options: wt.nodeInteraction.INodeRequestOptions = {}) => ({
    timeout: options.timeout || 20000,
    apiBase: options.apiBase || context.env.API_BASE
  });

  const injectEnv = <T extends (pp: any, ...args: any) => any> (f: T) => 
    (po: wt.TTxParams, seed?: wt.TSeedTypes | null): ReturnType<typeof f> =>
      f(
        { chainId: context.env.CHAIN_ID, ...po },
        seed === null
            ? null
            : seed || context.env.SEED
      );

  const currentAddress = () => wt.libs.crypto.address(context.env.SEED, context.env.CHAIN_ID);

  context.waitForTx = async (txId: string, options?: wt.nodeInteraction.INodeRequestOptions) =>
    waitForTx(txId, withDefaults(options));

  context.waitForTxWithNConfirmations = async (
    txId: string,
    confirmations: number,
    options?: wt.nodeInteraction.INodeRequestOptions
  ) => waitForTxWithNConfirmations(txId, confirmations, withDefaults(options));

  context.waitNBlocks = async (blocksCount: number, options?: wt.nodeInteraction.INodeRequestOptions) =>
    waitNBlocks(blocksCount, withDefaults(options));

  context.currentHeight = async (apiBase?: string) => currentHeight(apiBase || context.env.API_BASE);

  context.waitForHeight = async (target: number, options?: wt.nodeInteraction.INodeRequestOptions) =>
    waitForHeight(target, withDefaults(options));

  context.balance = async (address?: string, apiBase?: string) =>
    balance(address || currentAddress(), apiBase || context.env.API_BASE);

  context.assetBalance = async (assetId: string, address?: string, apiBase?: string) =>
    assetBalance(assetId, address || currentAddress(), apiBase || context.env.API_BASE);

  context.balanceDetails = async (address?: string, apiBase?: string) =>
    balanceDetails(address || currentAddress(), apiBase || context.env.API_BASE);

  context.accountData = async (address?: string, apiBase?: string) =>
    accountData(address || currentAddress(), apiBase || context.env.API_BASE);

  context.accountDataByKey = async (key: string, address?: string, apiBase?: string) =>
    accountDataByKey(key, address || currentAddress(), apiBase || context.env.API_BASE);

  context.broadcast = (tx: wt.TTx, apiBase?: string) => wt.broadcast(tx, apiBase || context.env.API_BASE);

  context.file = (tabName?: string): string => {
    if (typeof context.env.file !== 'function') {
        throw new Error('File content API is not available. Please provide it to the console');
    }
    return context.env.file(tabName);
  };

  context.contract = (): string => context.file();

  context.keyPair = (seed?: string) => keyPair(seed || context.env.SEED);

  context.publicKey = (seed?: string): string =>
    context.keyPair(seed).public;

  context.privateKey = (seed: string): string =>
    context.keyPair(seed).private;

  context.address = (seed?: string, chainId?: string) => address(
    seed || context.env.SEED,
    chainId || context.env.CHAIN_ID
  );

  context.compile = (code: string): string => {
    const resultOrError = cmpl(code);

    if ('error' in resultOrError) throw new Error(resultOrError.error);

    return resultOrError.result.base64;
  };

  context.alias = injectEnv(wt.alias);

  context.burn = injectEnv(wt.burn);

  context.cancelLease = injectEnv(wt.cancelLease);

  context.cancelOrder = injectEnv(wt.cancelOrder);

  context.data = injectEnv(wt.data);

  context.issue = injectEnv(wt.issue);

  context.reissue = injectEnv(wt.reissue);

  context.lease = injectEnv(wt.lease);

  context.massTransfer = injectEnv(wt.massTransfer);

  context.order = injectEnv(wt.order);

  context.transfer = injectEnv(wt.transfer);

  context.setScript = injectEnv(wt.setScript);

  context.setAssetScript = injectEnv(wt.setAssetScript);

  context.invokeScript = injectEnv(wt.invokeScript);

  context.sponsorship = injectEnv(wt.sponsorship);

  context.signTx = injectEnv(wt.signTx);
};

export {
  injectTestEnvironment
};
