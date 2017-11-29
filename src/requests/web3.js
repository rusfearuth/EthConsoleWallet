// @flow

import type { BalanceType } from './common.types';
import type {
  Web3Type,
  Web3ProviderType,
  Web3TransactionType,
} from './web3.types';
import Web3 from 'web3';
import net from 'net';
import { delay } from '../utils/promise';
import { toBigNumber } from '../utils/numbers';

export const getBalance = async (
  address: string,
  config: Web3ProviderType,
): Promise<BalanceType> => {
  let web3 = _getWeb3Client(config);
  const result = await web3.eth.getBalance(address);
  return {
    status: '1',
    message: 'OK',
    result,
  };
};

export const getTotalBalance = async (
  addresses: string[],
  config: Web3ProviderType,
  progress?: (number, number, any) => void,
): Promise<*> => {
  let promises: Array<Promise<BalanceType>> = [];
  let result = toBigNumber(0);
  let progressCount: number = 0;
  for (let address of addresses) {
    promises.push(getBalance(address, config));
    if (promises.length === 100) {
      await delay(500);
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

  resps.forEach(resp => {
    result = result.add(toBigNumber(resp.result));
  });

  progressCount += promises.length;
  if (!!progress) {
    progress(progressCount, addresses.length, result);
  }

  promises = [];

  return result;
};

export const gasPrice = async (config: Web3ProviderType): Promise<*> => {
  const web3 = _getWeb3Client(config);
  const result = await web3.eth.getGasPrice();
  return {
    status: '1',
    message: 'OK',
    result,
  };
};

export const getTransactionCount = async (
  from: string,
  config: Web3ProviderType,
): Promise<*> => {
  const web3 = _getWeb3Client(config);
  const result = await web3.eth.getTransactionCount(from);
  return {
    status: '1',
    message: 'OK',
    result: Web3.utils.toHex(result),
  };
};

export const sendSignedTransaction = async (
  from: string,
  config: Web3ProviderType,
): Promise<*> => {
  const web3 = _getWeb3Client(config);
  const result: Web3TransactionType = await web3.eth.sendSignedTransaction(
    from,
  );
  return {
    status: '1',
    message: 'OK',
    result: result.transactionHash,
  };
};

const _getWeb3Client = (config: Web3ProviderType): Web3Type => {
  const { rpcapi } = config;

  if (!rpcapi) {
    throw new Error(`You should set ipcpath or rpcapi param for config`);
  }

  const provider = new Web3.providers.HttpProvider(rpcapi);

  return new Web3(provider);
};
