import { message } from 'antd';

export default {
  getRegVerify(self, params) { // 发送验证码
    if (self.state.time < 60) return;
    self.props.dispatch(actions.check({ url: 'auth/captcha', params, callback(res) {
      if (res && res.errno === 0) {
        window.setTimeout(() => {
          self.setState(preState => ({ timeText: 60 }));
          const intervalId = window.setInterval(() => {
            if (self.state.time > 0) {
              self.setState(preState => ({ time: preState.time - 1, timeText: preState.time - 1 }));
            } else {
              self.setState(() => ({ time: 60, timeText: '重新获取' }));
              window.clearInterval(self.state.intervalId);
            }
          }, 1000);
          self.setState(() => ({ intervalId }));
        }, 0);
        message.success('发送验证码成功,请注意查收！');
      } else {
        message.error(res ? (res.errmsg || '发送验证码失败！') : '接口异常，请稍后重试！');
      }
    } }));
  },
  formalTime(text) { // 格式化时间
    return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
  },
  formalDate(text) { // 格式化时间
    return text ? moment(text).format('YYYY-MM-DD') : '';
  },
};
