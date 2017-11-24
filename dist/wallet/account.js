'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.balanceByAddress = exports.generateAddresses = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _store = require('../utils/store');

var _etherscan = require('../requests/etherscan');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _config = require('../config');

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _web3Utils = require('web3-utils');

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const generateAddresses = exports.generateAddresses = async args => {
  let keystore = await (0, _store.readWallet)(args);
  const { password, count } = args;

  if (!count || !password) {
    return;
  }

  const pwDerivedKey = await _keyFromPassword(keystore, password);

  console.log(`Creating new ${_chalk2.default.green(count)} addresses...`);
  keystore.generateNewAddress(pwDerivedKey, count);

  await (0, _store.writeWallet)(args, keystore);

  const addressCount = keystore.getAddresses().length;

  const congrate = `Now you have ${_chalk2.default.green(addressCount)} addresses for charging.`;

  const newAddresses = keystore.getAddresses().slice(addressCount - count);

  const addressesOutput = {
    total: addressCount,
    addresses: keystore.getAddresses(),
    newAddresses
  };

  const { output } = args;
  if (!!output && !(0, _lodash.isEmpty)(output)) {
    await (0, _store.writeOutput)(args, addressesOutput);
  }
  console.log(congrate);
};

const balanceByAddress = exports.balanceByAddress = async args => {
  const { address, token } = args;
  const apikey = await (0, _config.getApikey)(args); // token || (config.etherscan && config.etherscan.apikey);

  if (!address || !apikey) {
    return;
  }

  let spinner = (0, _ora2.default)(`Loading balance for ${_chalk2.default.green(address)}`).start();
  const { result } = await (0, _etherscan.getBalance)(address, apikey);
  const congrate = `Balance of ${_chalk2.default.green(address)} is ${_chalk2.default.green(_web3Utils2.default.fromWei(result, 'ether'))} ETH / ${_chalk2.default.green(result)} wei`;
  spinner.succeed(congrate);
  //console.log(congrate);
};

const _buildQueryParams = params => Object.keys(_extends({ '?': '' }, params)).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');

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