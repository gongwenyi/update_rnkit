import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Layout, Menu, Icon, Avatar } from 'antd';
import './App.css';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';

const SubMenu = Menu.SubMenu;
const { Header, Content, Sider, Footer } = Layout;

class App extends Component {
  state = {
    current: 'mail',
  }
  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }
  render() {
    return (
      <Router>
        <Layout>
          <Header className="header" style={{position: 'fixed', width: '100%'}}>
            <div className="logo" >
              <img src={require('./images/logo.png')}/>
            </div>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ float: 'right', lineHeight: '64px' }}
            >
              <Menu.Item key="1"><Link to="/">首页</Link></Menu.Item>
              <Menu.Item key="2">我的应用</Menu.Item>
              <Menu.Item key="3">文档</Menu.Item>
              <Menu.Item key="4">工具</Menu.Item>
              <Menu.Item key="5">SDK下载</Menu.Item>
              <Menu.Item key="6"><Link to="/login">登录</Link></Menu.Item>
              <Menu.Item key="7"><Link to="/register">注册</Link></Menu.Item>
              <SubMenu title={<Avatar size="large" src={require('./images/avatar.png')} />}>
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                  <Menu.Item key="setting:3">Option 3</Menu.Item>
                  <Menu.Item key="setting:4">Option 4</Menu.Item>
              </SubMenu>
            </Menu>
          </Header>
          <Content style={{ marginTop: '64px', minHeight: '600px' }}>
            <Route exact path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      </Router>
    );
  }
}

export default App;
