// @flow

export type ConfigType = {
  +etherscan?: {
    +apikey: string,
  },
  +node?: {
    +ipcpath?: string,
    +rpcapi?: string,
  },
};
