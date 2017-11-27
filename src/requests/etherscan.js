// @flow

import { fetchGet } from './index';
import type { QueryParamsType } from './index.types';
import type {
  BalanceType,
  TransactionCountType,
  TransactionByHashType,
  GasPriceType,
  TransactionType,
} from './etherscan.types';

const BASE_URL: string = 'https://api.etherscan.io/api';

export const getBalance = (
  address: string,
  apikey: string,
): Promise<BalanceType> =>
  fetchGet(BASE_URL, {}, _mapToBalanceQueryParams(address, apikey));

export const getTransactionCount = (
  address: string,
  apikey: string,
): Promise<TransactionCountType> =>
  fetchGet(BASE_URL, {}, _mapToGetTransactionQueryParams(address, apikey));

export const gasPrice = (apikey: string): Promise<GasPriceType> =>
  fetchGet(BASE_URL, { timeout: 30000 }, _mapToGasPriceQueryParams(apikey));

export const sendSignedTransaction = (
  hex: string,
  apikey: string,
): Promise<TransactionType> =>
  fetchGet(BASE_URL, {}, _mapToSignedTransactionQueryParams(hex, apikey));

export const getTransactionByHash = (
  txhash: string,
  apikey: string,
): Promise<TransactionByHashType> =>
  fetchGet(BASE_URL, {}, _mapToTransactionByHashQueryParams(txhash, apikey));

const _mapToBalanceQueryParams = (
  address: string,
  apikey: string,
): QueryParamsType => ({
  module: 'account',
  action: 'balance',
  address,
  tag: 'latest',
  apikey,
});

const _mapToGetTransactionQueryParams = (
  address: string,
  apikey: string,
): QueryParamsType => ({
  module: 'proxy',
  action: 'eth_getTransactionCount',
  address,
  tag: 'latest',
  apikey,
});

const _mapToGasPriceQueryParams = (apikey: string): QueryParamsType => ({
  module: 'proxy',
  action: 'eth_gasPrice',
  apikey,
});

const _mapToSignedTransactionQueryParams = (
  hex: string,
  apikey: string,
): QueryParamsType => ({
  module: 'proxy',
  action: 'eth_sendRawTransaction',
  hex,
  apikey,
});

const _mapToTransactionByHashQueryParams = (
  txhash: string,
  apikey: string,
): QueryParamsType => ({
  module: 'proxy',
  action: 'eth_getTransactionByHash',
  txhash,
  apikey,
});
