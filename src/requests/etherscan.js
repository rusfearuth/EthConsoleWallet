// @flow

import { fetchGet } from './index';
import { toBigNumber } from '../utils/numbers';
import { delay } from '../utils/promise';
import type { QueryParamsType } from './index.types';
import type {
  TransactionCountType,
  TransactionByHashType,
  GasPriceType,
  TransactionType,
} from './etherscan.types';
import type { BalanceType } from './common.types';

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

export const getGasPrice = (apikey: string): Promise<GasPriceType> =>
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

export const getTotalBalance = async (
  addresses: string[],
  apikey: string,
  progress?: (number, number, any) => void,
): Promise<*> => {
  let promises: Array<Promise<BalanceType>> = [];
  let result = toBigNumber(0);
  let progressCount: number = 0;
  for (let address of addresses) {
    promises.push(getBalance(address, apikey));
    if (promises.length === 20) {
      await delay(750);
      const resps: BalanceType[] = await Promise.all(promises);

      resps.forEach(resp => {
        result = result.add(toBigNumber(resp.result));
      });

      progressCount += promises.length;
      if (!!progress) {
        progress(progressCount, addresses.length, result);
      }

      promises = [];
    }
  }

  await delay(500);
  const resps: BalanceType[] = await Promise.all(promises);
  progressCount += promises.length;
  if (!!progress) {
    progress(progressCount, addresses.length);
  }

  resps.forEach(resp => {
    result = result.add(toBigNumber(resp.result));
  });

  promises = [];

  return result;
};

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
