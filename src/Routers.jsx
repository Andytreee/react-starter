import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'; // 路由
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import renderRoutes from './utils/renderRoutes';
import routes from './pages/route';
import { inject, observer } from 'mobx-react';
import './css/reset.css';
import './css/common.less';

@observer
class Routers extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="container">
                    <ConfigProvider locale={zhCN}>
                        {renderRoutes(routes, true, '/login')}
                    </ConfigProvider>
                </div>
            </BrowserRouter>
        );
    }
}

export default hot(module)(Routers);
