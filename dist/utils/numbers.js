'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isHex = exports.toBigNumber = undefined;

var _web3Utils = require('web3-utils');

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const toBigNumber = exports.toBigNumber = value => {
  if (typeof value === 'string') {
    const numberValue = isHex(value, true) ? _web3Utils2.default.hexToNumber(value) : Number(value);
    return new _bignumber2.default(numberValue, 10);
  }
  return new _bignumber2.default(value, 10);
};
const isHex = exports.isHex = (hex, stringOnly = false) => {
  const checkTypes = stringOnly ? (0, _lodash.isString)(hex) : (0, _lodash.isString)(hex) || (0, _lodash.isNumber)(hex);
  return checkTypes && /^(-)?0x[0-9a-f]+$/i.test(String(hex));
};