/**
 * @desc 获取当前时间
 */

export function getNowFormatDate() {
    var date = new Date();
    var seperator1 = '/';
    var seperator2 = ':';
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + ' ' + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

/**
 * @desc 字符串超出固定字数，多余部分显示为'...'
 */
export function ellipsisWord(str, len) {
    if (str.length > len) {
        return str.substring(0, len) + '...';
    }

    return str;
}


/**
 *
 * @desc 生成指定范围随机数
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
export function randomNum(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

/**
 *
 * @desc   url参数转对象
 * @param  {String} url  default: window.location.href
 * @return {Object}
 */
export function parseQueryString(url) {
    url = url == null ? window.location.href : url;
    var search = url.substring(url.lastIndexOf('?') + 1);
    if (!search) {
        return {};
    }
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
}

/**
 *
 * @desc 随机生成颜色
 * @return {String}
 */
// export function randomColor() {
//     return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
// }

export function randomColor() {
    return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

/**
 *
 * @desc 获取浏览器类型和版本
 * @return {String}
 */
export function getExplore() {
    var sys = {},
        ua = navigator.userAgent.toLowerCase(),
        s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1] :
        (s = ua.match(/msie ([\d\.]+)/)) ? sys.ie = s[1] :
            (s = ua.match(/edge\/([\d\.]+)/)) ? sys.edge = s[1] :
                (s = ua.match(/firefox\/([\d\.]+)/)) ? sys.firefox = s[1] :
                    (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? sys.opera = s[1] :
                        (s = ua.match(/chrome\/([\d\.]+)/)) ? sys.chrome = s[1] :
                            (s = ua.match(/version\/([\d\.]+).*safari/)) ? sys.safari = s[1] : 0;
    // 根据关系进行判断
    if (sys.ie) return ('IE: ' + sys.ie);
    if (sys.edge) return ('EDGE: ' + sys.edge);
    if (sys.firefox) return ('Firefox: ' + sys.firefox);
    if (sys.chrome) return ('Chrome: ' + sys.chrome);
    if (sys.opera) return ('Opera: ' + sys.opera);
    if (sys.safari) return ('Safari: ' + sys.safari);
    return 'Unkonwn';
}

/**
 *
 * @desc 获取操作系统类型
 * @return {String}
 */
export function getOS() {
    var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
    var vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '';
    var appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';

    if (/mac/i.test(appVersion)) return 'MacOSX';
    if (/win/i.test(appVersion)) return 'windows';
    if (/linux/i.test(appVersion)) return 'linux';
    if (/iphone/i.test(userAgent) || /ipad/i.test(userAgent) || /ipod/i.test(userAgent)) 'ios';
    if (/android/i.test(userAgent)) return 'android';
    if (/win/i.test(appVersion) && /phone/i.test(userAgent)) return 'windowsPhone';
}

/**
 * @desc 深拷贝，支持常见类型
 * @param {Any} values
 */
export function deepClone(values) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == values || 'object' != typeof values) return values;

    // Handle Date
    if (values instanceof Date) {
        copy = new Date();
        copy.setTime(values.getTime());
        return copy;
    }

    // Handle Array
    if (values instanceof Array) {
        copy = [];
        for (var i = 0, len = values.length; i < len; i++) {
            copy[i] = deepClone(values[i]);
        }
        return copy;
    }

    // Handle Object
    if (values instanceof Object) {
        copy = {};
        for (var attr in values) {
            if (values.hasOwnProperty(attr)) copy[attr] = deepClone(values[attr]);
        }
        return copy;
    }

    throw new Error('Unable to copy values! Its type isn\'t supported.');
}

/**
 * 设置  本地缓存
 */
export function setStorage(key, obj) {
    if (typeof obj === 'string') {
        localStorage.setItem(key, obj);
    } else {
        localStorage.setItem(key, JSON.stringify(obj));
    }
}

/**
 * 获取
 */
export function getStorage(key) {
    let val = localStorage.getItem(key);
    try {
        return JSON.parse(val);
    } catch (e) {
        return val;
    }
}

/**
 * 删除， 如果不传值，删除所有
 */
export function clearStorage(key) {
    if (key) {
        localStorage.removeItem(key);
    } else {
        localStorage.clear();
    }
}

// 判断是否是 null, '', undefined
export function isNot(val) {
    if (val === null || val === '' || val === undefined) {
        return true;
    } else {
        return false;
    }
}

// 设置sessionstorage(append类型)
export function setSessionStorage(key, obj) {
    if(getSessionStorage(key)) {
        sessionStorage.removeItem(key);
    }
    if (typeof obj === 'string') {
        sessionStorage.setItem(key, obj);
    } else {
        sessionStorage.setItem(key, JSON.stringify(assignment(JSON.parse(sessionStorage.getItem(key)) || {}, obj)));
    }
}

export function getSessionStorage(name) {
    var data = sessionStorage.getItem(name);
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
}

export function assignment(result) {
    var stack = Array.prototype.slice.call(arguments, 1);
    var item;
    var key;
    while (stack.length) {
        item = stack.shift();
        for (key in item) {
            if (item.hasOwnProperty(key)) {
                if (typeof result[key] === 'object' && result[key] && Object.prototype.toString.call(result[key]) !== '[object Array]') {
                    if (typeof item[key] === 'object' && item[key] !== null) {
                        result[key] = assignment({}, result[key], item[key]);
                    } else {
                        result[key] = item[key];
                    }
                } else {
                    result[key] = item[key];
                }
            }
        }
    }
    return result;
}

// 内部函数, 用于判断对象类型
function _getClass(object) {
    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
}

export function isArray(obj) {
    return _getClass(obj).toLowerCase() === 'array';
}

export function isString(obj) {
    return _getClass(obj).toLowerCase() === 'string';
}

export function isDate(obj) {
    return _getClass(obj).toLowerCase() === 'date';
}

export function isObject(obj) {
    return _getClass(obj).toLowerCase() === 'object';
}

/**
 * @desc 判断参数是否为空, 包括null, undefined, [], '', {}
 * @param {object} obj 需判断的对象
 */
export function isEmpty(obj) {
    var empty = false;

    if (obj === null || obj === undefined) {    // null and undefined
        empty = true;
    } else if ((isArray(obj) || isString(obj)) && obj.length === 0) {
        empty = true;
    } else if (isObject(obj)) {
        var hasProp = false;
        for (let prop in obj) {
            if (prop) {
                hasProp = true;
                break;
            }
        }
        if (!hasProp) {
            empty = true;
        }
    }
    return empty;
}

export function buildTree(process, target) {
    const { nodes, edges } = process;
    const current = findNode(target.id);
    let treeNodes = [current], treeEdges = [];
    let stack = [target];
    while (stack.length) {
        let tempTarget = stack.pop();
        // 出栈，以新目标点，寻找子节点，然后放进栈中，
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            if (tempTarget.id === edge.endNodeId) {
                let child = findNode(edge.startNodeId);
                treeEdges.push(edge);
                treeNodes.push(child);
                stack.push(child);
            }
        }
    }

    function findNode(id) {
        return nodes.filter(function(node) {
            return node.id === id;
        })[0];
    }
    treeNodes = unique(treeNodes, 'id');
    treeEdges = unique(treeEdges, 'id');
    return {
        nodes: treeNodes, edges:treeEdges
    };
}

export function unique(arr, key) {
    const res = new Map();
    return arr.filter((a) => !res.has(a[key]) && res.set(a[key], 1));
}

export function shiftDate(date, numDays) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
}
