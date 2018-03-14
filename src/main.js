import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN'; // 设置antd为中文文案
import actions from 'store/syncActions';
import storage from 'utils/storage';
import jwt from 'utils/jwt';
import funs from 'utils/commonFuns';
import App from './app';
import store from './store';

// 添加全局变量
window.actions = actions;
window.storage = storage;
window.jwt = jwt;
window.funs = funs;

ReactDOM.render(
  <Router>
    <Provider store={ store }>
      <LocaleProvider locale={zhCN}>
        <App/>
      </LocaleProvider>
    </Provider>
  </Router>,
  document.getElementById('app'),
);
