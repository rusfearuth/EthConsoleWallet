'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionByHash = exports.sendSignedTransaction = exports.gasPrice = exports.getTransactionCount = exports.getBalance = undefined;

var _index = require('./index');

const BASE_URL = 'https://api.etherscan.io/api';

const getBalance = exports.getBalance = (address, apikey) => (0, _index.fetchGetJson)(BASE_URL, {}, _mapToBalanceQueryParams(address, apikey));

const getTransactionCount = exports.getTransactionCount = (address, apikey) => (0, _index.fetchGetJson)(BASE_URL, {}, _mapToGetTransactionQueryParams(address, apikey));

const gasPrice = exports.gasPrice = apikey => (0, _index.fetchGetJson)(BASE_URL, { timeout: 30000 }, _mapToGasPriceQueryParams(apikey));

const sendSignedTransaction = exports.sendSignedTransaction = (hex, apikey) => (0, _index.fetchGetJson)(BASE_URL, {}, _mapToSignedTransactionQueryParams(hex, apikey));

const getTransactionByHash = exports.getTransactionByHash = (txhash, apikey) => (0, _index.fetchGetJson)(BASE_URL, {}, _mapToTransactionByHashQueryParams(txhash, apikey));

const _mapToBalanceQueryParams = (address, apikey) => ({
  module: 'account',
  action: 'balance',
  address,
  tag: 'latest',
  apikey
});

const _mapToGetTransactionQueryParams = (address, apikey) => ({
  module: 'proxy',
  action: 'eth_getTransactionCount',
  address,
  tag: 'latest',
  apikey
});

const _mapToGasPriceQueryParams = apikey => ({
  module: 'proxy',
  action: 'eth_gasPrice',
  apikey
});

const _mapToSignedTransactionQueryParams = (hex, apikey) => ({
  module: 'proxy',
  action: 'eth_sendRawTransaction',
  hex,
  apikey
});

const _mapToTransactionByHashQueryParams = (txhash, apikey) => ({
  module: 'proxy',
  action: 'eth_getTransactionByHash',
  txhash,
  apikey
});