'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateWallet = exports.initWallet = undefined;

require('babel-polyfill');

var _bitcoreMnemonic = require('bitcore-mnemonic');

var _bitcoreMnemonic2 = _interopRequireDefault(_bitcoreMnemonic);

var _ethLightwallet = require('eth-lightwallet');

var _store = require('../utils/store');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const initWallet = exports.initWallet = async args => {
  const passCreation = await (0, _store.hasWallet)(args);
  if (passCreation && !args.force) {
    console.log(`${_chalk2.default.underline.red('WARNING:')} You have a wallet. If you want to create a new wallet. Please use ${_chalk2.default.green('--force')} key ${_chalk2.default.underline.red('(it will remove exist data)')}.`);
    return;
  }
  const mnemonic = new _bitcoreMnemonic2.default(_bitcoreMnemonic2.default.Words.ENGLISH);
  const result = {
    words: mnemonic.toString(),
    salt: _ethLightwallet.keystore.generateSalt(128),
    xprv: mnemonic.toHDPrivateKey().toString()
  };

  const { password } = args;

  if (!password) {
    return;
  }

  const _keystore = await _createVault({
    password,
    seedPhrase: result.words,
    salt: result.salt,
    hdPathString: "m/44'/60'/0'/0"
  });

  if (!_keystore) {
    console.log(_chalk2.default.red("Wallet wasn't created!"));
    return;
  }

  await (0, _store.writeWallet)(args, _keystore);

  const congrate = `${_chalk2.default.green('SUCCESS')}
=========================================================================
${_chalk2.default.bgRed('This data should be save in secret place. It will help you to recover wallet in future if you lose it.')}
-------------------------------------------------------------------------
Secret words:\t${_chalk2.default.red(result.words)}
Xprv key:\t${_chalk2.default.red(result.xprv)}
Salt:\t\t${_chalk2.default.red(result.salt)}
Password:\t${_chalk2.default.red(password)}`;
  console.log(congrate);
};
const stateWallet = exports.stateWallet = async args => {
  const result = await (0, _store.hasWallet)(args);
  if (!result) {
    console.log(`${_chalk2.default.underline.red('WARNING:')} You don't have any wallet yet.`);
    return;
  }
  const keystore = await (0, _store.readWallet)(args);
  const addressCount = keystore.getAddresses().length;

  const message = `
${_chalk2.default.green('WALLET')}
=================================================================
 Address count: ${_chalk2.default.green(addressCount)}
-----------------------------------------------------------------
`;
  console.log(message);
};

const _createVault = options => {
  return new Promise((res, rej) => {
    _ethLightwallet.keystore.createVault(options, (err, ks) => {
      if (!err) {
        res(ks);
        return;
      }
      rej(err);
    });
  });
};