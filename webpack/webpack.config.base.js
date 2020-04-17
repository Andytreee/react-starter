const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CasesensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { dist, resolve, src, PUBLIC, dllLibs } = require('./conf');
const {theme} = require("./theme");
const scssPreset = require('./scssPreset');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports =  {
    output: {
        path: resolve(dist),
        filename: `js/[name].[hash:8].js`,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss', '.css', '.less'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            '@': resolve(src),
            conf: resolve(src + '/config'),
            server: resolve(src + '/server'),
            utils: resolve(src + '/utils'),
            components: resolve(src + '/components'),
        }
    },
    module: {
        noParse: /jquery|lodash/,
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: resolve(src),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true
                        }
                    }
                ]
            },
            {
                test: /\.(woff|eot|ttf|svg)$/,
                include: resolve(src),
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10,
                            name: 'fonts/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader?minimize=false'
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                include: resolve(src),
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,  // 超过10k才打包
                            name: '[name]_[hash:6].[ext]',
                            outputPath: 'assets'
                        }
                    }
                ]
            },
            {
                test: /\.(css|less)$/,
                include: [resolve('../node_modules'), resolve(src)],
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader'},
                    {
                        loader: 'postcss-loader',  options: {
                            options: {},
                        }
                    },
                    { loader: 'less-loader', options: { javascriptEnabled: true, modifyVars: theme } }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                include: [resolve('../node_modules'), resolve(src)],
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',  options: {
                            options: {},
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            prependData: (loaderContext) => {
                                // More information about available properties https://webpack.js.org/api/loaders/
                                return Object.entries(scssPreset).map( item => item.join(':')).join(';');
                            },
                            sourceMap: true,
                        },
                    },
                ],
            },
        ]
    },
    plugins: [
        new CasesensitivePathsPlugin(),
        new HtmlWebpackPlugin({
            template: resolve(PUBLIC + '/index.html'),
            filename: 'index.html',
            favicon: resolve(PUBLIC + '/favicon.ico')
        }),
        new CopyWebpackPlugin([
            {
                from: resolve(PUBLIC),
                to: resolve(dist),
                toType: 'dir'
            }
        ]),
    ]
};
