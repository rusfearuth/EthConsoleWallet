'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _wallet = require('./wallet');

var _account = require('./wallet/account');

var _transaction = require('./wallet/transaction');

var _cli = require('./utils/cli');

var _config = require('./config');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class App {}
exports.default = App;

App.main = async args => {
  try {
    if ((0, _cli.isInitWallet)(args)) {
      if (!(0, _cli.checkInitWalletPass)(args)) {
        (0, _cli.defaultMessage)();
        return;
      }
      await (0, _wallet.initWallet)(args);
    } else if ((0, _cli.isWalletState)(args)) {
      await (0, _wallet.stateWallet)(args);
    } else if ((0, _cli.isGenerate)(args)) {
      if (!(0, _cli.checkGenerateParams)(args)) {
        (0, _cli.defaultMessage)();
        return;
      }
      await (0, _account.generateAddresses)(args);
    } else if ((0, _cli.isBalance)(args)) {
      if (!(0, _cli.checkBalanceParams)(args)) {
        (0, _cli.defaultMessage)();
        return;
      }
      await (0, _account.balanceByAddress)(args);
    } else if ((0, _cli.isWithdrawAll)(args)) {
      if (!(0, _cli.checkWithdrawParams)(args)) {
        (0, _cli.defaultMessage)();
        return;
      }
      await (0, _transaction.sendEntireAmount)(args);
    } else if ((0, _cli.isAdd)(args)) {
      if (!(0, _cli.checkConfigParams)(args)) {
        (0, _cli.defaultMessage)();
        return;
      }
      await (0, _config.updateConfing)(args);
    } else if ((0, _cli.isHelp)(args)) {
      (0, _cli.showMan)();
    } else if ((0, _cli.isVersion)(args)) {
      (0, _cli.showVersion)();
    } else {
      (0, _cli.defaultMessage)();
    }
  } catch (error) {
    (0, _cli.errorMessage)(args, error);
  }
};