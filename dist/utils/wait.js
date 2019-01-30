"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forMs = forMs;
exports.forCondition = forCondition;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function forMs(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function forCondition(_x) {
  return _forCondition.apply(this, arguments);
}

function _forCondition() {
  _forCondition = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(fnPredict) {
    var spanMs,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            spanMs = _args.length > 1 && _args[1] !== undefined ? _args[1] : 100;

          case 1:
            if (!true) {
              _context.next = 8;
              break;
            }

            if (!fnPredict()) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return");

          case 4:
            _context.next = 6;
            return forMs(spanMs);

          case 6:
            _context.next = 1;
            break;

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _forCondition.apply(this, arguments);
}