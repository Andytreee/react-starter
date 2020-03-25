import { message } from 'antd';
import { getStorage } from '../utils/util';

/**
 * @desc 对ajax进行进一步的封装
 * @param set 继承ajax的 set, type 默认是get, tips提示信息
 * @return promise 对象
 */
export default function ajax(set) {
    let requestHeader = {
        type: 'get',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8'
    };
    if(set.type && set.type.toLowerCase() === 'post') set.data = JSON.stringify(set.data);
    return new Promise((resolve, reject) => {
        set = Object.assign(requestHeader, set);
        if(!set.url.startsWith('/tetris-eureka-manage')) {
            set.url = '/tetris-eureka-process/api/v1' + set.url;
        }
        $.ajax(set).done(res => {
            //没有登陆
            if (res.statusCode === 40004) {
                if(window.location.href.indexOf('login') === -1) {
                    window.location.href = `/login`;
                }
                reject('用户未登录');
            }
            if (res.statusCode === 1000) {
                if (set.successTips) {
                    message.success(set.successTips);
                }
                resolve(res.data);
            } else {
                message.error( res.message || '系统发生错误');
                reject(false);
            }
        }).fail(( xhr, textStatus ) => {
            message.error(`status: ${xhr.status} text: ${textStatus}`);
            if(xhr.status === 401) {
                if(window.location.href.indexOf('login') === -1) {
                    window.location.href = `/login`;
                }
            }
            reject(xhr);
        })
    });
}
