'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorMessage = exports.defaultMessage = exports.showVersion = exports.showMan = exports.isVersion = exports.isHelp = exports.checkConfigParams = exports.isAdd = exports.checkWithdrawParams = exports.isWithdrawAll = exports.checkBalanceParams = exports.isBalance = exports.checkGenerateParams = exports.isGenerate = exports.isWalletState = exports.checkInitWalletPass = exports.isInitWallet = exports.args = undefined;

var _commandLineArgs = require('command-line-args');

var _commandLineArgs2 = _interopRequireDefault(_commandLineArgs);

var _commandLineUsage = require('command-line-usage');

var _commandLineUsage2 = _interopRequireDefault(_commandLineUsage);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _lodash = require('lodash');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const options = [
// Create a wallet
{ name: 'init', type: Boolean }, { name: 'password', type: String, defaultOption: true }, {
  name: 'datadir',
  type: String,
  defaultValue: _path2.default.join(_os2.default.homedir(), '.eth-console-wallet')
}, { name: 'force', type: Boolean },

// Wallet info
{ name: 'state', type: Boolean },

// Generate addresses
{ name: 'generate', type: Boolean }, { name: 'count', type: Number, defaultValue: 1, defaultOption: false }, { name: 'output', type: String },

// Get balance
{ name: 'balance', type: Boolean }, { name: 'address', type: String }, { name: 'token', type: String },

// Withdraw ETH
{ name: 'withdrawAll', type: Boolean }, { name: 'from', type: String }, { name: 'to', type: String },

// Config params
{ name: 'add', type: Boolean }, { name: 'etherscanToken', type: String },

// Help
{ name: 'help', type: Boolean },

// Version
{ name: 'version', alias: 'v', type: Boolean }];

const args = exports.args = (0, _commandLineArgs2.default)(options, { partial: true });

const isInitWallet = exports.isInitWallet = ({ init }) => !!init;
const checkInitWalletPass = exports.checkInitWalletPass = ({ password }) => !!password;

const isWalletState = exports.isWalletState = ({ state }) => !!state;

const isGenerate = exports.isGenerate = ({ generate }) => !!generate;
const checkGenerateParams = exports.checkGenerateParams = ({ count, output }) => !!count && count > 0;

const isBalance = exports.isBalance = ({ balance }) => !!balance;
const checkBalanceParams = exports.checkBalanceParams = ({ address }) => !!address && !(0, _lodash.isEmpty)(address);

const isWithdrawAll = exports.isWithdrawAll = ({ withdrawAll }) => !!withdrawAll;
const checkWithdrawParams = exports.checkWithdrawParams = ({ from, to }) => !!from && !!to && !(0, _lodash.isEmpty)(from) && !(0, _lodash.isEmpty)(to);

const isAdd = exports.isAdd = ({ add }) => !!add;
const checkConfigParams = exports.checkConfigParams = ({ etherscanToken }) => !!etherscanToken;

const isHelp = exports.isHelp = ({ help }) => !!help;

const isVersion = exports.isVersion = ({ version }) => !!version;

const _man = [
// Header
{
  header: _chalk2.default.green('Eth Console Wallet'),
  content: 'Lightweight console wallet for Ethereum.'
},
// Create a wallet
{
  header: 'Wallet options',
  optionList: [{
    name: 'init',
    description: 'Generate a new wallet file'
  }, {
    name: 'password',
    typeLabel: 'passphrase',
    description: 'Password is used for getting access to wallet'
  }, {
    name: 'datadir',
    typeLabel: 'path',
    description: `[underline]{Optional}. Path of data folder. By default ${_chalk2.default.underline('[USER_HOME]/.eth-console-wallet/')}`
  }, {
    name: 'force',
    description: `[underline]{Optional}. If you need to create a new wallet. ${_chalk2.default.red('WARNING: Current wallet will be deleted.')}`
  }, {
    name: 'state',
    description: 'Print information about wallet state'
  }]
},
// Generate addresses
{
  header: 'Address options',
  optionList: [{
    name: 'generate'
  }, {
    name: 'count',
    typeLabel: '1..1000',
    description: `Number of addresses which will be generated. By default ${_chalk2.default.underline('1')}.`
  }, {
    name: 'password',
    typeLabel: 'passphrase',
    description: 'Password is used for getting access to wallet'
  }, {
    name: 'output',
    typeLabel: 'path',
    description: '[underline]{Optional}. Print log of generation new addresses to JSON file'
  }, {
    name: 'datadir',
    typeLabel: 'path',
    description: `[underline]{Optional}. Path of data folder. By default ${_chalk2.default.underline('[USER_HOME]/.eth-console-wallet/')}`
  }]
},
// Get balance
{
  header: 'Balance options',
  optionList: [{
    name: 'balance',
    description: 'Get balance'
  }, {
    name: 'address',
    typeLabel: 'address',
    description: 'For current address'
  }, {
    name: 'token',
    typeLabel: 'apikey',
    description: '[underline]{Optional}. This is apikey from [underline]{https://etherscan.io/}. If you added apikey to the config file, you can pass this option.'
  }]
},
// Add config
{
  header: 'Config options',
  optionList: [{
    name: 'add',
    description: 'Add or update config option'
  }, {
    name: 'etherscanToken',
    typeLabel: 'apikey',
    description: 'Api key from [underline]{https://etherscan.io/}. This key will be used for getting balance or send amount of ETH.'
  }, {
    name: 'datadir',
    typeLabel: 'path',
    description: `[underline]{Optional}. Path of data folder. By default ${_chalk2.default.underline('[USER_HOME]/.eth-console-wallet/')}`
  }]
},
// Withdraw
{
  header: 'Withdraw options',
  content: `${_chalk2.default.underline.red('NOTICE:')} Now, It only supports withdraw all amount to another.`
}, {
  optionList: [{
    name: 'withdrawAll',
    description: 'Withdraw all exist amount'
  }, {
    name: 'from',
    typeLabel: 'address',
    description: 'From current address'
  }, {
    name: 'to',
    typeLabel: 'address',
    description: 'To another address'
  }, {
    name: 'password',
    typeLabel: 'passphrase',
    description: 'Password is used for getting access to wallet'
  }, {
    name: 'datadir',
    typeLabel: 'path',
    description: `[underline]{Optional}. Path of data folder. By default ${_chalk2.default.underline('[USER_HOME]/.eth-console-wallet/')}`
  }]
}, {
  header: 'Options',
  optionList: [{
    name: 'help',
    description: 'Print man'
  }, {
    name: 'version',
    alias: 'v',
    description: 'Print current version of app'
  }]
}, {
  content: ['If you have any questions, you can ask them at [underline]{https://github.com/rusfearuth/EthConsoleWallet/issues}.'],
  raw: true
}];

const showMan = exports.showMan = () => console.log((0, _commandLineUsage2.default)(_man));

const showVersion = exports.showVersion = () => console.log(`Version is ${_package2.default.version}`);

const defaultMessage = exports.defaultMessage = () => console.log(`Please use ${_chalk2.default.green('--help')}`);

const errorMessage = exports.errorMessage = (args, error) => {
  console.log('Something went wrong :(\n');
  console.log(`Please report about that to ${_chalk2.default.underline.green('https://github.com/rusfearuth/EthConsoleWallet/issues')}.`);
  console.log('\nPlease attach information below to your issue.');
  console.log('> -----------------------------------------------------------------');
  console.log('Args:');
  console.log(JSON.stringify(args, null, 2));
  console.log('Error:');
  console.log(error);
  console.log('----------------------------------------------------------------- <');
};