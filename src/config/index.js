// @flow
import type { ArgsType } from '../utils/cli.types';
import { readConfig, writeConfig } from '../utils/store';
import type { ConfigType } from './types';
import { isEmpty } from 'lodash';
import chalk from 'chalk';

export const updateConfing = async (args: ArgsType): Promise<*> => {
  let config: ConfigType = await readConfig(args);
  const { etherscanToken, ipcpath, rpcapi } = args;
  if (etherscanToken && !isEmpty(etherscanToken)) {
    const etherscan = { apikey: etherscanToken };
    config = { ...config, etherscan };
  }
  if (ipcpath && !isEmpty(ipcpath)) {
    const node = { ...(config.node || {}), ipcpath };
    config = { ...config, node };
  }
  if (rpcapi && !isEmpty(rpcapi)) {
    const node = { ...(config.node || {}), rpcapi };
    config = { ...config, node };
  }

  await writeConfig(args, config);

  const congrate = chalk.green('Config has been updated');
  console.log(congrate);
};

export const getApikey = (args: ArgsType): Promise<*> =>
  readConfig(args).then(
    config => args.token || (config.etherscan && config.etherscan.apikey),
  );

export const getIpc = (args: ArgsType): Promise<*> =>
  readConfig(args).then(
    config => args.ipc || (config.node && config.node.ipcpath),
  );

export const getRpcApi = (args: ArgsType): Promise<*> =>
  readConfig(args).then(
    config => args.rpc || (config.node && config.node.rpcapi),
  );
