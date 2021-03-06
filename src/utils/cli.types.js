// @flow
import { gasPriceValue } from './numbers';

export type CliOptionType = {|
  +name: string,
  +alias?: string,
  +type: Class<String> | Class<Number> | Class<Boolean>,
  +defaultOption?: boolean,
  +defaultValue?: string | number | boolean,
|};

export type SendingFeeType = $Keys<typeof gasPriceValue>;

export type ArgsType = {|
  +init?: boolean,
  +password?: string,
  +state?: boolean,
  // Wallet balance
  +walletBalance?: boolean,
  // Generate new addresses
  +generate?: boolean,
  +count?: number,
  +datadir: string,
  +force?: boolean,
  +output?: string,
  // Balance
  +balance?: boolean,
  +address?: string,
  +token?: string,
  +ipc?: string,
  +rpc?: string,
  // Withdraw
  +withdrawAll?: boolean,
  +from?: string,
  +to?: string,
  +file?: string,
  // Send
  +send?: boolean,
  +value?: string,
  +fee: SendingFeeType,
  // Config
  +add?: boolean,
  +etherscanToken?: string,
  +ipcpath?: string,
  +rpcapi?: string,
  // Help
  +help?: boolean,
  // Version
  +version?: boolean,
|};

export type FilterType = (key: string) => boolean;
