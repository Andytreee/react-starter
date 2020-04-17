const { resolve, src, dllLibs } = require("./conf");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const baseConfig = require("./webpack.config.base");
const webpackMerge = require("webpack-merge");
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

export default webpackMerge(baseConfig, {
    devtool: "source-map",
    mode: 'production',
    entry: {
        main: resolve(src + "/app.js"), // 主网站入口
    },
    module: {
        rules: [
        ]
    },
    externals: [ 'react', 'lodash', 'mobx'],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\\/]node_modules[\\\/]/,
                    priority: -10,
                    chunks: 'initial',
                    minChunks: 2 //最少引入了1次
                },
                common: {
                    name: 'chunk-common',
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }
        },
        minimizer: [
            /* config.optimization.minimizer('terser') */
            new TerserPlugin(
                {
                    terserOptions: {
                        compress: {
                            arrows: false,
                            collapse_vars: false,
                            comparisons: false,
                            computed_props: false,
                            hoist_funs: false,
                            hoist_props: false,
                            hoist_vars: false,
                            inline: false,
                            loops: false,
                            negate_iife: false,
                            properties: false,
                            reduce_funcs: false,
                            reduce_vars: false,
                            switches: false,
                            toplevel: false,
                            typeofs: false,
                            booleans: true,
                            if_return: true,
                            sequences: true,
                            unused: true,
                            conditionals: true,
                            dead_code: true,
                            evaluate: true,
                            drop_console: true
                        },
                        mangle: {
                            safari10: true
                        }
                    },
                    sourceMap: true,
                    cache: true,
                    parallel: true,
                    extractComments: false
                }
            )
        ],
        runtimeChunk: {
            name: 'manifest'
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin(),

        new AddAssetHtmlPlugin(
            dllLibs.map( filepath => ({
                // 要添加到编译中的文件的绝对路径，以及生成的HTML文件。支持globby字符串
                filepath,
                // 文件输出目录
                outputPath: 'vendor',
                // 脚本或链接标记的公共路径
                publicPath: 'vendor'
            }) )
        )
    ],
});
