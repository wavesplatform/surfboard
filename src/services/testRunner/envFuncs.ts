import * as wt from '@waves/waves-transactions';
import {
    IAliasParams,
    IAliasTransaction,
    IBurnParams,
    IBurnTransaction,
    ICancelLeaseParams,
    ICancelLeaseTransaction,
    ICancelOrder,
    ICancelOrderParams,
    IDataParams,
    IDataTransaction, IInvokeScriptParams, IInvokeScriptTransaction,
    IIssueParams,
    IIssueTransaction,
    ILeaseParams,
    ILeaseTransaction, IMassTransferItem,
    IMassTransferParams,
    IMassTransferTransaction,
    IOrderParams,
    IReissueParams,
    IReissueTransaction,
    ISetAssetScriptParams, ISetAssetScriptTransaction,
    ISetScriptParams,
    ISetScriptTransaction, ISponsorshipParams, ISponsorshipTransaction,
    ITransferParams,
    ITransferTransaction,
    TOrder,
    TSeedTypes, TTx, TTxParams,
    WithId
} from '@waves/waves-transactions';
import { WithTxType } from '@waves/waves-transactions/dist/general';
import { compile as cmpl } from '@waves/ride-js';

const withDefaults = (options: wt.nodeInteraction.INodeRequestOptions = {}) => ({
    timeout: options.timeout || 20000,
    apiBase: options.apiBase || global.env.API_BASE
});

const currentAddress = () => wt.libs.crypto.address(global.env.SEED, global.env.CHAIN_ID);

const injectEnv = <T extends (pp: any, ...args: any[]) => any>(f: T) =>
    (po: wt.TTxParams, seed?: wt.TSeedTypes | null): ReturnType<typeof f> =>
        f(
            {chainId: global.env.CHAIN_ID, ...po},
            seed === null
                ? null
                : seed || global.env.SEED
        );

/// TRANSACTION CREATORS
/**
 * Creates alias transaction or signs already formed one. Alias transaction ties creates alias for address. This alias could be used instead of address later
 */
export function alias(params: IAliasParams | IAliasTransaction, seed?: TSeedTypes): IAliasTransaction & WithId {
    return injectEnv(wt.alias)(params, seed);
}

/**
 * Creates burn transaction or signs already formed one. Burn transaction destroys tokens. You cannot burn WAVES
 */
export function burn(params: IBurnParams | IBurnTransaction, seed?: TSeedTypes): IBurnTransaction & WithId {
    return injectEnv(wt.burn)(params, seed);
}

/**
 * Creates cancel-lease transaction or signs already formed one
 */
export function cancelLease(params: ICancelLeaseParams | ICancelLeaseTransaction, seed?: TSeedTypes):
    ICancelLeaseTransaction & WithId {
    return injectEnv(wt.cancelLease)(params, seed);
}

/**
 * Creates cancel-order request or signs already formed one
 */
export function cancelOrder(params: ICancelOrderParams, seed?: TSeedTypes): ICancelOrder {
    return injectEnv(wt.cancelOrder)(params as any, seed);
}

/**
 * Creates data transaction or signs already formed one
 */
export function data(params: IDataParams | IDataTransaction, seed?: TSeedTypes): IDataTransaction & WithId {
    return injectEnv(wt.data)(params, seed);
}

/**
 * Creates issue transaction or signs already formed one
 */
export function issue(params: IIssueParams | IIssueTransaction, seed?: TSeedTypes): IIssueTransaction & WithId {
    return injectEnv(wt.issue)(params, seed);
}

/**
 * Creates reissue transaction or signs already formed one
 */
export function reissue(params: IReissueParams | IReissueTransaction, seed?: TSeedTypes): IReissueTransaction & WithId {
    return injectEnv(wt.reissue)(params, seed);
}

/**
 * Creates lease transaction or signs already formed one
 */
export function lease(params: ILeaseParams | ICancelLeaseTransaction, seed?: TSeedTypes): ILeaseTransaction & WithId {
    return injectEnv(wt.lease)(params, seed);
}

/**
 * Creates mass-transfer transaction or signs already formed one
 */
export function massTransfer(params: IMassTransferParams | IMassTransferTransaction, seed?: TSeedTypes):
    IMassTransferTransaction & WithId {
    return injectEnv(wt.massTransfer)(params, seed);
}

/**
 * Creates order or signs already formed one
 */
export function order(params: IOrderParams | TOrder, seed?: TSeedTypes): TOrder & WithId {
    return injectEnv(wt.order)(params as any, seed);
}

/**
 * Creates transfer transaction or signs already formed one
 */
export function transfer(params: ITransferParams | ITransferTransaction, seed?: TSeedTypes):
    ITransferTransaction & WithId {
    return injectEnv(wt.transfer)(params, seed);
}

/**
 * Creates set-script transaction or signs already formed one
 */
export function setScript(params: ISetScriptParams | ISetScriptTransaction, seed?: TSeedTypes):
    ISetScriptTransaction & WithId {
    return injectEnv(wt.setScript)(params, seed);
}

/**
 * Creates set-asset-script transaction or signs already formed one
 */
export function setAssetScript(params: ISetAssetScriptParams | ISetAssetScriptTransaction, seed?: TSeedTypes):
    ISetAssetScriptTransaction & WithId {
    return injectEnv(wt.setAssetScript)(params, seed);
}

/**
 * Creates invoke-script transaction or signs already formed one
 */
export function invokeScript(params: IInvokeScriptParams | IInvokeScriptTransaction, seed?: TSeedTypes):
    IInvokeScriptTransaction & WithId {
    return injectEnv(wt.invokeScript)(params, seed);
}

/**
 * Creates sponsorship transaction or signs already formed one
 */
export function sponsorship(params: ISponsorshipParams | ISponsorshipTransaction, seed?: TSeedTypes):
    ISponsorshipTransaction & WithId {
    return injectEnv(wt.sponsorship)(params, seed);
}

/**
 * Signs arbitrary transaction
 */
export function signTx(params: TTx | TTxParams & WithTxType, seed?: TSeedTypes): TTx {
    return injectEnv(wt.signTx)(params as any, seed);
}


/// NODE INTERACTION
/**
 * Resolves when specified txId is mined into the block
 * By default has 20s timeout and uses current environment node
 */
export async function waitForTx(txId: string, options?: wt.nodeInteraction.INodeRequestOptions) {
    return wt.nodeInteraction.waitForTx(txId, withDefaults(options));
}

/**
 * Resolves N blocks after specified txId is mined into the block
 * By default has 20s timeout and uses current environment node
 */
export async function waitForTxWithNConfirmations(txId: string,
                                                  confirmations: number,
                                                  options?: wt.nodeInteraction.INodeRequestOptions) {
    return wt.nodeInteraction.waitForTxWithNConfirmations(txId, confirmations, withDefaults(options));
}

/**
 * Resolves N blocks after current blockchain height
 * By default has 20s timeout and uses current environment node
 */
export async function waitNBlocks(blocksCount: number, options?: wt.nodeInteraction.INodeRequestOptions) {
    return wt.nodeInteraction.waitNBlocks(blocksCount, withDefaults(options));
}

/**
 * Current blockchain height
 * By default has 20s timeout and uses current environment node
 */
export async function currentHeight(apiBase?: string) {
    return wt.nodeInteraction.currentHeight(apiBase || global.env.API_BASE);
}

/**
 * Resolves after target height has been reached
 * By default has 20s timeout and uses current environment node
 */
export async function waitForHeight(target: number, options?: wt.nodeInteraction.INodeRequestOptions) {
    return wt.nodeInteraction.waitForHeight(target, withDefaults(options));
}

/**
 * Get account effective balance
 * By default uses current environment address and node
 */
export async function balance(address?: string, apiBase?: string) {
    return wt.nodeInteraction.balance(address || currentAddress(),
        apiBase || global.env.API_BASE);
}

/**
 * Retrieve information about specific asset account balance
 * By default uses current environment address and node
 */
export async function assetBalance(assetId: string, address?: string, apiBase?: string) {
    return wt.nodeInteraction.assetBalance(assetId, address || currentAddress(),
        apiBase || global.env.API_BASE);
}

/**
 * Retrieve full information about waves account balance. Effective, generating etc
 * By default uses current environment address and node
 */
export async function balanceDetails(address?: string, apiBase?: string) {
    return wt.nodeInteraction.balanceDetails(address || currentAddress(), apiBase || global.env.API_BASE);
}

/**
 * Get full account dictionary
 * By default uses current environment address and node
 */
export async function accountData(address?: string, apiBase?: string) {
    return wt.nodeInteraction.accountData(address || currentAddress(), apiBase || global.env.API_BASE);
}

/**
 * Get data from account dictionary by key
 * By default uses current environment address and node
 */
export async function accountDataByKey(key: string, address?: string, apiBase?: string) {
    return wt.nodeInteraction.accountDataByKey(key, address || currentAddress(), apiBase || global.env.API_BASE);
}

/**
 * Get invokeScript tx state changes
 * By default uses current environment address and node
 */
export async function stateChanges(invokeScriptTxId: string, apiBase?: string) {
    return wt.nodeInteraction.stateChanges(invokeScriptTxId, apiBase || global.env.API_BASE);
}

/**
 * Sends transaction to waves node
 * By default uses current environment address and node
 */
export async function broadcast(tx: wt.TTx, apiBase?: string) {
    return wt.nodeInteraction.broadcast(tx, apiBase || global.env.API_BASE);
}


// UTILITY
/**
 * Returns file content as string. Either from 'ride' folder or WEB IDE storage
 */
export async function file(name?: string): Promise<string> {
    if (typeof global.env.file !== 'function') {
        throw new Error('File content API is not available. Please provide it to the console');
    }
    return global.env.file(name);
}

/**
 * Shorthand for file()
 */
export async function contract(): Promise<string> {
    return global.env.file();
}

/**
 * Generates key pair from seed
 * By default uses current environment seed
 */
export function keyPair(seed?: string) {
    return wt.libs.crypto.keyPair(seed || global.env.SEED);
}

/**
 * Generates public key from seed
 * By default uses current environment seed
 */
export function publicKey(seed?: string): string {
    return wt.libs.crypto.keyPair(seed || global.env.SEED).public;
}

/**
 * Generates private key from seed
 * By default uses current environment seed
 */
export function privateKey(seed?: string): string {
    return wt.libs.crypto.keyPair(seed || global.env.SEED).private;
}

/**
 * Generates address
 * By default uses current environment seed and chainId
 */
export function address(seed?: string, chainId?: string) {
    return wt.libs.crypto.address(
        seed || global.env.SEED,
        chainId || global.env.CHAIN_ID
    );
};

/**
 * Returns base64 representations of compiled ride file
 */
export function compile(code: string): string {
    const resultOrError = cmpl(code);
    if ('error' in resultOrError) throw new Error(resultOrError.error);

    return resultOrError.result.base64;
}

/**
 * Signs arbitrary bytes
 * By default uses current environment seed and chainId
 */
export function signBytes(bytes: Uint8Array, seed?: string) {
    return wt.libs.crypto.signBytes(bytes, seed || global.env.SEED);
}


interface ISetupAccsOpts {
    nonce?: string,
    masterSeed?: string,
}

/**
 * Generates test accounts with balances. Sends waves to generated accounts from master seed.
 * By default uses current environment node and seed as masterSeed
 */
export async function setupAccounts(balances: Record<string, number>, options?: ISetupAccsOpts) {
    const getNonce = () => [].map.call(
        wt.libs.crypto.randomUint8Array(4),
        (n: number) => n.toString(16))
        .join('');

    const nonce = (options && options.nonce) || getNonce();
    const masterSeed = (options && options.masterSeed) || global.env.SEED;

    global.console.log(`Generating accounts with nonce: ${nonce}`);

    const transfers: IMassTransferItem[] = [];

    Object.entries(balances).forEach(([name, balance]) => {
        const seed = name + '#' + nonce;
        const addr = address(seed, global.env.CHAIN_ID);

        global.env.accounts[name] = seed;
        global.console.log(`Account generated: ${seed} - ${addr}`);
        transfers.push({
            recipient: addr,
            amount: balance
        });
    });

    const mtt = massTransfer({transfers}, masterSeed);
    await broadcast(mtt);
    await waitForTx(mtt.id);
    global.console.log(`Accounts successfully funded`);
}