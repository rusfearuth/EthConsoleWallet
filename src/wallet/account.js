// @flow

import type { ArgsType } from '../utils/cli.types';
import type { BalanceType } from '../requests/etherscan.types';
import { writeWallet, readWallet, writeOutput } from '../utils/store';
import { getBalance } from '../requests/etherscan';
import chalk from 'chalk';
import { readConfig } from '../utils/store';
import { getApikey } from '../config';
import type { ConfigType } from '../config/types';
import ora from 'ora';
import utils from 'web3-utils';
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

  const newAddresses: string[] = keystore
    .getAddresses()
    .slice(addressCount - count);

  const addressesOutput = {
    total: addressCount,
    addresses: keystore.getAddresses(),
    newAddresses,
  };

  const { output } = args;
  if (!!output && !isEmpty(output)) {
    await writeOutput(args, addressesOutput);
  }
  console.log(congrate);
};

export const balanceByAddress = async (args: ArgsType): Promise<*> => {
  const { address, token } = args;
  const apikey = await getApikey(args); // token || (config.etherscan && config.etherscan.apikey);

  if (!address || !apikey) {
    return;
  }

  let spinner = ora(`Loading balance for ${chalk.green(address)}`).start();
  const { result } = await getBalance(address, apikey);
  const congrate = `Balance of ${chalk.green(address)} is ${chalk.green(
    utils.fromWei(result, 'ether'),
  )} ETH / ${chalk.green(result)} wei`;
  spinner.succeed(congrate);
  //console.log(congrate);
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