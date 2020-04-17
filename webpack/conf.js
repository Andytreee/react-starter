const path = require("path");

function resolve(url) {
  return path.resolve(__dirname, url);
}
const PUBLIC = '../public';

module.exports = {
  dist: '../dist',  // 打包路径
  src: '../src',   // 源码路径
  PUBLIC: '../public',   // 公共资源路径
  resolve,
};