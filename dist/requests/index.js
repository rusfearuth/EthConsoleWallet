'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchGetJson = undefined;

var _lodash = require('lodash');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fetchGetJson = exports.fetchGetJson = (base, params, qr) => (0, _nodeFetch2.default)(_buildUrl(base, qr), params).then(resp => resp.json());

const _buildUrl = (base, params
// $FlowFixMe
) => (0, _lodash.isEmpty)(params) ? base : `${base}?${_buildQueryParams(params)}`;

const _buildQueryParams = params => Object.keys(params).filter(item => item).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(_anyToString(params[k]))}`).join('&');

const _anyToString = value => typeof value !== 'object' ? String(value) : JSON.stringify(value);