'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readConfig = exports.writeConfig = exports.writeOutput = exports.hasWallet = exports.readWallet = exports.writeWallet = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _ethLightwallet = require('eth-lightwallet');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _defaultWallet = 'wallet.json';
const _defaultConfig = 'config.json';

const writeWallet = exports.writeWallet = ({ datadir }, keystore) => _fsExtra2.default.ensureDir(datadir).then(() => _writeJson(datadir, keystore)).catch(e => _makeDataDir(datadir)).then(() => _writeJson(datadir, keystore));

const readWallet = exports.readWallet = ({ datadir }) => _fsExtra2.default.readJson(_buildWalletPath(datadir)).then(data => _ethLightwallet.keystore.deserialize(data));

const hasWallet = exports.hasWallet = ({ datadir }) => _fsExtra2.default.pathExists(_buildWalletPath(datadir));

const writeOutput = exports.writeOutput = ({ output }, data) => _fsExtra2.default.writeJson(output, data);

const writeConfig = exports.writeConfig = ({ datadir }, data) => _fsExtra2.default.writeJson(_buildConfigPath(datadir), data);

const readConfig = exports.readConfig = ({ datadir }) => _fsExtra2.default.ensureFile(_buildConfigPath(datadir)).then(data => _fsExtra2.default.readJson(_buildConfigPath(datadir))).catch(error => ({}));

const _makeDataDir = path => _fsExtra2.default.mkdir();

const _writeJson = (datadir, json) => _fsExtra2.default.writeJson(_buildWalletPath(datadir), json.serialize());

const _buildWalletPath = datadir => _path2.default.join(datadir, _defaultWallet);

const _buildConfigPath = datadir => _path2.default.join(datadir, _defaultConfig);