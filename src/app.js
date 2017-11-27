// @flow

import 'babel-polyfill';
import { initWallet, stateWallet, totalBalance } from './wallet';
import { generateAddresses, balanceByAddress } from './wallet/account';
import { sendEntireAmount } from './wallet/transaction';
import type { ArgsType } from './utils/cli.types';
import {
  isInitWallet,
  checkInitWalletPass,
  isWalletState,
  isWalletBalance,
  isGenerate,
  checkGenerateParams,
  isBalance,
  checkBalanceParams,
  isWithdrawAll,
  checkWithdrawParams,
  isAdd,
  checkConfigParams,
  isHelp,
  showMan,
  defaultMessage,
  errorMessage,
  isVersion,
  showVersion,
} from './utils/cli';
import { updateConfing } from './config';
import chalk from 'chalk';

export default class App {
  static main = async (args: ArgsType) => {
    try {
      if (isInitWallet(args)) {
        if (!checkInitWalletPass(args)) {
          defaultMessage();
          return;
        }
        await initWallet(args);
      } else if (isWalletState(args)) {
        await stateWallet(args);
      } else if (isWalletBalance(args)) {
        await totalBalance(args);
      } else if (isGenerate(args)) {
        if (!checkGenerateParams(args)) {
          defaultMessage();
          return;
        }
        await generateAddresses(args);
      } else if (isBalance(args)) {
        if (!checkBalanceParams(args)) {
          defaultMessage();
          return;
        }
        await balanceByAddress(args);
      } else if (isWithdrawAll(args)) {
        if (!checkWithdrawParams(args)) {
          defaultMessage();
          return;
        }
        await sendEntireAmount(args);
      } else if (isAdd(args)) {
        if (!checkConfigParams(args)) {
          defaultMessage();
          return;
        }
        await updateConfing(args);
      } else if (isHelp(args)) {
        showMan();
      } else if (isVersion(args)) {
        showVersion();
      } else {
        defaultMessage();
      }
    } catch (error) {
      errorMessage(args, error);
    }
  };
}
