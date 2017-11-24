// @flow

export type BalanceType = {|
  +status: string,
  +message: string,
  +result: string,
|};

export type TransactionCountType = {|
  +jsonrpc: string,
  +result: string,
  +id: number,
|};

export type GasPriceType = {|
  +jsonrpc: string,
  +result: string,
  +id: number,
|};

export type TransactionType = {|
  +jsonrpc: string,
  +result: string,
  +id: number,
|};

export type TransactionByHashType = {|
  +jsonrpc: string,
  +result: {
    +blockHash: string,
    +blockNumber: string,
    +condition: ?string,
    +creates: ?string,
    +from: string,
    +gas: string,
    +gasPrice: string,
    +hash: string,
    +input: string,
    +networkId: ?string,
    +nonce: string,
    +publicKey: string,
    +r: string,
    +raw: string,
    +s: string,
    +standardV: string,
    +to: string,
    +transactionIndex: string,
    +v: string,
    +value: string,
  },
  +id: number,
|};
