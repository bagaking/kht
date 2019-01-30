"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wait = require("./wait");

Object.keys(_wait).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _wait[key];
    }
  });
});