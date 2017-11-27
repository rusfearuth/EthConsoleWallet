// @flow
import 'babel-polyfill';
import Mnemonic from 'bitcore-mnemonic';
import { keystore } from 'eth-lightwallet';
import type { ArgsType } from '../utils/cli.types';
import type {
  MnemonicType,
  MnemonicResultType,
  VaultOptionsType,
} from './types';
import { writeWallet, readWallet, hasWallet } from '../utils/store';
import { getTotalBalance } from '../requests/web3';
import { utils } from 'web3';
import ora from 'ora';
import chalk from 'chalk';

export const initWallet = async (args: ArgsType): Promise<*> => {
  const passCreation: boolean = await hasWallet(args);
  if (passCreation && !args.force) {
    console.log(
      `${chalk.underline.red(
        'WARNING:',
      )} You have a wallet. If you want to create a new wallet. Please use ${chalk.green(
        '--force',
      )} key ${chalk.underline.red('(it will remove exist data)')}.`,
    );
    return;
  }
  const mnemonic: MnemonicType = new Mnemonic(Mnemonic.Words.ENGLISH);
  const result: MnemonicResultType = {
    words: mnemonic.toString(),
    salt: keystore.generateSalt(128),
    xprv: mnemonic.toHDPrivateKey().toString(),
  };

  const { password } = args;

  if (!password) {
    return;
  }

  const _keystore = await _createVault({
    password,
    seedPhrase: result.words,
    salt: result.salt,
    hdPathString: "m/44'/60'/0'/0",
  });

  if (!_keystore) {
    console.log(chalk.red("Wallet wasn't created!"));
    return;
  }

  await writeWallet(args, _keystore);

  const congrate = `${chalk.green('SUCCESS')}
=========================================================================
${chalk.bgRed(
    'This data should be save in secret place. It will help you to recover wallet in future if you lose it.',
  )}
-------------------------------------------------------------------------
Secret words:\t${chalk.red(result.words)}
Xprv key:\t${chalk.red(result.xprv)}
Salt:\t\t${chalk.red(result.salt)}
Password:\t${chalk.red(password)}`;
  console.log(congrate);
};

export const stateWallet = async (args: ArgsType): Promise<*> => {
  const result: boolean = await hasWallet(args);
  if (!result) {
    console.log(
      `${chalk.underline.red('WARNING:')} You don't have any wallet yet.`,
    );
    return;
  }
  const keystore = await readWallet(args);
  const addressCount: number = keystore.getAddresses().length;

  const message: string = `
${chalk.green('WALLET')}
=================================================================
 Address count: ${chalk.green(addressCount)}
-----------------------------------------------------------------
`;
  console.log(message);
};

export const totalBalance = async (args: ArgsType): Promise<*> => {
  const result: boolean = await hasWallet(args);
  if (!result) {
    console.log(
      `${chalk.underline.red('WARNING:')} You don't have any wallet yet.`,
    );
    return;
  }
  const keystore = await readWallet(args);

  let promises: Promise<*>[] = [];
  let resps: any = [];
  const addresses: string[] = keystore.getAddresses();

  let spinner = ora('Getting total balance of wallet...').start();

  const balance = await getTotalBalance(addresses, {
    rpcapi: 'http://localhost:8545',
  });

  spinner.succeed(
    `Your wallet balance is ${utils.fromWei(
      balance.toString(),
      'ether',
    )} ETH / ${balance.toString()} Wei`,
  );
};

const _createVault = (options: VaultOptionsType): Promise<*> => {
  return new Promise((res, rej) => {
    keystore.createVault(options, (err, ks) => {
      if (!err) {
        res(ks);
        return;
      }
      rej(err);
    });
  });
};
