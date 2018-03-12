import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
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
      <App/>
    </Provider>
  </Router>,
  document.getElementById('app'),
);
