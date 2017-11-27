// @flow
import Web3 from 'web3';

export type Web3ProviderType = {|
  +rpcapi: ?string,
|};

export type Web3Type = Class<Web3>;

export type Web3TransactionType = {|
  +blockHash: string,
  +blockNumber: number,
  +contractAddress: ?string,
  +cumulativeGasUsed: number,
  +from: string,
  +gasUsed: number,
  +logs: any,
  +logsBloom: string,
  +status: string,
  +to: string,
  +transactionHash: string,
  +transactionIndex: number,
|};
