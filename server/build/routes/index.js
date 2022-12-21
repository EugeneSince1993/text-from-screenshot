"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _screenshotRouter = _interopRequireDefault(require("./screenshotRouter.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = _express["default"].Router();
router.use('/screenshot', _screenshotRouter["default"]);
var _default = router;
exports["default"] = _default;