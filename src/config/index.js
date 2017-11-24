// @flow
import type { ArgsType } from '../utils/cli.types';
import { readConfig, writeConfig } from '../utils/store';
import type { ConfigType } from './types';
import { isEmpty } from 'lodash';
import chalk from 'chalk';

export const updateConfing = async (args: ArgsType): Promise<*> => {
  let config: ConfigType = await readConfig(args);
  const { etherscanToken } = args;
  if (etherscanToken && !isEmpty(etherscanToken)) {
    const etherscan = { apikey: etherscanToken };
    config = { ...config, etherscan };
  }

  await writeConfig(args, config);

  const congrate = chalk.green('Config has been updated');
  console.log(congrate);
};

export const getApikey = (args: ArgsType): Promise<*> =>
  readConfig(args).then(
    config => args.token || (config.etherscan && config.etherscan.apikey),
  );
