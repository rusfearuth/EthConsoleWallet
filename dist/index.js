'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _cli = require('./utils/cli');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_app2.default.main(_cli.args);