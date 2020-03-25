import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CasesensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import SizePlugin from 'size-plugin';
import { build, resolve, src, PUBLIC } from './conf';
import {theme} from "./theme";
import scssPreset from './scssPreset';

export default {
    output: {
        path: resolve(build),
        filename: `js/[name].[hash:8].js`
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
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: resolve(src),
                use: ['babel-loader']
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
                // 图片加载处理
                test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
                include: resolve(src),
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                            name: 'images/[name].[ext]'
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
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
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
        new SizePlugin(), //Prints the gzipped sizes of your webpack assets and the changes since the last build.
        new CasesensitivePathsPlugin(),
        new HtmlWebpackPlugin({
            template: resolve(PUBLIC + '/index.html'),
            filename: 'index.html',
            favicon: resolve(PUBLIC + '/favicon.ico')
        }),
        new CopyWebpackPlugin([
            {
                from: resolve(PUBLIC),
                to: resolve(build),
                toType: 'dir'
            }
        ])
    ]
};
