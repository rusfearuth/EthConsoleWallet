// @flow

export type CliOptionType = {|
  +name: string,
  +alias?: string,
  +type: Class<String> | Class<Number> | Class<Boolean>,
  +defaultOption?: boolean,
  +defaultValue?: string | number | boolean,
|};

export type ArgsType = {|
  +init?: boolean,
  +password?: string,
  +state?: boolean,
  +generate?: boolean,
  +count?: number,
  +datadir: string,
  +force?: boolean,
  +output?: string,
  +address?: string,
  +token?: string,
  +balance?: boolean,
  +withdrawAll?: boolean,
  +from?: string,
  +to?: string,
  // Config
  +add?: boolean,
  +etherscanToken?: string,
  // Help
  +help?: boolean,
  // Version
  +version?: boolean,
|};
