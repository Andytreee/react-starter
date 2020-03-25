import axios from 'axios';
import api from './api'
import qs from 'qs';
import { message } from 'antd';
import { API_CONFIG } from 'config';

const {
    baseURL,
    loginURL,
    prefix,
    requestTypes,
    urlExp,
} = API_CONFIG;
const request = axios.create({
    baseURL,
    paramsSerializer: params => qs.stringify(params),
    headers: {
        contentType: 'application/json;charset=UTF-8',
    }
});
request.interceptors.request.use(function (config) {
    if(config.method === 'get') {
        config.params = config.data;
    }
    // 在发起请求请做一些业务处理
    return config;
}, function (error) {
    // 对请求失败做处理
    return Promise.reject(error);
});
request.interceptors.response.use(function (res) {
    // 对响应数据做处理
    res = res.data;

    return res.data;
}, function (error, error1) {
    // 对响应错误做处理
    if(error.response.status === 401) {
        if(window.location.href.indexOf('login') === -1) {
            window.location.href = loginURL;
        }
        message.warning( '用户未登录');
    }else {
        console.log(error.response)
    }
    return Promise.reject(error);
});
const gen = params => {
    let [ method, url] = params.split(' ');
    method = method.toLowerCase();
    if(!requestTypes.includes(method)) {
        throw new TypeError(`不支持的请求类型!${requestTypes.toString()}`)
    }
    if(!urlExp.test(url)) {
        console.error(`请求url为${url}`)
    }
    url = prefix + url;
    return data => request({ url, data, method })
};
const APIFunction = Object.create(null);
for (const key in api) {
    APIFunction[key] = gen(api[key])
}
export default APIFunction
