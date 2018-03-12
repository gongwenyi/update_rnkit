import React from 'react';
import { connect } from 'react-redux';
import { Route, Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Avatar } from 'antd';
// 添加全局样式
import 'assets/css/common.css';
import 'assets/css/personal.css';
import 'assets/css/reset.css';
// 引入本组件样式
import appStyle from 'style/App.less';
import Home from 'views/Home';
import Login from 'views/Login';
import Bind from 'views/Bind';
import Applications from 'views/Applications';
import Register from 'views/Register';
import ChangePassword from 'views/ChangePassword';
import ForgetPassword from 'views/ForgetPassword';

const { Header, Content } = Layout;
const { SubMenu, MenuItemGroup } = Menu;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  menuClick({ item, key, keyPath }) {
    const self = this;
    if (key === '/loginOut') {
      self.props.dispatch(actions.saveNewOrSaveChange({ url: 'auth/logout', tip: '退出', params: { token: jwt.getToken() }, callback(res) {
        if (res && res.errno === 0) {
          jwt.removeToken();
          self.props.dispatch({ type: 'COMMON_CHANGE', keyValue: { authIsLogin: false } });
          self.props.history.push('/login');
        }
      } }));
    }
  }
  render() {
    return (
        <Layout className="app" class={ appStyle.app }>
          <Header className="appHeader">
            <div className="appHeaderWrap">
              <img src={require('assets/img/logo.png')}/>
              <Menu
                theme="dark"
                mode="horizontal"
                onClick={this.menuClick.bind(this)}
                selectedKeys={[this.props.location.pathname]}
                >
                <Menu.Item key="/"><Link to="/">首页</Link></Menu.Item>
                { this.props.authIsLogin && <Menu.Item key="/applications"><Link to="/applications">我的应用</Link></Menu.Item> }
                <Menu.Item key="/documents"><a href="https://github.com/rnkit/rnkit-code-push-docs" target="_blank">文档</a></Menu.Item>
                <Menu.Item key="/tools"><a href="https://github.com/rnkit/rnkit-code-push-cli" target="_blank">工具</a></Menu.Item>
                <Menu.Item key="/sdkDownload"><a href="https://github.com/rnkit/rnkit-code-push" target="_blank">SDK下载</a></Menu.Item>
                { !this.props.authIsLogin && <Menu.Item key="/login"><Link to="/login">登录</Link></Menu.Item> }
                { !this.props.authIsLogin && <Menu.Item key="/register"><Link to="/register">注册</Link></Menu.Item> }
                { this.props.authIsLogin && <SubMenu title={<Avatar size="large" src={require('assets/img/avatar.png')}/>}>
                    <Menu.Item key="/bind"><Link to="/bind">绑定手机/邮箱</Link></Menu.Item>
                    <Menu.Item key="/changePassword"><Link to="/changePassword">修改密码</Link></Menu.Item>
                    <Menu.Item key="/loginOut"><span>退出登录</span></Menu.Item>
                </SubMenu> }
              </Menu>
            </div>
          </Header>
          <Content className="appContent">
            <div className="contentWrap">
              <Route exact path="/" component={Home}/>
              <Route path="/bind" component={Bind}/>
              <Route path="/applications" component={Applications}/>
              <Route path="/login" component={Login}/>
              <Route path="/register" component={Register}/>
              <Route path="/changePassword" component={ChangePassword}/>
              <Route path="/forgetPassword" component={ForgetPassword}/>
            </div>
            <footer className="footer">
              <div className="footer-content"></div>
              <div className="page-footer-copyright">
                Copyright © 2012-<span id="yearNew">2017</span> 深圳市投桃互动网络科技有限公司 ｜<a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030402000264">粤公网安备 44030402000264号</a>｜<a href="http://www.miitbeian.gov.cn/publish/query/indexFirst.action" target="_blank">粤ICP备15091171号-5</a>
              </div>
            </footer>
          </Content>
        </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authIsLogin: state.authIsLogin,
  };
};

export default withRouter(connect(mapStateToProps)(App)); // 使用 withRouter 将 router 信息传递给该组件的 props，注：withRouter需要放在外层
