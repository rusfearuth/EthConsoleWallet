// @flow

import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { keystore } from 'eth-lightwallet';
import type { ArgsType } from './cli.types';
import type { ConfigType } from '../config/types';

const _defaultWallet = 'wallet.json';
const _defaultConfig = 'config.json';

export const writeWallet = (
  { datadir }: ArgsType,
  keystore: Object,
): Promise<*> =>
  fs
    .ensureDir(datadir)
    .then(() => _writeJson(datadir, keystore))
    .catch(e => _makeDataDir(datadir))
    .then(() => _writeJson(datadir, keystore));

export const readWallet = ({ datadir }: ArgsType): Promise<*> =>
  fs
    .readJson(_buildWalletPath(datadir))
    .then(data => keystore.deserialize(data));

export const hasWallet = ({ datadir }: ArgsType): Promise<*> =>
  fs.pathExists(_buildWalletPath(datadir));

export const writeOutput = ({ output }: ArgsType, data: Object): Promise<*> =>
  fs.writeJson(output, data);

export const writeConfig = (
  { datadir }: ArgsType,
  data: ConfigType,
): Promise<*> => fs.writeJson(_buildConfigPath(datadir), data);

export const readConfig = ({ datadir }: ArgsType): Promise<ConfigType> =>
  fs
    .ensureFile(_buildConfigPath(datadir))
    .then(data => fs.readJson(_buildConfigPath(datadir)))
    .catch(error => ({}));

const _makeDataDir = (path: string): Promise<*> => fs.mkdir();

const _writeJson = (datadir: string, json: any): Promise<*> =>
  fs.writeJson(_buildWalletPath(datadir), json.serialize());

const _buildWalletPath = (datadir: string): string =>
  path.join(datadir, _defaultWallet);

const _buildConfigPath = (datadir: string): string =>
  path.join(datadir, _defaultConfig);
