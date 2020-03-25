// api相关配置
export const API_CONFIG = {
    baseURL: '',    // ex www.tetris.com
    prefix: '',     // ex  /api/v1
    loginURL: '/login',   // 登录的url
    requestTypes: ['get', 'post', 'put', 'delete', 'patch'],  // 允许的请求方式
    urlExp: /^\/.+/,  // url正则 以'/'开头
};

