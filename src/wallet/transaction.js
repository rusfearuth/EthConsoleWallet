// @flow

import type { ArgsType } from '../utils/cli.types';
import utils from 'web3-utils';
import { toBigNumber } from '../utils/numbers';
import {
  gasPrice,
  getTransactionCount,
  getBalance,
  sendSignedTransaction,
} from '../requests/etherscan';
import type { TransactionType } from '../requests/etherscan.types';
import { getApikey } from '../config';
import { isEmpty } from 'lodash';
import { txutils, signing } from 'eth-lightwallet';
import { hasWallet, readWallet } from '../utils/store';
import type { TxOptionsType } from './transaction.types';
import chalk from 'chalk';
import ora from 'ora';

export const sendEntireAmount = async (args: ArgsType): Promise<*> => {
  const apikey: ?string = await getApikey(args);
  const { from, to, password } = args;

  // Needed only for pass Flowtype chekcout
  if (!from || !to || !password) {
    return;
  }

  if (!apikey || isEmpty(apikey)) {
    console.log(
      `${chalk.underline.red(
        'WARNING:',
      )} Please pass apikey from https://etherscan.io.`,
    );
    return;
  }
  const txOptions = await _prepareTxOptions(from, to, apikey);
  const txSigned: ?string = await _buildAndSignTx(
    args,
    from,
    password,
    txOptions,
  );
  if (!txSigned) {
    console.log(`${chalk.underline.red('WARNING:')} Tx hasn't been created`);
    return;
  }
  const tx = await sendSignedTransaction(txSigned, apikey);

  const congrate = `Your transaction is ${chalk.green(
    tx.result,
  )}.\nYou can check it at https://etherscan.io/tx/${tx.result}`;
  console.log(congrate);
};

const _prepareTxOptions = async (
  from: string,
  to: string,
  apikey: string,
): Promise<TxOptionsType> => {
  let spinner = ora('Loading gas price').start();
  let resp = await gasPrice(apikey);
  const price = toBigNumber(resp.result);
  spinner.succeed(`Gas price is ${chalk.green(resp.result)}`);
  spinner = ora('Loading transaction count').start();
  resp = await getTransactionCount(from, apikey);
  const nonce = resp.result;
  spinner.succeed(`Transaction count is ${chalk.green(resp.result)}`);
  spinner = ora('Loading address balance').start();
  resp = await getBalance(from, apikey);
  const total = toBigNumber(resp.result);
  spinner.succeed(
    `Balance of ${chalk.green(from)} is ${chalk.green(resp.result)}`,
  );
  const gasLimit = toBigNumber(21000);
  const value = _calcMaxAmount(gasLimit, price, total);
  return {
    from,
    to,
    gasLimit: utils.toHex(gasLimit),
    gasPrice: utils.toHex(price),
    value: utils.toHex(value),
    nonce,
  };
};

const _buildAndSignTx = async (
  args: ArgsType,
  from: string,
  password: string,
  txOptions: TxOptionsType,
): Promise<string | null> => {
  const result: boolean = await hasWallet(args);
  if (!result) {
    return null;
  }
  const _keystore = await readWallet(args);
  const pwDerivedKey: string = await _keyFromPassword(_keystore, password);
  const txValue = txutils.valueTx(txOptions);
  const txSigned = signing.signTx(_keystore, pwDerivedKey, txValue, from);
  return `0x${txSigned}`;
};

const _calcMaxAmount = (gasLimit, gasPrice, total) =>
  total.sub(gasLimit.mul(gasPrice));

const _keyFromPassword = (vault: Object, password: string): Promise<*> => {
  return new Promise((res, rej) => {
    vault.keyFromPassword(password, (err, pwDerivedKey) => {
      if (!err) {
        res(pwDerivedKey);
        return;
      }
      rej(err);
    });
  });
};