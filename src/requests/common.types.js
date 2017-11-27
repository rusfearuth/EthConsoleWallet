// @flow

export type BalanceType = {|
  +status: string,
  +message: string,
  +result: string,
|};

export type RequestParamsType = {|
  apikey: ?string,
  rpcapi: ?string,
|};
