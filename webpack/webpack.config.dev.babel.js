import { dist, resolve, src } from "./conf";
import baseConfig from './webpack.config.base';
import { theme } from './theme';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import url from 'url';
import chalk from 'chalk';
const address = require('address');
const defaultGateway = require('default-gateway');
const { openBrowser } = require('./openBrowser');
const { getPortPromise } = require('portfinder');

// This can only return an IPv4 address
const result = defaultGateway.v4.sync();
const lanUrl = address.ip(result && result.interface);
const HOST = '0.0.0.0';
const PROXY_HOST = process.env.NODE_HOST || '10.28.200.184:8888';
const useHttps = false;

const config = webpackMerge(baseConfig, {
    mode: 'development',
    entry: [
        'react-hot-loader/patch', //  开启react代码的模块热替换（HMR）
        'webpack/hot/dev-server', // 为热替换（HMR）打包好运行代码
    ],
    module: {
        rules: []
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(), //热加载插件
    ],
    devServer: { // 服务器
        https: useHttps,
        compress: true,
        host: HOST,
        inline: true,
        hot:  true,
        open: false,
        historyApiFallback: true, // using html5 router.
        contentBase: resolve(dist),
        proxy: {
            '/api/v1': {
                target: `http://${PROXY_HOST}`,
                changeOrigin: true,
                secure: false,
            }
        }
    }
});

// 每次构建完后显示
const display = async port => {
    let isFirstCompile = true;
    const protocol = useHttps ? 'https' : 'http';
    const prettyPrintUrl = async (hostname, port) => {
        return url.format({
            protocol,
            hostname,
            port,
            pathname: '/'
        })
    };
    return {
        apply: (compiler) => {
            compiler.hooks.done.tap('afterCompile', async (compilation) => {
                const localUrl = await prettyPrintUrl(HOST === '0.0.0.0'? 'localhost': HOST, port);
                const networkUrl = await prettyPrintUrl(lanUrl, port)
                if(isFirstCompile) {
                    isFirstCompile = false;
                    openBrowser(localUrl)
                }
                console.log(`\n App running at:\n\n  - Local:   ${chalk.cyan(localUrl)} \n  - Network: ${chalk.cyan(networkUrl)}`);
            });
        }
    }
};
// 搜寻端口，合并配置
const merge = async config => {
    const PORT = await getPortPromise();
    config.devServer.port = PORT;
    config.entry.push(
        'webpack-dev-server/client?http://' + HOST + ':' + PORT,
        resolve(src + '/app.js')
    ); //  为webpack-dev-server的环境打包好运行代码)
    config.devServer.port = PORT;
    config.plugins.push(await display(PORT))
    return config
};

export default merge(config);
