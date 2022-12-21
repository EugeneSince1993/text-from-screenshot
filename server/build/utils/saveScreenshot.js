"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadFile = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _multer = _interopRequireDefault(require("multer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var uploadFile = function uploadFile() {
  var storage = _multer["default"].diskStorage({
    destination: function destination(req, file, callback) {
      var path = './images';
      if (!_fs["default"].existsSync(path)) {
        _fs["default"].mkdirSync(path);
      }
      callback(null, path);
    },
    filename: function filename(req, file, callback) {
      callback(null, file.originalname);
    }
  });
  var upload = (0, _multer["default"])({
    storage: storage
  });
  return upload;
};
exports.uploadFile = uploadFile;