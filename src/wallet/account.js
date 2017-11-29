// @flow

import type { ArgsType } from '../utils/cli.types';
import type { BalanceType } from '../requests/common.types';
import { writeWallet, readWallet, writeOutput } from '../utils/store';
import { getBalance } from '../requests/common';
import chalk from 'chalk';
import { readConfig } from '../utils/store';
import { getApikey, getIpc, getRpcApi } from '../config';
import type { ConfigType } from '../config/types';
import ora from 'ora';
import { utils } from 'web3';
import { isEmpty } from 'lodash';

export const generateAddresses = async (args: ArgsType): Promise<*> => {
  let keystore = await readWallet(args);
  const { password, count } = args;

  if (!count || !password) {
    return;
  }

  const pwDerivedKey = await _keyFromPassword(keystore, password);

  console.log(`Creating new ${chalk.green(count)} addresses...`);
  keystore.generateNewAddress(pwDerivedKey, count);

  await writeWallet(args, keystore);

  const addressCount = keystore.getAddresses().length;

  const congrate = `Now you have ${chalk.green(
    addressCount,
  )} addresses for charging.`;

  const { output } = args;
  if (!output || isEmpty(output)) {
    console.log(congrate);
    return;
  }

  const newAddresses: string[] = keystore
    .getAddresses()
    .slice(addressCount - count);

  const addressesOutput = {
    total: addressCount,
    addresses: keystore.getAddresses(),
    newAddresses,
  };
  await writeOutput(args, addressesOutput);
  console.log(congrate);
};

export const balanceByAddress = async (args: ArgsType): Promise<*> => {
  const { address, token, rpc } = args;
  const apikey = await getApikey(args);
  const rpcapi = await getRpcApi(args);
  if (!address || (!apikey && !rpcapi)) {
    return;
  }

  let spinner = ora(`Loading balance for ${chalk.green(address)}`).start();
  let response: BalanceType = await getBalance(address, { apikey, rpcapi });
  if (!response) {
    ora('Something went wrong').fail();
    return;
  }
  const { result } = response;
  const congrate = `Balance of ${chalk.green(address)} is ${chalk.green(
    utils.fromWei(result, 'ether'),
  )} ETH / ${chalk.green(result)} wei`;
  spinner.succeed(congrate);
  return;
};

const _buildQueryParams = (params: Object): string =>
  Object.keys({ '?': '', ...params })
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

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
