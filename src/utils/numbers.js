// @flow
import utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import { isString, isNumber } from 'lodash';

export const toBigNumber = (value: number | string): Class<BigNumber> => {
  if (typeof value === 'string') {
    const numberValue: number = isHex(value, true)
      ? utils.hexToNumber(value)
      : Number(value);
    return new BigNumber(numberValue, 10);
  }
  return new BigNumber(value, 10);
};

export const isHex = (
  hex: string | number,
  stringOnly: ?boolean = false,
): boolean => {
  const checkTypes: boolean = stringOnly
    ? isString(hex)
    : isString(hex) || isNumber(hex);
  return checkTypes && /^(-)?0x[0-9a-f]+$/i.test(String(hex));
};
