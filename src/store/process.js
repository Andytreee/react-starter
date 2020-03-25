/*
import { autorun, observable, toJS, reaction } from 'mobx';
import {
    addEdge,
    deleteEdge,
    deleteNode,
    executeDag,
    getExcueteIdLast,
    getJupyterOutput,
    getOutput,
    getStatus,
    processForm,
    renameModule,
    setEndNode,
    setLocation,
    stopProcess,
    UpdateBg,
    getRunLog,
    fillData,
    getStdOutput,
    getHandlingOutput,
    getVariableOutput,
    getProcessCommit,
    TagAdd,
    UpdateRemarks,
    processOperateLogs,
    lockProcess,
    unlockProcess,
    UserNameList,
    updateParticipator,
    updateProcessOwner,
    getOutputData,
} from '../server';
import { getStorage, setStorage, shiftDate } from '../utils/util';
import { getConfigParams } from '../pages/progress/common';
import { numberType } from 'conf';
import { message } from 'antd';
import moment from 'moment';
import { NODES_CONFIG } from '../conf';

const date = new Date();
// app store
const App = observable.object({
    // "createBy":null,
    // "createDate":null,
    // "edges":[],
    // "id":"736661695593709568",
    // "lastExecuteId":null,
    // "lastExecuteStatus":"success",
    // "local":true,
    // "lockId":"100000000001",
    // "lockName":"超级管理员",
    // "name":"sf_test111",
    // "nextExecuteTime":null,
    // "nodes":[
    //     {
    //         "createBy":null,
    //         "createByName":null,
    //         "createDate":null,
    //         "endIndex":null,
    //         "id":"736845601714470912",
    //         "isEnd":null,
    //         "local":true,
    //         "locationX":0.0,
    //         "locationY":0.0,
    //         "name":null,
    //         "outSchema":null,
    //         "processId":"736661695593709568",
    //         "property":null,
    //         "resultFile":null,
    //         "runStatus":"unexecuted",
    //         "statistics":null,
    //         "type":"1101",
    //         "updateBy":null,
    //         "updateByName":null,
    //         "updateDate":null
    //     },
    //     {
    //         "createBy":null,
    //         "createByName":null,
    //         "createDate":null,
    //         "endIndex":null,
    //         "id":"736851356349890560",
    //         "isEnd":null,
    //         "local":true,
    //         "locationX":0.0,
    //         "locationY":0.0,
    //         "name":null,
    //         "outSchema":null,
    //         "processId":"736661695593709568",
    //         "property":null,
    //         "resultFile":null,
    //         "runStatus":"unexecuted",
    //         "statistics":null,
    //         "type":"1101",
    //         "updateBy":null,
    //         "updateByName":null,
    //         "updateDate":null
    //     }
    // ],
    // "publishConfig":null,
    // "publishUrl":null,
    // "remarks":null,
    // "resourceLevel":null,
    // "snapshot":null,
    // "status":"waiting",
    // "statusDel":null,
    // "tagList":[],
    // "tags":null,
    // "updateBy":null,
    // "updateDate":null
    process:  getStorage('process') || {},
    curNodeId : localStorage.getItem('curNodeId') || '',
    runNodeId: '',   // 执行节点id
    pollingTimer: null,
    selectDefData: {},
    canvas: null,
    uploading: false,  // 上传文件
    percent: '', // 上传百分比
    outputData: [],
    nodeLog: '',  // 节点输出日志
    logs: [],    //  操作日志
    userList: [],  // 可添加至本流程的用户
    commits: Array.from({length: 91}).map( (item, index) => ({
        date: shiftDate( date, -index),
        count: 0,
    })), // 提交记录
    get curNode () {
        const nodes = App.process.nodes;
        return nodes ? (nodes.filter( node => node.id == App.curNodeId)[0] || getStorage('curNode')) : getStorage('curNode');
    },
    // 获取流程
    getProcess: async (id = App.process.id) => {
        if(!id) return window.location.href = '/';
        const data = await processForm({ id });
        if(data) {
            data.nodes = data.nodes.map( node => {
                const property = node.property;
                return {
                    ...node,
                    outSchema: node.outSchema && typeof node.outSchema === 'string' ? JSON.parse(node.outSchema) : node.outSchema,
                    property: property ? JSON.parse(property) : null,
                }
            })
            App.process = data;
        }
        return data;
    },
    // 设置当前节点
    setCurNode: id  => {
        App.curNodeId = id;
        App.setNodeConfig(id);
    },
    // 更新节点信息
    updateNode: (id,data) => {
        App.process.nodes = App.process.nodes.map( node => {
            if(node.id == id ) {
                node = {
                    ...node,
                    ...data,
                }
                console.log(toJS(node) )
            }
            return node;
        });
    },
    //  设置节点参数
    setNodeConfig: (id) => {
        App.selectDefData = getConfigParams(App.process, id)
    },
    // 运行节点
    executeNode: async (property = {}) =>{
        try {
            App.process.status = 0;
            const { id: processId, local  } = App.process;
            let { curNode } = App;
            const res = await executeDag({nodes: [{
                    ...curNode,
                    ...property
                }], edges: [], processId, saveConfig: 1, local});
            if(res) {
                console.log(res)
                App.executeId = res.executeId;
                App.pollStatus(res.executeId);
                clearInterval(App.pollingTimer);
                App.pollingTimer = setInterval( App.pollStatus, 3 * 1000, res.executeId, true );
            }else{
                App.process.status = null;
            }
        }catch(e) {
            console.error(e);
            App.process.status = -1;
        }
    },
    // 停止运行
    stop: async () => {
        try{
            const res = await stopProcess({id: App.process.executeId});
            clearInterval(App.pollingTimer);
        }catch(e) {
            console.error(e)
        }
    },
    // 删除节点
    deleteNode: async () =>{
        const id = App.curNodeId;
        const res = await deleteNode({
            id: App.curNodeId,
            processId: App.process.id,
            type: App.curNode.type
        });
        App.process.nodes = App.process.nodes.filter(node => {
            return node.id !== id
        });
        App.process.edges = App.process.edges.filter( ({endNodeId, startNodeId}) =>{
            return endNodeId !== id && startNodeId !== id
        });
        return res;
    },
    // 删除边
    deleteEdge: async edge => {
        try {
            const res = await deleteEdge(edge);
            if(res) {
                App.process.edges = App.process.edges.filter( ({id}) => id !== edge.id);
            }
            return res;
        }catch(e) {
            console.error(e)
            return false;
        }
    },
    // 连结果线
    link2End: async (params, endIndex) => {
        let res;
        try{
            res = await setEndNode(params);
            App.process.nodes = App.process.nodes.map(node => {
                if(node.id === params.id ) {
                    node = {
                        ...node,
                        endIndex
                    }
                }
                return node;
            })
        }catch(e){
            console.error(e)
        }finally {
            return res;
        }
    },
    // 增加边
    addLink: async edge => {
        const edgeId = await addEdge(edge);
        const data = App.process;
        data.edges.push({
            ...edge,
            id: edgeId,
        });
        return edgeId;
    },
    // 设置节点位置
    setNodeLocation: async params => {
        try{
            await setLocation(params);
            App.updateNode(params.id, {
                locationX: params.locationX,
                locationY: params.locationY,
            })
        }catch (e) {
            console.error(e);
        }
    },
    // 查询流程最后运行情况
    checkExecuteStatus: async () => {
        const { lastExecuteId } = App.process;
        if(lastExecuteId) {
            App.pollStatus(lastExecuteId)
        }
    },
    // 轮询节点运行状态
    pollStatus: async (executeId, isExecute) => {
        const res = await getStatus({ executeId });
        updateAppInfo(res);
        switch(res.status){
            case 'waiting':
            case 'running':
                break;
            case 'canceled':
            case 'success':
            case 'failed':
                clearInterval(App.pollingTimer);
                const data = await App.getProcess();
                isExecute && res.status === 'success' && message.info('运行成功!');
                // 同步canvas中的配置项
                if(App.canvas && data.nodes && data.nodes.length){
                    App.canvas.gdata.nodes && App.canvas.gdata.nodes.forEach( val => {
                        if(val.id === App.runNodeId){
                            val.data.property = App.curNode.property;
                        }
                    });
                }
                break;
        }
    },
    // 模块改名
    rename: async name => {
        let res = true;
        try{
            const id = App.curNodeId;
            await renameModule({
                id,
                name,
            });
            App.updateNode(id, { name })
        } catch(e) {
            res = false;
        }
        return res;
    },
    // 查询节点输出
    getNodeOutput: async (id = App.curNodeId) => {
        try {
            const res = await getOutput({id});
            let outputData = {};
            let index = 0;
            if(res.hasOwnProperty('outTableMeta')) {
                const outTableMeta = JSON.parse(res['outTableMeta']);
                for(const key in outTableMeta) {
                    if(outTableMeta.hasOwnProperty(key)) {
                        console.log(JSON.parse(res['statistics']))
                        outputData[key] = {
                            outTableMeta: outTableMeta[key],
                            statisticData: JSON.parse(res['statistics'])[key],
                            resultFile: JSON.parse(res['resultFile'])[key]
                        };
                        index++;
                    }
                }
            }
            outputData.length = index;
            outputData = Array.from(outputData);
            const data = await Promise.all(outputData.map(({resultFile: path}) => getOutputData({
                path,
                local: App.process.local,
            })));
            outputData = outputData.map( (item,i) =>({ ...item, outData: data[i]}))
            App.outputData = outputData;
        }catch(e) {
            App.outputData = [];
            console.error(e);
        }
    },
    // 查询节点输出日志
    getNodeLog: async (nodeId = App.curNodeId) => {
        try {
            App.nodeLog = await getRunLog({nodeId});
        }catch(e) {
            App.nodeLog = '';
            console.error(e);
        }
    },
    //notebook模块
    asyncNotebookStatus: async (id) => {
        const curNode =  App.curNode;
        const res = await getJupyterOutput({id});
        if(res && res.length) {
            curNode.status = 2;
        }
    },
    // 获取模块配置信息
    queryConfig: async (nodeId, type) => {
        try {
            const curNode = App.curNode;
            let data = [], key = '';
            switch (type) {
                case 'miss':
                    key = 'dataFills';
                    data = await fillData({ nodeId });
                    data = data.map( item => ({
                        ...item,
                        handling: item.handling || 'none',
                        key: item.featureName
                    }));
                    break;
                case 'dataStd':
                    key = 'dataNormals';
                    data = await getStdOutput({ nodeId });
                    data = data.map( item =>  ({
                        ...item,
                        handling: item.handling || 'none',
                        key: item.featureName
                    }));
                    break;
                case 'abnormal':
                    key = 'abnormals';
                    data = await getHandlingOutput({ nodeId });
                    data = data.map( item =>  ({
                        ...item,
                        handling: numberType.includes(item.featureType) ? (item.handling || 'box_deal') : 'none',
                        dealType: item.dealType || 'none',
                        key: item.featureName
                    }));
                    break;
                case 'var':
                    key = 'selectfileds';
                    const { current = [] } = await getVariableOutput({ nodeId });
                    const nameMap = new Map((current || []).map(item => [item.featureName, +item.deal]));
                    data = App.selectDefData[0].property.outTableMeta[App.selectDefData[0].outIndex]
                        .map( item => ({
                            deal: null,
                            featureName: item.fieldName,
                            featureType: item.valueType,
                            prefix: item.fieldName,
                            convert: false,
                        }))
                        .filter( ({featureType}) => featureType === 'string')
                        .map(item => {
                            const deal = nameMap.get(item.featureName);
                            if(deal || deal === 0) {
                                item.convert = true;
                                item.deal = deal;
                            }
                            return item;
                        });
                    break;
            }
            curNode.property[key] = data;
            return data;
        }catch (e) {
            console.error(e)
        }
    },
    // 获取流程提交记录
    queryCommits: async createDate => {
        try{
            App.commits = await getProcessCommit({
                targetId: App.process.id,
                createDate,
                targetType: 'process'
            });
        }catch (e) {
            console.error(e)
        }
    },
    // 更新流程标签
    updateProcessTags: async ( type, tag) => {
        try{
            let tagList = [...App.process.tagList || []];
            switch(type) {
                case 'add':
                    tagList.push(tag);
                    break;
                case 'delete':
                    tagList = tagList.filter( item => item !== tag);
                    break;
            }
            const res = await TagAdd({
                id: App.process.id,
                tagList
            });
            if(res) {
                App.process = {
                    ...App.process,
                    tagList
                }
            }
            return res;
        }catch (e) {
            console.error(e)
        }
    },
    // 更新流程备注
    updateProcessRemarks: async (remarks) => {
        if(remarks === App.process.remarks) return true;
        try{
            const res = await UpdateRemarks({
                id: App.process.id,
                remarks
            });
            if(res) {
                App.process = App.process = {
                    ...App.process,
                    remarks
                };
            }
            return res;
        }catch (e) {
            console.error(e)
        }
    },
    queryProcessOperateLogs: async (pageNo = 1) => {
        try{
            const res = await processOperateLogs({
                processId: App.process.id,
                pageSize: 10,
                pageNo: pageNo++,
                targetType: 'component,process'
            });
            if(res) {
                let { list, hasNextPage } = res;
                const today = moment().format('YYYY-MM-DD');
                // list.reverse();
                list = list.map( item => {
                    let [ date, time ] = moment(item.operateDate).format('YYYY-MM-DD HH:mm').split(' ');
                    date = moment(date+ ' ' + time, 'YYYY-MM-DD HH:mm').fromNow();
                    return {
                        ...item,
                        date: date === today ? '今天' : date,
                        time,
                        moduleName: item.targetType === 'component' ?  NODES_CONFIG[item.targetName].text : ''
                    };
                });
                App.logs.push(...list);
                App.pageNo = pageNo;
                return hasNextPage;
            }
        }catch (e) {
            console.error(e)
        }
    },
    lockProcess: async () => {
        try{
            const res = await lockProcess({
                id: App.process.id,
            });
            return res;
        }catch (e) {
            console.error(e)
        }
    },
    unlockProcess: async () => {
        try{
            const res = await unlockProcess({
                id: App.process.id,
            });
            return res;
        }catch (e) {
            console.error(e)
        }
    },
    queryUserList: async text => {
        try {
            const res = await UserNameList({
                pageNo: 1,
                pageSize: 5,
                userName: text
            });
            const userList = res.list.map( user => ({
                id: user.id,
                loginName: user.loginName,
                userName: user.userName,
            }));
            App.userList = userList
            console.log(App.userList)
            return userList;
        }catch (e) {
            console.error(e)
        }
    },
    updateParticipator: async users => {
        users = [...new Set(users)];
        const data = {
            processId: App.process.id,
            userIdList: users
        };
        try {
            const res = await updateParticipator(data);
            if(res) {
                App.process = {
                    ...App.process,
                    participators: res
                }
            }
            return res;
        }catch (e) {
            console.error(e)
        }
    },
    updateProcessOwner: async ownerId => {
        try {
            const res = await updateProcessOwner({
                id: App.process.id,
                ownerId,
            });
            if(res) {
                const { ownerId, ownerName, participators } = res;
                App.process = {
                    ...App.process,
                    ownerId,
                    ownerName,
                    participators
                }
            }
            return res;
        }catch (e) {
            console.error(e)
        }
    },

});
// 最后一次操作5s后无操作 快照一次
autorun (async () => {
    if(App.canvas){
        let node = document.querySelector("#capture");
        if(node){
            const canvas = await html2canvas(node);
            await UpdateBg({ id: App.process.id, snapshot: canvas.toDataURL()});
        }
    }
}, { delay: 5 * 1000 });

// 自动保存流程信息
autorun ( () => {
    setStorage('curNodeId', App.curNodeId);
    setStorage('process', App.process);
});


function updateAppInfo({ status, nodes}) {
    // App.process.status = status;
    // App.canvas.status = status;
    // App.process.nodes = App.process.nodes.map(item => {
    //     nodes.forEach(node => {
    //         if(item.id === node.id) {
    //             App.runNodeId = node.id;
    //             item.status = node.status;
    //         }
    //     });
    //     return item;
    // });
}


export default App;
*/
