'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApikey = exports.updateConfing = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _store = require('../utils/store');

var _lodash = require('lodash');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const updateConfing = exports.updateConfing = async args => {
  let config = await (0, _store.readConfig)(args);
  const { etherscanToken } = args;
  if (etherscanToken && !(0, _lodash.isEmpty)(etherscanToken)) {
    const etherscan = { apikey: etherscanToken };
    config = _extends({}, config, { etherscan });
  }

  await (0, _store.writeConfig)(args, config);

  const congrate = _chalk2.default.green('Config has been updated');
  console.log(congrate);
};

const getApikey = exports.getApikey = args => (0, _store.readConfig)(args).then(config => args.token || config.etherscan && config.etherscan.apikey);