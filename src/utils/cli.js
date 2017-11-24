// @flow

import commandLineArgs from 'command-line-args';
import getUsage from 'command-line-usage';
import path from 'path';
import os from 'os';
import type { CliOptionType, ArgsType } from './cli.types';
import { isEmpty } from 'lodash';
import chalk from 'chalk';
import pkg from '../../package.json';

const options: CliOptionType[] = [
  // Create a wallet
  { name: 'init', type: Boolean },
  { name: 'password', type: String, defaultOption: true },
  {
    name: 'datadir',
    type: String,
    defaultValue: path.join(os.homedir(), '.eth-console-wallet'),
  },
  { name: 'force', type: Boolean },

  // Wallet info
  { name: 'state', type: Boolean },

  // Generate addresses
  { name: 'generate', type: Boolean },
  { name: 'count', type: Number, defaultValue: 1, defaultOption: false },
  { name: 'output', type: String },

  // Get balance
  { name: 'balance', type: Boolean },
  { name: 'address', type: String },
  { name: 'token', type: String },

  // Withdraw ETH
  { name: 'withdrawAll', type: Boolean },
  { name: 'from', type: String },
  { name: 'to', type: String },

  // Config params
  { name: 'add', type: Boolean },
  { name: 'etherscanToken', type: String },

  // Help
  { name: 'help', type: Boolean },

  // Version
  { name: 'version', alias: 'v', type: Boolean },
];

export const args: ArgsType = commandLineArgs(options, { partial: true });

export const isInitWallet = ({ init }: ArgsType): boolean => !!init;
export const checkInitWalletPass = ({ password }: ArgsType): boolean =>
  !!password;

export const isWalletState = ({ state }: ArgsType): boolean => !!state;

export const isGenerate = ({ generate }: ArgsType): boolean => !!generate;
export const checkGenerateParams = ({ count, output }: ArgsType): boolean =>
  !!count && count > 0;

export const isBalance = ({ balance }: ArgsType): boolean => !!balance;
export const checkBalanceParams = ({ address }: ArgsType): boolean =>
  !!address && !isEmpty(address);

export const isWithdrawAll = ({ withdrawAll }: ArgsType): boolean =>
  !!withdrawAll;
export const checkWithdrawParams = ({ from, to }: ArgsType): boolean =>
  !!from && !!to && !isEmpty(from) && !isEmpty(to);

export const isAdd = ({ add }: ArgsType): boolean => !!add;
export const checkConfigParams = ({ etherscanToken }: ArgsType): boolean =>
  !!etherscanToken;

export const isHelp = ({ help }: ArgsType): boolean => !!help;

export const isVersion = ({ version }: ArgsType): boolean => !!version;

const _man = [
  // Header
  {
    header: chalk.green('Eth Console Wallet'),
    content: 'Lightweight console wallet for Ethereum.',
  },
  // Create a wallet
  {
    header: 'Wallet options',
    optionList: [
      {
        name: 'init',
        description: 'Generate a new wallet file',
      },
      {
        name: 'password',
        typeLabel: 'passphrase',
        description: 'Password is used for getting access to wallet',
      },
      {
        name: 'datadir',
        typeLabel: 'path',
        description: `[underline]{Optional}. Path of data folder. By default ${chalk.underline(
          '[USER_HOME]/.eth-console-wallet/',
        )}`,
      },
      {
        name: 'force',
        description: `[underline]{Optional}. If you need to create a new wallet. ${chalk.red(
          'WARNING: Current wallet will be deleted.',
        )}`,
      },
      {
        name: 'state',
        description: 'Print information about wallet state',
      },
    ],
  },
  // Generate addresses
  {
    header: 'Address options',
    optionList: [
      {
        name: 'generate',
      },
      {
        name: 'count',
        typeLabel: '1..1000',
        description: `Number of addresses which will be generated. By default ${chalk.underline(
          '1',
        )}.`,
      },
      {
        name: 'password',
        typeLabel: 'passphrase',
        description: 'Password is used for getting access to wallet',
      },
      {
        name: 'output',
        typeLabel: 'path',
        description:
          '[underline]{Optional}. Print log of generation new addresses to JSON file',
      },
      {
        name: 'datadir',
        typeLabel: 'path',
        description: `[underline]{Optional}. Path of data folder. By default ${chalk.underline(
          '[USER_HOME]/.eth-console-wallet/',
        )}`,
      },
    ],
  },
  // Get balance
  {
    header: 'Balance options',
    optionList: [
      {
        name: 'balance',
        description: 'Get balance',
      },
      {
        name: 'address',
        typeLabel: 'address',
        description: 'For current address',
      },
      {
        name: 'token',
        typeLabel: 'apikey',
        description:
          '[underline]{Optional}. This is apikey from [underline]{https://etherscan.io/}. If you added apikey to the config file, you can pass this option.',
      },
    ],
  },
  // Add config
  {
    header: 'Config options',
    optionList: [
      {
        name: 'add',
        description: 'Add or update config option',
      },
      {
        name: 'etherscanToken',
        typeLabel: 'apikey',
        description:
          'Api key from [underline]{https://etherscan.io/}. This key will be used for getting balance or send amount of ETH.',
      },
      {
        name: 'datadir',
        typeLabel: 'path',
        description: `[underline]{Optional}. Path of data folder. By default ${chalk.underline(
          '[USER_HOME]/.eth-console-wallet/',
        )}`,
      },
    ],
  },
  // Withdraw
  {
    header: 'Withdraw options',
    content: `${chalk.underline.red(
      'NOTICE:',
    )} Now, It only supports withdraw all amount to another.`,
  },
  {
    optionList: [
      {
        name: 'withdrawAll',
        description: 'Withdraw all exist amount',
      },
      {
        name: 'from',
        typeLabel: 'address',
        description: 'From current address',
      },
      {
        name: 'to',
        typeLabel: 'address',
        description: 'To another address',
      },
      {
        name: 'password',
        typeLabel: 'passphrase',
        description: 'Password is used for getting access to wallet',
      },
      {
        name: 'datadir',
        typeLabel: 'path',
        description: `[underline]{Optional}. Path of data folder. By default ${chalk.underline(
          '[USER_HOME]/.eth-console-wallet/',
        )}`,
      },
    ],
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'help',
        description: 'Print man',
      },
      {
        name: 'version',
        alias: 'v',
        description: 'Print current version of app',
      },
    ],
  },
  {
    content: [
      'If you have any questions, you can ask them at [underline]{https://github.com/rusfearuth/EthConsoleWallet/issues}.',
    ],
    raw: true,
  },
];

export const showMan = () => console.log(getUsage(_man));

export const showVersion = () => console.log(`Version is ${pkg.version}`);

export const defaultMessage = () =>
  console.log(`Please use ${chalk.green('--help')}`);

export const errorMessage = (args: ArgsType, error: Error) => {
  console.log('Something went wrong :(\n');
  console.log(
    `Please report about that to ${chalk.underline.green(
      'https://github.com/rusfearuth/EthConsoleWallet/issues',
    )}.`,
  );
  console.log('\nPlease attach information below to your issue.');
  console.log(
    '> -----------------------------------------------------------------',
  );
  console.log('Args:');
  console.log(JSON.stringify(args, null, 2));
  console.log('Error:');
  console.log(error);
  console.log(
    '----------------------------------------------------------------- <',
  );
};
