import React from 'react';
import { connect } from 'react-redux';
import { Button, message, Icon } from 'antd';
import { Link, Route } from 'react-router-dom';
import appStyle from 'style/AppCont.less';
import Patch from 'views/Patch';
import Monitor from 'views/Monitor';
import AppInfo from 'views/AppInfo';

class AppCont extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appInfo: {},
    };
  }
  componentDidMount() {
    $('.appContent').scrollTop(0);
    this.getAppInfo();
  }
  getAppInfo() {
    const self = this;
    self.props.dispatch(actions.searchDetail({ url: 'app/info', tip: '获取app详情', params: { app_key: this.props.match.params.key }, callback(res) {
      if (res && res.errno === 0) {
        self.setState(preState => ({ appInfo: res.data }));
      }
    } }));
  }
  render() {
    const { pathname } = this.props.location;
    const matchUrl = this.props.match.url;
    return (
      <div className="appCont" class={ appStyle.appCont }>
        <div className="grid">
          <div className="grid-nav">
            <div className="app-info">
{/*               app图标 */}
              { this.state.appInfo.icon && <img className="app-logo" src={this.state.appInfo.icon} alt="app-logo" /> }
              { !this.state.appInfo.icon && <img className="app-logo" src={require('../assets/img/applogo-default.png')} alt="app-logo" /> }
{/*               app所属平台 */}
              { this.state.appInfo.platform === 1 ? <p className="platform"><Icon type="apple" /> iOS</p>
              : this.state.appInfo.platform === 2 ? <p className="platform"><Icon type="android" /> Android</p> : null }
              <p className="app-name">{ this.state.appInfo.name }</p>
{/*               app最新版本 */}
              <p className="app-version">App最新版本：{ this.state.appInfo.app_version || '' }</p>
{/*               应用包名 */}
              <p className="app-identifier">应用包名：{ this.state.appInfo.app_identifier }</p>
            </div>
            <div className="nav">
              <Link className={`nav-item ${/\/patch$/.test(pathname) ? 'link-active' : ''}`} to={`${matchUrl}/patch`}>
                <span>补丁下发</span>
                <Icon type="right" />
              </Link>
              <Link className={`nav-item ${/\/monitor$/.test(pathname) ? 'link-active' : ''}`} to={`${matchUrl}/monitor`}>
                <span>实时监控</span>
                <Icon type="right" />
              </Link>
              <Link className={`nav-item ${/\/appInfo$/.test(pathname) ? 'link-active' : ''}`} to={`${matchUrl}/appInfo`}>
                <span>App信息</span>
                <Icon type="right" />
              </Link>
            </div>
          </div>
          <div className="grid-content">
            <Route path="/applications/:key/patch" component={Patch} />
            <Route path="/applications/:key/monitor" component={Monitor} />
            <Route path="/applications/:key/appInfo" render={() => <AppInfo appInfo={this.state.appInfo} getAppInfo={this.getAppInfo.bind(this)} />} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(AppCont);
