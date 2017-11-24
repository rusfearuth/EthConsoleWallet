'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendEntireAmount = undefined;

var _web3Utils = require('web3-utils');

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _numbers = require('../utils/numbers');

var _etherscan = require('../requests/etherscan');

var _config = require('../config');

var _lodash = require('lodash');

var _ethLightwallet = require('eth-lightwallet');

var _store = require('../utils/store');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sendEntireAmount = exports.sendEntireAmount = async args => {
  const apikey = await (0, _config.getApikey)(args);
  const { from, to, password } = args;

  // Needed only for pass Flowtype chekcout
  if (!from || !to || !password) {
    return;
  }

  if (!apikey || (0, _lodash.isEmpty)(apikey)) {
    console.log(`${_chalk2.default.underline.red('WARNING:')} Please pass apikey from https://etherscan.io.`);
    return;
  }
  const txOptions = await _prepareTxOptions(from, to, apikey);
  const txSigned = await _buildAndSignTx(args, from, password, txOptions);
  if (!txSigned) {
    console.log(`${_chalk2.default.underline.red('WARNING:')} Tx hasn't been created`);
    return;
  }
  const tx = await (0, _etherscan.sendSignedTransaction)(txSigned, apikey);

  const congrate = `Your transaction is ${_chalk2.default.green(tx.result)}.\nYou can check it at https://etherscan.io/tx/${tx.result}`;
  console.log(congrate);
};

const _prepareTxOptions = async (from, to, apikey) => {
  let spinner = (0, _ora2.default)('Loading gas price').start();
  let resp = await (0, _etherscan.gasPrice)(apikey);
  const price = (0, _numbers.toBigNumber)(resp.result);
  spinner.succeed(`Gas price is ${_chalk2.default.green(resp.result)}`);
  spinner = (0, _ora2.default)('Loading transaction count').start();
  resp = await (0, _etherscan.getTransactionCount)(from, apikey);
  const nonce = resp.result;
  spinner.succeed(`Transaction count is ${_chalk2.default.green(resp.result)}`);
  spinner = (0, _ora2.default)('Loading address balance').start();
  resp = await (0, _etherscan.getBalance)(from, apikey);
  const total = (0, _numbers.toBigNumber)(resp.result);
  spinner.succeed(`Balance of ${_chalk2.default.green(from)} is ${_chalk2.default.green(resp.result)}`);
  const gasLimit = (0, _numbers.toBigNumber)(21000);
  const value = _calcMaxAmount(gasLimit, price, total);
  return {
    from,
    to,
    gasLimit: _web3Utils2.default.toHex(gasLimit),
    gasPrice: _web3Utils2.default.toHex(price),
    value: _web3Utils2.default.toHex(value),
    nonce
  };
};

const _buildAndSignTx = async (args, from, password, txOptions) => {
  const result = await (0, _store.hasWallet)(args);
  if (!result) {
    return null;
  }
  const _keystore = await (0, _store.readWallet)(args);
  const pwDerivedKey = await _keyFromPassword(_keystore, password);
  const txValue = _ethLightwallet.txutils.valueTx(txOptions);
  const txSigned = _ethLightwallet.signing.signTx(_keystore, pwDerivedKey, txValue, from);
  return `0x${txSigned}`;
};

const _calcMaxAmount = (gasLimit, gasPrice, total) => total.sub(gasLimit.mul(gasPrice));

const _keyFromPassword = (vault, password) => {
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