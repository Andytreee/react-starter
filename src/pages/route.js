import React from 'react';
import loadable from '@loadable/component'
// import Header from '../components/Header'
const Header = loadable(() => import(
    /* webpackPrefetch: true */
    /* webpackChunkName: 'Header'*/
    '../components/Header.js'
    ));

const routes = [
    {
        path: '/',
        exact: true,
        component:  props => <Header {...props}/>,
        requiresAuth: true,
    }
];

export default routes
