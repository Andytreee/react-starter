import React, { Component } from 'react';
import { User } from 'server/index';

export default class Header extends Component{
    componentDidMount() {
        // User().then(console.log)
    }
    
    render() {
        return (<div style={{textAlign: 'center'}}>Welcome</div>)
    }
}
