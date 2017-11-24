// @flow

import type { QueryParamsType } from './index.types';
import { isEmpty } from 'lodash';
import fetch from 'node-fetch';

export const fetchGetJson = <T>(
  base: string,
  params: any,
  qr: ?QueryParamsType,
): Promise<T> => fetch(_buildUrl(base, qr), params).then(resp => resp.json());

const _buildUrl = (base: string, params: ?QueryParamsType): string =>
  // $FlowFixMe
  isEmpty(params) ? base : `${base}?${_buildQueryParams(params)}`;

const _buildQueryParams = (params: QueryParamsType): string =>
  Object.keys(params)
    .filter(item => item)
    .map(
      k =>
        `${encodeURIComponent(k)}=${encodeURIComponent(
          _anyToString(params[k]),
        )}`,
    )
    .join('&');

const _anyToString = (value: any): string =>
  typeof value !== 'object' ? String(value) : JSON.stringify(value);
