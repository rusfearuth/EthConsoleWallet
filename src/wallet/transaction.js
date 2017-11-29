// @flow

import type { ArgsType } from '../utils/cli.types';
import utils from 'web3-utils';
import {
  getBalance,
  gasPrice,
  getTransactionCount,
  sendSignedTransaction,
} from '../requests/common';
import type { RequestParamsType } from '../requests/common.types';
import { toBigNumber } from '../utils/numbers';
import type { TransactionType } from '../requests/etherscan.types';
import { getApikey, getIpc, getRpcApi } from '../config';
import { isEmpty } from 'lodash';
import { txutils, signing } from 'eth-lightwallet';
import { hasWallet, readWallet, readAddresses } from '../utils/store';
import type { TxOptionsType } from './transaction.types';
import chalk from 'chalk';
import ora from 'ora';

export const sendEntireAmount = async (args: ArgsType): Promise<*> => {
  const apikey = await getApikey(args);
  const rpcapi = await getRpcApi(args);
  const { from, to, password } = args;

  // Needed only for pass Flowtype chekcout
  if (!to || !password) {
    console.log(
      `${chalk.underline.red(
        'WARNING:',
      )} You should set to and password options as a minimum.`,
    );
    return;
  }

  if (!apikey && !rpcapi) {
    console.log(
      `${chalk.underline.red(
        'WARNING:',
      )} Please pass apikey from https://etherscan.io.`,
    );
    return;
  }

  if (!!from) {
    await _sendEntireAmoutFromTo(args, { from, to, password, apikey, rpcapi });
    return;
  }
  await _sendEntireAmoutOfWalletTo(args, {
    to,
    password,
    apikey,
    rpcapi,
  });
};

const _sendEntireAmoutOfWalletTo = async (
  args: ArgsType,
  params: {
    to: string,
    password: string,
    apikey: ?string,
    rpcapi: ?string,
  },
): Promise<*> => {
  const apikey = await getApikey(args);
  const rpcapi = await getRpcApi(args);

  const { file } = args;

  let addresses: string[] = [];
  if (!!file) {
    addresses = await readAddresses(args);
  } else {
    const result: boolean = await hasWallet(args);
    if (!result) {
      return null;
    }
    const _keystore = await readWallet(args);
    addresses = _keystore.getAddresses();
  }

  let txs: string[] = [];
  let spinner = ora('Creating transactions... 0%').start();
  for (let i = 0; i < addresses.length; i++) {
    const address: string = addresses[i];
    const txSigned: ?string = await _prepareTxSigned(args, false, {
      from: address,
      ...params,
    });

    //const percent = new BigNumber(String(i * 100 / addresses.length)).floor();
    const percent = (i * 100 / addresses.length).toFixed(2);
    spinner.text = `Creating transactions... ${percent}%`;

    if (!txSigned) {
      continue;
    }

    txs.push(txSigned);
  }
  spinner.succeed(`Transactions've been created - ${txs.length}`);

  spinner = ora('Sending transaction... 0%').start();

  let txHashes: string[] = [];

  for (let i = 0; i < txs.length; i++) {
    const tx: string = txs[i];
    const { result } = await sendSignedTransaction(tx, {
      apikey,
      rpcapi,
    });
    const percent = (i * 100 / addresses.length).toFixed(2);
    spinner.text = `Sending transaction... ${percent}%`;
    txHashes.push(result);
  }

  const txLinks = txHashes
    .map(tx => `\nhttps://etherscan.io/tx/${tx}`)
    .reduce((accumulator, currentValue) => accumulator + currentValue);
  const congrate = `Your transaction are ${txLinks}`;
  spinner.succeed(congrate);
};

const _sendEntireAmoutFromTo = async (
  args: ArgsType,
  params: {
    from: string,
    to: string,
    password: string,
    apikey: ?string,
    rpcapi: ?string,
  },
): Promise<*> => {
  const txSigned: ?string = await _prepareTxSigned(args, true, params);

  if (!txSigned) {
    return;
  }

  const { apikey, rpcapi } = params;

  let spinner = ora('Sending transaction...').start();
  const { result } = await sendSignedTransaction(txSigned, {
    apikey,
    rpcapi,
  });

  const congrate = `Your transaction is ${chalk.green(
    result,
  )}.\nYou can check it at https://etherscan.io/tx/${result}`;
  spinner.succeed(congrate);
};

const _prepareTxSigned = async (
  args: ArgsType,
  logs: boolean,
  params: {
    from: string,
    to: string,
    password: string,
    apikey: ?string,
    rpcapi: ?string,
  },
): Promise<*> => {
  const { from, to, password, apikey, rpcapi } = params;
  const txOptions = await _prepareTxOptions(
    from,
    to,
    {
      apikey,
      rpcapi,
    },
    logs,
  );
  if (!txOptions) {
    logs &&
      console.log(
        `${chalk.underline.red('WARNING:')} You don't have enough balance`,
      );
    return null;
  }
  const txSigned: ?string = await _buildAndSignTx(
    args,
    from,
    password,
    txOptions,
  );
  if (!txSigned) {
    logs &&
      console.log(`${chalk.underline.red('WARNING:')} Tx hasn't been created`);
    return null;
  }
  return txSigned;
};

const _prepareTxOptions = async (
  from: string,
  to: string,
  config: RequestParamsType,
  logs?: boolean = true,
): Promise<TxOptionsType | null> => {
  let spinner = (logs && ora('Loading gas price').start()) || null;
  let resp = await gasPrice(config);

  const price = toBigNumber(resp.result);
  spinner && spinner.succeed(`Gas price is ${chalk.green(resp.result)}`);
  spinner = (logs && ora('Loading transaction count').start()) || null;

  resp = await getTransactionCount(from, config);
  const nonce = resp.result;
  spinner &&
    spinner.succeed(`Transaction count is ${chalk.green(resp.result)}`);
  spinner = (logs && ora('Loading address balance').start()) || null;

  resp = await getBalance(from, config);
  const total = toBigNumber(resp.result);
  spinner &&
    spinner.succeed(
      `Balance of ${chalk.green(from)} is ${chalk.green(resp.result)}`,
    );
  const gasLimit = toBigNumber(21000);
  const value = _calcMaxAmount(gasLimit, price, total);
  if (value < 0) {
    return null;
  }
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
