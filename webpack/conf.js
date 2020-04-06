import path from "path";

export const dist = "../build"; // 打包目录
export const build = "../build"; // 打包目录
export const src = "../src"; // 源码目录
export const PUBLIC = '../public'; // 公共资源目录
export const resolve = function(url) {
  return path.resolve(__dirname, url);
};
