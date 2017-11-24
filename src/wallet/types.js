// @flow
import Mnemonic from 'bitcore-mnemonic';

export type MnemonicType = Class<Mnemonic>;

export type MnemonicResultType = {|
  +words: string,
  +salt: string,
  +xprv: string,
|};

export type VaultOptionsType = {|
  +password: string,
  +seedPhrase?: string,
  +salt?: string,
  +hdPathString?: string,
|};

export type AmountOptionsType = {|
  +gasLimit: string,
  +gasPrice: string,
  +value: string,
|};

export type TxOptionsType = {|
  +to: string,
  +nonce: string,
  ...$Exact<AmountOptionsType>,
|};
