// @flow

import {
  gasPrice as etherscan_gasPrice,
  getTransactionCount as etherscan_getTransactionCount,
  getBalance as etherscan_getBalance,
  sendSignedTransaction as etherscan_sendSignedTransaction,
  getTotalBalance as etherscan_getTotalBalance,
} from '../requests/etherscan';
import {
  gasPrice as web3_gasPrice,
  getTransactionCount as web3_getTransactionCount,
  getBalance as web3_getBalance,
  sendSignedTransaction as web3_sendSignedTransaction,
  getTotalBalance as web3_getTotalBalance,
} from '../requests/web3';
import type { RequestParamsType } from './common.types';
import { isEmpty } from 'lodash';

export const gasPrice = async (params: RequestParamsType): Promise<*> => {
  const { apikey, rpcapi } = params;
  if (!!apikey && !isEmpty(apikey)) {
    return await etherscan_gasPrice(apikey);
  }
  return await web3_gasPrice({ rpcapi });
};

export const getTransactionCount = async (
  from: string,
  params: RequestParamsType,
): Promise<*> => {
  const { apikey, rpcapi } = params;
  if (!!apikey && !isEmpty(apikey)) {
    return await etherscan_getTransactionCount(from, apikey);
  }
  return await web3_getTransactionCount(from, { rpcapi });
};

export const getBalance = async (
  from: string,
  params: RequestParamsType,
): Promise<*> => {
  const { apikey, rpcapi } = params;
  if (!!apikey && !isEmpty(apikey)) {
    return await etherscan_getBalance(from, apikey);
  }
  return await web3_getBalance(from, { rpcapi });
};

export const sendSignedTransaction = async (
  txSigned: string,
  params: RequestParamsType,
): Promise<*> => {
  const { apikey, rpcapi } = params;
  if (!!apikey && !isEmpty(apikey)) {
    return await etherscan_sendSignedTransaction(txSigned, apikey);
  }
  return await web3_sendSignedTransaction(txSigned, { rpcapi });
};

export const getTotalBalance = async (
  addresses: string[],
  params: RequestParamsType,
  progress: (number, number, any) => void,
): Promise<*> => {
  const { apikey, rpcapi } = params;
  if (!!apikey && !isEmpty(apikey)) {
    return await etherscan_getTotalBalance(addresses, apikey, progress);
  }
  return await web3_getTotalBalance(addresses, { rpcapi }, progress);
};
