"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bashWalker = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _child_process = require("child_process");

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var run = function run(cmd) {
  var bashExecutor = new Promise(function (resolve, reject) {
    (0, _child_process.exec)(cmd, function (err, stdout, stderr) {
      if (err) {
        reject(err);
        return;
      }

      resolve([stdout, stderr]);
    });
  });
  return bashExecutor;
};

var bashWalker =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(commands) {
    var tag,
        dir,
        filename,
        filePath,
        _loop,
        i,
        _args2 = arguments;

    return _regenerator.default.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            tag = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : '';
            console.log('START');
            _context2.next = 4;
            return _fsExtra.default.ensureDir('./__export');

          case 4:
            _context2.t0 = _context2.sent;

            if (_context2.t0) {
              _context2.next = 7;
              break;
            }

            _context2.t0 = './__export';

          case 7:
            dir = _context2.t0;
            filename = "".concat(tag, "_").concat(Date.now(), ".log");
            filePath = _path.default.join(dir, filename);
            console.log('Logs :', filePath);
            _loop =
            /*#__PURE__*/
            _regenerator.default.mark(function _loop(i) {
              var ret, errInfo;
              return _regenerator.default.wrap(function _loop$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return run(commands[i]).catch(function (err) {
                        return console.log(" - !! ERROR !! ".concat(commands[i], " ").concat(err));
                      });

                    case 2:
                      ret = _context.sent;
                      errInfo = "\n==> Execute ".concat(i, ": ").concat(commands[i], "\n - INFO: ").concat(ret[0], "\n - WARNING: ").concat(ret[1], "\n    ");
                      console.log(errInfo);
                      _context.next = 7;
                      return _fsExtra.default.appendFile(filePath, errInfo);

                    case 7:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _loop, this);
            });
            i = 0;

          case 13:
            if (!(i < commands.length)) {
              _context2.next = 18;
              break;
            }

            return _context2.delegateYield(_loop(i), "t1", 15);

          case 15:
            i++;
            _context2.next = 13;
            break;

          case 18:
            console.log('DONE');

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee, this);
  }));

  return function bashWalker(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.bashWalker = bashWalker;